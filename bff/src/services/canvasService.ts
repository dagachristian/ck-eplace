import { canvasFnctns } from '@ck/common';

import { currentContext } from '../context';
import config from '../config';
import { ckCanvasHistoryTbl } from '../repositories/db';
import { client } from '../repositories/redis';
import Query from '../repositories/db/Query';

export const getCanvas = async (date?: string) => {
  if (date) {
    return await Query.findOne({t: 'ck_canvas_history'}, {
      where: {
        clause: 't.date = :date',
        params: { date }
      }
    }) as Buffer
  }
  // must be consistent with redis list length
  const size = config.canvas.size*config.canvas.size;
  let canvas = await client.lrangeBuffer('canvas', 0, -1);
  return Buffer.concat(canvas, size);
}

export const saveCanvas = async () => {
  const ctx = currentContext();
  const canvas = await getCanvas();
  await ckCanvasHistoryTbl.save({
    date: ctx.now,
    img: canvas
  })
}