import { PNG } from 'pngjs';

export const bytesToPNG = (bytes: number[]) => {
  const dim = Math.floor(Math.sqrt(bytes.length));
  let png = new PNG({
    width: dim,
    height: dim,
  })
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const v = bytes[y + x];
      png.data[idx] = (v >> 5) * 32;
      png.data[idx+1] = ((v & 28) >> 2) * 32;
      png.data[idx+2] = (v & 3) * 64;
      png.data[idx+3] = 255;
    }
  }
  return PNG.sync.write(png);
}