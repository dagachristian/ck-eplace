import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketIO } from 'socket.io';

import config from '../config';

let io: SocketIO;

export const initSocket = (httpServer: Server) => {
  io = new SocketIO(httpServer);

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.auth.token, config.jwt.secret, (err: any, decoded: any) => {
        if (err) return next(new Error('Authentication error'));
        socket.data.decoded = decoded
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })
  .on('connection', function(socket) {
    socket.on('message', (message) => {
      io.emit('message', message);
    });
  });
}

export const closeSocket = async () => {
  await io.close();
}