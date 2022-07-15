
interface IGotUpdatePixelEvent {
  color: number,
  x: number,
  y: number
}

export const gotUpdatedPixel = ({ color, x, y }: IGotUpdatePixelEvent) => {
  const ctx = (document.getElementById('canvas')! as HTMLCanvasElement).getContext('2d')!
  ctx.fillStyle = `rgba(${(color >> 5) * 255 / 7}, ${((color >> 2) & 0x07) * 255 / 7}, ${(color & 0x03) * 255 / 3}, 255)`;
  ctx.fillRect(x,y,1,1);
}