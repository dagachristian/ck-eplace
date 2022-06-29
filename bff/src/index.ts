import { Server } from 'http';

import { db } from './db';
import { useApp } from './express';

let httpServer: Server;

const gracefulShutdown = async () => {
  console.log('Shutting down...')
  await httpServer.close();
  await db.disconnectDb();
}

const start = async () => {
  try {
    const port = 8080;
    
    await db.connectDb()
    const app = await useApp();
    
    // start the Express server
    httpServer = new Server(app);
    httpServer.listen(port);
    console.log('Started server on port', port)
    process.on('SIGINT', gracefulShutdown);
  } catch (e) {
    console.log(e)
  }
}

start();
