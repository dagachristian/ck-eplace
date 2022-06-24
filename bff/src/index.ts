import { Server } from 'http';
import express from 'express';
import cors from 'cors';

import routes from './routes';
import { connectDb, disconnectDb } from './db';

let httpServer: Server;

const gracefulShutdown = async () => {
  console.log('Shutting down...')
  await httpServer.close();
  await disconnectDb();
}

const start = async () => {
  try {
    const app = express()
    const port = 8080;

    await connectDb()

    // middleware
    app.use(cors());
    app.use(express.json());

    // define a route handler for the default home page
    app.use("/api", routes);

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
