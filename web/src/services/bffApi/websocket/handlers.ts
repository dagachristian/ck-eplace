
interface IGotUpdatePixelEvent {
  color: number,
  x: number,
  y: number
}

export const gotUpdatedPixel = ({ color, x, y }: IGotUpdatePixelEvent) => {
  (document.getElementById('canvas')! as HTMLCanvasElement).getContext('2d')?.putImageData(new ImageData(new Uint8ClampedArray([
    (color >> 5) * 255 / 7,
    ((color >> 2) & 0x07) * 255 / 7,
    (color & 0x03) * 255 / 3,
    255
  ]), 1, 1), x, y)
}