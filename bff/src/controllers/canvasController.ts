import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';
import { canvasFnctns } from '@ck/common';

import * as canvasSvc from '../services/canvasService';

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas')
  try {
    const buffer = await canvasSvc.fullCanvas();
    const ret = canvasFnctns.b8ToBMP(buffer);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}

export const getCanvasImage = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas/image')
  try {
    const buffer = await canvasSvc.fullCanvas();
    const type = req.query.type || 'png';
    let ret;
    switch (type) {
      case 'png':
        ret = canvasFnctns.b8ToPNG(buffer);
        break;
      case 'bmp':
        ret = canvasFnctns.b8ToBMP(buffer);
        break;
      default:
        break;
    }
    res.setHeader('Content-Type', `image/${type}`);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}
