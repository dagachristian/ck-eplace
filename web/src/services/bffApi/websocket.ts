import { io, Socket } from 'socket.io-client';

class SocketClient {
  socket: Socket | undefined;

  constructor() {
    this.socket = undefined;
  }

  async initSocket() {
    this.socket = io(process.env.REACT_APP_API_BASE_URL!, {
      auth: {
        token: sessionStorage.getItem('dashboard.token')
      }
    })
    this.socket.on('connect', () => {
      console.log('Socket connected')
    })
    this.socket.on('data', (data) => {
      console.log('Got Data', data)
    })
    this.socket.on('error', (error) => {
      console.log('Socket Error', error)
    });
  }

  async closeSocket() {
    this.socket?.close()
  }
}
export const wsClient = new SocketClient();