import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { Namespace, Server as SocketIO } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { client } from '../repositories/redis';
import config from '../config';
import * as events from './eventHandlers';
import Query from '../repositories/db/Query';
import { ApiError, Errors } from '../errors';

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
  cnvnsp.use(async (socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, config.jwt.secret, (err: any, decoded: any) => {
        if (decoded) socket.data.decoded = decoded
      });
    }
    const { canvasId } = socket.handshake.query;
    socket.data.canvas = {
      id: canvasId || '0',
      size: config.canvas.size
    }
    const userId = socket.data.decoded?.sub || '00000000-00000000-00000000-00000000';
    if (canvasId && canvasId != '0') {
      const canvas = await Query.raw(
        'SELECT c.size FROM ck_canvas c LEFT JOIN ck_canvas_sub cs ON c.id = cs.canvas_id WHERE c.id = $1 AND (c.private = false OR c.user_id = $2 OR cs.user_id = $2)',
        [canvasId, userId]
      )
      if (!canvas) next(new ApiError(Errors.UNAUTHORIZED));
      else socket.data.canvas.size = canvas.size;
    }
    next();
  });
  cnvnsp.on('connection', async (socket) => {
    const usn = socket.data.decoded?.username;
    socket.conn.on("close", (reason) => {
      console.log('Closed connection', reason);
    });
    const { id: canvasId, size } = socket.data.canvas;
    socket.join(canvasId)
    console.log(`${usn} joined canvas room ${canvasId}`)
    socket.on('updatePixel', events.updatePixel(canvasId, size))
  });
}

export const closeSocket = async () => {
  await io.close();
}