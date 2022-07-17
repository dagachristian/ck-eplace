import { Server } from 'http';
import { Server as HttpsServer } from 'https';
import fs from 'fs';
import path from 'path';

import { db } from './repositories/db';
import { connectRedis, disconnectRedis } from './repositories/redis';
import { useApp } from './express';
import { initSocket, closeSocket } from './websocket';

let httpServer: Server;
let httpsServer: HttpsServer;

const gracefulShutdown = async () => {
  console.log('Shutting down...')
  await closeSocket();
  await httpServer.close();
  await httpsServer.close();
  await db.disconnectDb();
  await disconnectRedis();
}

const start = async () => {
  try {
    const httpPort = 8080;
    const httpsPort = 8443;
    const privateKey  = fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.key'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, '..', 'certs', 'server.crt'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    await db.connectDb();
    await connectRedis();
    const app = await useApp();
    
    // start the Express server
    httpServer = new Server(app);
    httpsServer = new HttpsServer(credentials, app)
    await initSocket(httpServer);
    await initSocket(httpServer);
    httpServer.listen(httpPort);
    httpsServer.listen(httpsPort)
    console.log('Started http server on port', httpPort)
    console.log('Started https server on port', httpsPort)
    process.on('SIGINT', gracefulShutdown);
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

start();
