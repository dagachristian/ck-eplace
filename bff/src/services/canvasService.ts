import config from '../config';
import { ckCanvasTbl, ckCanvasSubsTbl } from '../repositories/db';
import { client } from '../repositories/redis';
import Query, { Tx } from '../repositories/db/Query';
import { ICanvas, ICanvasSub } from './interfaces';
import { ApiError, Errors } from '../errors';
import { v4 } from 'uuid';

const publishCanvas = (canvas: ICanvas) => {
  delete canvas.created;
  delete canvas.createdBy;
  delete canvas.lastModified;
  delete canvas.lastModifiedBy;
  return canvas;
}

export const getCanvas = async (canvasId: string, userId?: string): Promise<ICanvas> => {
  let canvas: Partial<ICanvas> = {};
  let subs: ICanvasSub[] = []
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
    if (canvas.private && !(userId && subs.filter((v) => v.userId == userId)))
      throw new ApiError(Errors.UNAUTHORIZED);
  }
  // must be consistent with redis list length
  const canvasImg = await client.getBuffer(canvasId || '0');
  canvas = {
    id: '0',
    userId: '0',
    size: config.canvas.size,
    timer: 0,
    private: false,
    ...canvas,
    img: canvasImg as Buffer | undefined,
    subs: subs.map((v) => v.userId)
  }

  return publishCanvas(canvas as ICanvas);
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



export const createCanvas = async (userId: string, canvasOptions: Partial<ICanvas>) => {
  const id = v4();
  const data = {
    ...canvasOptions,
    id,
    userId
  }
  delete data.subs;

  const tx = new Tx();
  await tx.begin();
  const canvas = await ckCanvasTbl.save(data, tx);
  await ckCanvasSubsTbl.save({userId, canvasId: id}, tx)
  canvasOptions.subs?.forEach(async sub => await ckCanvasSubsTbl.save({sub, canvasId: id}, tx))
  await tx.commit();

  await populateCanvas(id, canvasOptions.size!);

  return publishCanvas(canvas as ICanvas)
}