import { PNG } from 'pngjs';
import bmp from 'bmp-js';

export const b8ToPNG = (buffer: Buffer) => {
  const dim = Math.floor(Math.sqrt(buffer.length));
  const png = new PNG({
    width: dim,
    height: dim,
  })
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const v = buffer[y + x];
      png.data[idx] = (v >> 5) * 32;
      png.data[idx+1] = ((v & 28) >> 2) * 32;
      png.data[idx+2] = (v & 3) * 64;
      png.data[idx+3] = 255;
    }
  }
  return PNG.sync.write(png);
}

export const updPNGb8 = (pngBuf: Buffer, x: number, y: number, color: number) => {
  const png = PNG.sync.read(pngBuf);
  const idx = (png.width * y + x) << 2;
  png.data[idx] = (color >> 5) * 32;
  png.data[idx+1] = ((color & 28) >> 2) * 32;
  png.data[idx+2] = (color & 3) * 64;
  png.data[idx+3] = 255;

  return PNG.sync.write(png);
}

export const b8ToBMP = (buffer: Buffer) => {
  const dim = Math.floor(Math.sqrt(buffer.length));
  const data = Buffer.from(new ArrayBuffer((dim*dim) << 2));
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const idx = (dim * y + x) << 2;
      const v = buffer[y + x];
      data[idx+3] = (v >> 5) * 32;
      data[idx+2] = ((v & 28) >> 2) * 32;
      data[idx+1] = (v & 3) * 64;
      data[idx] = 255;
    }
  }
  const bmpData = {
    width: dim,
    height: dim,
    data
  }
  const bmpImg = bmp.encode(bmpData, 8).data;
  bmpImg[6] = dim;
  return bmpImg;
}

export const updBMPb8 = (bmpBuf: Buffer, x: number, y: number, color: number) => {
  const dim = bmpBuf[6];
  const offset = bmpBuf[10]-1;
  const idx = ((dim * y + x) << 2)+offset;
  bmpBuf[idx+3] = (color >> 5) * 32;
  bmpBuf[idx+2] = ((color & 28) >> 2) * 32;
  bmpBuf[idx+1] = (color & 3) * 64;
  bmpBuf[idx] = 255;
  return bmpBuf;
}