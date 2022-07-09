import config from '../config';
import { client } from '../repositories/redis';

export const fullCanvas = async (): Promise<Buffer> => {
  const size = config.canvas.size*config.canvas.size;
  let canvas = await client.lrangeBuffer('canvas', 0, -1);
  return Buffer.concat([...canvas], size);
}