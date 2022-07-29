import { client } from '../repositories/redis';
import { cnvnsp } from '.';

function byteString(n: number) {
  if (n < 0 || n > 255 || n % 1 !== 0) {
      throw new Error(n + " does not fit in a byte");
  }
  return ("000000000" + n.toString(2)).slice(-8)
}

export const updatePixel = (canvasId: string, size: number) => {
  return async ({ color, x, y }: { size: number, color: number, x: number, y: number }) => {
    const idx = (size * y + x) << 3;
    const bits = byteString(color);
    const pipeline = client.pipeline();
    for (let i=0;i<8;i++) {
      pipeline.setbit(canvasId, idx+i, bits[i])
    }
    await pipeline.exec();
    console.log('updated pixel', canvasId);
    cnvnsp.to(canvasId).emit('updatePixel', { color, x, y })
  }
}
