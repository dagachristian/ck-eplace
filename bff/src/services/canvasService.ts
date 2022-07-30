import config from '../config';
import { ckCanvasTbl, ckCanvasSubsTbl } from '../repositories/db';
import { client } from '../repositories/redis';
import Query, { Tx } from '../repositories/db/Query';
import type { ICanvas, ICanvasInfo, ICanvasSub } from './interfaces';
import { ApiError, Errors } from '../errors';
import { v4 } from 'uuid';
import { currentContext } from '../context';
import { getUser } from './userService';
import * as canvasFnctns from './canvasFunctions';

interface IFilters {
  query: string,
  user: string,
  sortBy: 'size' | 'created' | 'name' | 'subs',
  sortByOrder: 'asc' | 'desc',
  page: number
}

const publishCanvas = (canvas: ICanvas) => {
  delete canvas.created;
  delete canvas.createdBy;
  delete canvas.lastModified;
  delete canvas.lastModifiedBy;
  delete canvas.ts;
  return canvas;
}

export const getCanvases = async (filters: Partial<IFilters>, userId?: string) => {
  const pageSize = 25;
  let query = `
    SELECT c.*, COUNT(cs.user_id) AS subs 
    FROM ck_canvas c LEFT OUTER JOIN ck_canvas_sub cs 
    ON c.id = cs.canvas_id 
    WHERE`;
  let params = [];
  let fltUserId;
  if (filters.query) {
    query += ` ts @@ to_tsquery('english', $1) AND`;
    params.push(filters.query);
  }
  if (filters.user) {
    fltUserId = (await getUser(filters.user)).id;
    query += ` c.user_id = '${fltUserId}' AND`;
  }
  if (userId && fltUserId == userId)
    query = query.slice(0, -3);
  else if (userId)
    query += ` (cs.user_id = '${userId}' OR c.private = false)`;
  else
    query += ' c.private = false ';
  query += `
    GROUP BY c.id 
    ORDER BY ${filters.sortBy || 'subs'} ${filters.sortByOrder || 'desc'} 
    OFFSET ${((filters.page || 1)-1)*pageSize} 
    LIMIT ${pageSize};
  `
  const ret = await Query.raw(query, params)
  return { canvases: ret.map(v => publishCanvas(v)) }
}

export const getCanvas = async (canvasId: string, type?: string, userId?: string) => {
  let subs: ICanvasSub[] = [];
  
  // must be consistent with redis list length
  let canvas: Buffer | Partial<ICanvas> | null = await client.getBuffer(canvasId || '0');
  if (!canvas) throw new ApiError(Errors.NOT_EXIST);
  
  switch (type) {
    case 'png':
      canvas = await canvasFnctns.b8ToPNG(canvas);
      break;
    case 'bmp':
      canvas = canvasFnctns.b8ToBMP(canvas);
      break;
    default:
      if (canvasId != '0') {
        canvas = await Query.findOne({t: 'ck_canvas'}, {
          where: {
            clause: 't.id = :canvasId',
            params: { canvasId }
          }
        }) || {} as Partial<ICanvas>
        subs = await Query.findMany({t: 'ck_canvas_sub'}, {
          where: {
            clause: 't.canvas_id = :canvasId',
            params: { canvasId }
          }
        })
        if (canvas.private && !(userId && (canvas.userId == userId || subs.filter((v) => v.userId == userId))))
          throw new ApiError(Errors.UNAUTHORIZED);
      }
      canvas = publishCanvas({
        id: '0',
        userId: '0',
        name: 'El Grande',
        size: config.canvas.size,
        timer: 0,
        private: false,
        img: '/canvas/0?type=png',
        ...canvas,
        subs: subs.map((v) => v.userId)
      })
      break;
  }

  return canvas;
}

export const populateCanvas = async (id: string, size: number) => {
  size = size*size
  const val = 0xff
  let vals = [];
  for (let i=0;i<size;i++) {
    // vals.push(Buffer.from([Math.floor(Math.random()*255)]))
    vals.push(val)
  }
  await client.set(id, Buffer.from(vals))
}

export const createCanvas = async (canvasOptions: ICanvasInfo) => {
  const ctx = currentContext();
  const id = v4();
  const data = {
    id,
    userId: ctx.userId,
    size: 20,
    timer: 0,
    private: false,
    img: `/canvas/${id}?type=png`,
    ...canvasOptions
  }
  delete data.subs;

  const tx = new Tx();
  await tx.begin();
  const canvas = await ckCanvasTbl.save(data, tx) as ICanvas;
  canvasOptions.subs?.forEach(async sub => {
    await ckCanvasSubsTbl.save({userId: (await getUser(sub)).id, canvasId: id}, tx)
  })
  await tx.commit();

  if (!canvas) throw new ApiError(Errors.API, 'failed to create canvas')

  await populateCanvas(id, canvas.size);

  return publishCanvas({...canvas, subs: [], ...canvasOptions} as ICanvas)
}

export const updateCanvas = async (canvasId: string, canvasOptions: ICanvasInfo) => {
  const ctx = currentContext();
  const canvas = await ckCanvasTbl.update(canvasOptions, {
    clause: 't.id = :canvasId AND t.user_id = :userId',
    params: { canvasId, userId: ctx.userId }
  });
  if (!canvas) throw new ApiError(Errors.NOT_EXIST, 'canvas does not exist')
  return publishCanvas(canvas);
}

export const deleteCanvas = async (canvasId: string) => {
  const ctx = currentContext();
  const canvas = await ckCanvasTbl.delete({
    clause: 't.id = :canvasId AND t.user_id = :userId',
    params: { canvasId, userId: ctx.userId }
  }) as ICanvas;
  if (!canvas) throw new ApiError(Errors.NOT_EXIST, 'canvas does not exist')
  await client.del(canvasId)
  return publishCanvas(canvas);
}

export const addSub = async (subId: string, canvasId: string) => {
  const sub = await ckCanvasSubsTbl.save({
    userId: subId,
    canvasId
  });
  if (!sub) throw new ApiError(Errors.API, 'failed to create sub')
  return sub;
}

export const removeSub = async (subId: string, canvasId: string) => {
  const sub = await ckCanvasSubsTbl.delete({
    clause: 't.user_id = :userId AND t.canvas_id = :canvasId',
    params: { userId: subId, canvasId}
  });
  if (!sub) throw new ApiError(Errors.API, 'failed to delete sub')
  return sub;
}