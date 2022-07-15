import { io, Socket } from 'socket.io-client';

import { gotUpdatedPixel } from './handlers';

class SocketClient {
  socket: Socket | undefined;

  constructor() {
    this.socket = undefined;
  }

  async initCanvasSocket() {
    this.socket = io(process.env.REACT_APP_API_BASE_URL! + '/canvas', {
      reconnectionAttempts: 100,
      auth: {
        token: sessionStorage.getItem('dashboard.token')
      }
    })
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
    })
    this.socket.on('message', (message) => {
      console.log('Got Message:', message)
    })
    this.socket.on('error', (error) => {
      console.log('Socket Error', error)
    });
    this.socket.on("disconnect", () => {
      console.log('Socket Disconnected');
    });
    this.socket.on('updatePixel', gotUpdatedPixel)
  }

  async closeSocket() {
    this.socket?.close()
  }
}
export const wsClient = new SocketClient();