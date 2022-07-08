import { client } from '../repositories/redis';

export const fullCanvas = async (): Promise<Buffer> => {
  let canvas: string[] | number[] = await client.lRange('canvas', 0, -1);
  canvas = canvas.map(v => parseInt(v));
  return Buffer.from(canvas);
}