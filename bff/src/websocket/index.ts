import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Namespace, Server as SocketIO } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { client } from '../repositories/redis';
import config from '../config';
import * as events from './eventHandlers';

let io: SocketIO;
export let cnvnsp: Namespace;

export const initSocket = (httpServer: Server) => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: "*"
    }
  });
  io.adapter(createAdapter(client, client.duplicate()));
  io.on('connection', (socket) => {
    console.log(socket.handshake.auth)
    socket.on('message', (message) => {
      io.emit('message', message);
    });
  });
  cnvnsp = io.of('/canvas');
  cnvnsp.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, config.jwt.secret, (err: any, decoded: any) => {
        if (decoded) socket.data.decoded = decoded
      });
    }
    next();
  });
  cnvnsp.on('connection', (socket) => {
    if (socket.data.decoded) {
      const usn = socket.data.decoded.username;
      console.log(`${usn} connected to canvas nsp`)
    } else {
      console.log('Anonymous connected to canvas nsp')
    }
    socket.conn.on("close", (reason) => {
      console.log('Closed connection', reason);
    });
    socket.on('updatePixel', events.updatePixel)
  });
}

export const closeSocket = async () => {
  await io.close();
}