import config from '../config';
import { client } from '../repositories/redis';

export const fullCanvas = async (): Promise<Buffer> => {
  const size = config.canvas.size*config.canvas.size;
  let canvas: string[] | number[] = await client.lRange('canvas', 0, -1);
  canvas = canvas.splice(0, size).map(v => parseInt(v));
  const buf = Buffer.from(new ArrayBuffer(size))
  buf.set(canvas)
  return buf;
}