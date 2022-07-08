import { PNG } from 'pngjs';

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