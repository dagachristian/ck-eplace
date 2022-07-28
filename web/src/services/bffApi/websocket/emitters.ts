import { wsClient } from '.'

export const updatePixel = (size: number, color: number, x: number, y: number) => {
  wsClient.socket?.emit('updatePixel', {
    size,
    color,
    x,
    y
  })
}