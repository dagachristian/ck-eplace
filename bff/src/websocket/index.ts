import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketIO } from 'socket.io';

import config from '../config';

let io: SocketIO;

export const initSocket = (httpServer: Server) => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: "*"
    }
  });
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token){
      jwt.verify(socket.handshake.auth.token, config.jwt.secret, (err: any, decoded: any) => {
        if (decoded) socket.data.decoded = decoded
      });
    }
    next();
  });
  io.on('connection', (socket) => {
    socket.on('message', (message) => {
      io.emit('message', message);
    });
  });
  const cnvnsp = io.of('/canvas');
  cnvnsp.on('connection', (socket) => {
    if (socket.data.decoded) {
      const usn = socket.data.decoded.username;
      console.log(`${usn} connected to canvas nsp`)
      io.emit('message', `Welcome to canvas nsp ${usn}!`);
    } else {
      console.log('Anonymous connected to canvas nsp')
      io.emit('message', 'Welcome to canvas nsp!');
    }
  });
}

export const closeSocket = async () => {
  await io.close();
}