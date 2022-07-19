import { client } from '../repositories/redis';
import config from '../config';
import { cnvnsp } from '.';

function byteString(n: number) {
  if (n < 0 || n > 255 || n % 1 !== 0) {
      throw new Error(n + " does not fit in a byte");
  }
  return ("000000000" + n.toString(2)).substr(-8)
}

export const updatePixel = async ({ color, x, y }: { color: number, x: number, y: number }) => {
  const idx = (config.canvas.size * y + x) << 3;
  const bits = byteString(color);
  const pipeline = client.pipeline();
  for (let i=0;i<bits.length;i++) {
    pipeline.setbit('canvas', idx+i, bits[i])
  }
  await pipeline.exec();
  console.log('updated pixel');
  cnvnsp.emit('updatePixel', { color, x, y })
}