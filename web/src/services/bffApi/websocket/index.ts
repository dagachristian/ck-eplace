import { io, Socket } from 'socket.io-client';

import { gotUpdatedPixel } from './handlers';

class SocketClient {
  socket: Socket | undefined;

  constructor() {
    this.socket = undefined;
  }

  async initCanvasSocket() {
    const { protocol, hostname } = window.location;
    this.socket = io(protocol + '//' + hostname + '/canvas', {
      reconnectionAttempts: 50,
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