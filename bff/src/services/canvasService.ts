import config from '../config';
import { ckCanvasTbl, ckCanvasSubsTbl } from '../repositories/db';
import { client } from '../repositories/redis';
import Query, { Tx } from '../repositories/db/Query';
import { ICanvas, ICanvasInfo, ICanvasSub } from './interfaces';
import { ApiError, Errors } from '../errors';
import { v4 } from 'uuid';

const publishCanvas = (canvas: ICanvas) => {
  delete canvas.meta;
  delete canvas.created;
  delete canvas.createdBy;
  delete canvas.lastModified;
  delete canvas.lastModifiedBy;
  return canvas;
}

export const getCanvases = async (userId?: string) => {
  const publicCanvases = await Query.findMany(
    {
      c: 'ck_canvas',
    },
    {
      where: {
        clause: 'c.private = :private OR (c.private <> :private AND c.user_id = :userId)',
        params: { private: false, userId }
      }
    }
  )

  const subbedCanvases = await Query.findMany(
    {
      c: 'ck_canvas',
      cs: 'ck_canvas_sub'
    },
    {
      select: {
        clause: 'c.*'
      },
      join: {
        cs: 'cs.canvas_id = c.id',
      },
      where: {
        clause: 'cs.user_id = :userId',
        params: { userId }
      }
    }
  )

  return { canvases: [...publicCanvases, ...subbedCanvases].map(v => publishCanvas(v)) }
}

export const getCanvas = async (canvasId: string, userId?: string) => {
  let canvas: Partial<ICanvas> = {};
  let subs: ICanvasSub[] = [];
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
  // must be consistent with redis list length
  const canvasImg = await client.getBuffer(canvasId || '0');
  if (!canvasImg) throw new ApiError(Errors.NOT_EXIST);
  canvas = {
    id: '0',
    userId: '0',
    name: 'El Grande',
    size: config.canvas.size,
    timer: 0,
    private: false,
    img: '/canvas/0?type=png',
    ...canvas,
    subs: subs.map((v) => v.userId)
  }

  return { canvas: publishCanvas(canvas as ICanvas), buffer: canvasImg};
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

export const createCanvas = async (userId: string, canvasOptions: ICanvasInfo) => {
  const id = v4();
  const data = {
    id,
    userId,
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
  canvasOptions.subs?.forEach(async sub => await ckCanvasSubsTbl.save({sub, canvasId: id}, tx))
  await tx.commit();

  if (!canvas) throw new ApiError(Errors.API, 'failed to create canvas')

  await populateCanvas(id, canvas.size);

  return publishCanvas({...canvas, subs: [], ...canvasOptions} as ICanvas)
}

export const updateCanvas = async (canvasId: string, userId: string, canvasOptions: ICanvasInfo) => {
  const canvas = await ckCanvasTbl.update(canvasOptions, {
    clause: 't.id = :canvasId AND t.user_id = :userId',
    params: { canvasId, userId }
  });
  if (!canvas) throw new ApiError(Errors.NOT_EXIST, 'canvas does not exist')
  return publishCanvas(canvas);
}

export const deleteCanvas = async (userId: string, canvasId: string) => {
  const canvas = await ckCanvasTbl.delete({
    clause: 't.id = :canvasId AND t.user_id = :userId',
    params: { canvasId, userId }
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