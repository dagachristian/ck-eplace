import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';
import stresm from 'stream';

import * as canvasSvc from '../services/canvasService';

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas')
  try {
    const buffer = await canvasSvc.fullCanvas();
    res.status(httpStatus.OK).send(buffer);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}