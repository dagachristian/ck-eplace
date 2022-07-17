import express, { NextFunction, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { expressjwt as jwt, Request } from 'express-jwt';
import { ValidationError } from 'express-json-validator-middleware';

import config from './config';
import routes from './routes';
import { createContext, currentContext } from './context';
import { ApiError, Errors } from './errors';

export const useApp = async () => {
  const app = express()
  const api = express.Router()

  // React App
  const root = path.join(__dirname, 'build');
  app.use(/^\/(?!api)/, express.static(root));
  app.get(/^\/(?!api)/, function (req, res) {
    res.sendFile('index.html', { root });
  });

  // API
  app.use('/api', api)

  // middleware
  api.use(helmet());
  api.use(cookieParser(config.signed.cookie.secret))
  api.use(cors());
  api.use(express.json());
  api.use((req, res, next) => {
    createContext(next, { req, res })
  });
  api.use('/api', jwt({secret: config.jwt.secret, algorithms: ['HS256']}).unless({
    path: [
      // API paths.
      /^\/api\/(v\d+\/)?auth\/login/,
      /^\/api\/(v\d+\/)?auth\/register/,
      /^\/api\/(v\d+\/)?canvas/,
    ]
  }));
  api.use((req: Request, res, next) => {
    const ctx = currentContext();
    const { auth } = req;
    if (auth) {
      ctx.userId = auth.sub;
      ctx.appId = auth.appId;
    } else {
      ctx.userId = '00000000-0000-0000-0000-000000000000';
    }
    next();
  });

  // define a route handler for the default home page
  api.use(routes);

  api.use((req, res, next) => {
    const err = new ApiError(Errors.API);
    return next(err);
  });

  api.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'UnauthorizedError') {
      next(new ApiError(Errors.UNAUTHORIZED));
    } else if (error instanceof ValidationError) {
      next(new ApiError(Errors.INVALID_REQUEST, error.validationErrors));
    } else if (!(error instanceof ApiError)) {
      next(new ApiError(Errors.API));
    } else {
      next(error);
    }
  });

  api.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.type.code).json({
      message: err.message,
      data: err.data,
      cId: currentContext().cId
    });
    next();
  });

  return app;
}