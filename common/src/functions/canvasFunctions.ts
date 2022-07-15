import { PNG } from 'pngjs';
import bmp from 'bmp-js';

export const bToRGBA = (color: number, rgbaBuf: Buffer | Uint8ClampedArray, idx: number) => {
  rgbaBuf[idx] = (color >> 5) * 255 / 7;
  rgbaBuf[idx+1] = ((color >> 2) & 0x07) * 255 / 7;
  rgbaBuf[idx+2] = (color & 0x03) * 255 / 3;
  rgbaBuf[idx+3] = 255;
}

export const bToABGR = (color: number, abgrBuf: Buffer, idx: number) => {
  abgrBuf[idx+3] = (color >> 5) * 255 / 7;
  abgrBuf[idx+2] = ((color >> 2) & 0x07) * 255 / 7;
  abgrBuf[idx+1] = (color & 0x03) * 255 / 3;
  abgrBuf[idx] = 255;
}

export const b8ToRaw = (buffer: Buffer) => {
  const dim = Math.floor(Math.sqrt(buffer.length));
  const raw = Buffer.from(new ArrayBuffer((buffer.length) << 2));
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const idx = (dim * y + x) << 2;
      const color = buffer[dim * y + x];
      bToRGBA(color, raw, idx);
    }
  }
  return raw;
}

export const b8ToPNG = (buffer: Buffer) => {
  const dim = Math.floor(Math.sqrt(buffer.length));
  const png = new PNG({
    width: dim,
    height: dim,
  })
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const color = buffer[png.width * y + x];
      bToRGBA(color, png.data, idx);
    }
  }
  return PNG.sync.write(png);
}

export const updPNGb8 = (pngBuf: Buffer, x: number, y: number, color: number) => {
  const png = PNG.sync.read(pngBuf);
  const idx = (png.width * y + x) << 2;
  bToRGBA(color, png.data, idx);

  return PNG.sync.write(png);
}

export const b8ToBMP = (buffer: Buffer) => {
  const dim = Math.floor(Math.sqrt(buffer.length));
  const data = Buffer.from(new ArrayBuffer((dim*dim) << 2));
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const idx = (dim * y + x) << 2;
      const color = buffer[dim * y + x];
      bToABGR(color, data, idx);
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
  bToABGR(color, bmpBuf, idx);
  return bmpBuf;
}