import { client } from '../repositories/redis';

export const fullCanvas = async (): Promise<number[]> => {
  let canvas: string[] | number[] = await client.lRange('canvas', 0, -1);
  canvas = canvas.map(v => parseInt(v));
  return canvas;
}