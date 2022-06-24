import express from 'express';
import cors from 'cors';

import routes from './routes';
import { connectDb } from './db';

const app = express()
const port = 8080;

connectDb()

// middleware
app.use(cors());
app.use(express.json());

// define a route handler for the default home page
app.use("/api", routes);

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});