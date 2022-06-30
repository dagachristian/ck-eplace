import { bffApi } from '.';

interface IEvent {
  eventType: string,
}

export class BffSocket {
  private readonly reconnectAttempts: number;
  private attempt: number;
  private lastEvent: string | undefined;
  public socket: WebSocket | undefined;

  constructor(attempts?: number) {
    this.reconnectAttempts = attempts || 50;
    this.lastEvent = undefined;
    this.socket = undefined;
    this.attempt = 0;
  }

  async initSocket() {
    try {
      
    } catch (e) {
      console.log(e)
    }
  }
  
  closeSocket() {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}
export default new BffSocket(20);