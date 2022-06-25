import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { expressjwt as jwt, Request } from 'express-jwt';

import config from './config';
import routes from './routes';
import { createContext, currentContext } from './context';

export interface IRequest extends Request {
  user?: any
}

export const useApp = async () => {
  const app = express()

  // middleware
  app.use(helmet());
  app.use(cookieParser())
  app.use(cors());
  app.use(express.json());
  app.use((req, res, next) => {
    createContext(next, { req, res })
  });
  app.use(jwt({secret: config.jwt.secret, algorithms: ['HS256']}).unless({
    path: [
      /^\/socket.io.*/,

      // API paths.
      /^\/api\/(v\d+\/)?auth\/login/,
      /^\/api\/(v\d+\/)?auth\/register/,
    ]
  }));
  app.use((req: IRequest, res, next) => {
    const ctx = currentContext();
    const { user } = req;
    if (user) {
      ctx.principalId = user.sub;
      ctx.appId = user.appId;
    } else {
      ctx.principalId = '00000000-0000-0000-0000-000000000000';
    }
    next();
  });

  // define a route handler for the default home page
  app.use("/api", routes);

  return app;
}