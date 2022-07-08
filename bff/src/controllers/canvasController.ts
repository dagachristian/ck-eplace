import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';
import { canvasFnctns } from '@ck/common';

import * as canvasSvc from '../services/canvasService';

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas')
  try {
    const vals = await canvasSvc.fullCanvas();
    res.status(httpStatus.OK).send(Buffer.from(vals));
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}

export const getCanvasImage = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas/image')
  try {
    const vals = await canvasSvc.fullCanvas();
    const png = canvasFnctns.bytesToPNG(vals);
    res.setHeader('Content-Type', 'image/png');
    res.status(httpStatus.OK).send(png);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}
