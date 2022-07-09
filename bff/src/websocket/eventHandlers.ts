import { client } from '../repositories/redis';
import config from '../config';
import { cnvnsp } from '.';

export const updatePixel = async ({ color, x, y }: { color: number, x: number, y: number }) => {
  await client.lset('canvas', config.canvas.size * y + x, Buffer.from([color]))
  console.log('updated pixel');
  cnvnsp.emit('updatePixel', { color, x, y })
}