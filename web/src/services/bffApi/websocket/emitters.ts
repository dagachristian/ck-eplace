import { wsClient } from '.'

export const updatePixel = (color: number, x: number, y: number) => {
  wsClient.socket?.emit('updatePixel', {
    color,
    x,
    y
  })
}