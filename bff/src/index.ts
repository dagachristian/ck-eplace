import { Server } from 'http';

import { db } from './repositories/db';
import { connectRedis, disconnectRedis } from './repositories/redis';
import { useApp } from './express';
import { initSocket, closeSocket } from './websocket';

let httpServer: Server;

const gracefulShutdown = async () => {
  console.log('Shutting down...')
  await closeSocket();
  await httpServer.close();
  await db.disconnectDb();
  await disconnectRedis();
}

const start = async () => {
  try {
    const port = 8080;
    
    await db.connectDb();
    await connectRedis();
    const app = await useApp();
    
    // start the Express server
    httpServer = new Server(app);
    await initSocket(httpServer);
    httpServer.listen(port);
    console.log('Started server on port', port)
    process.on('SIGINT', gracefulShutdown);
  } catch (e) {
    console.log(e)
  }
}

start();
