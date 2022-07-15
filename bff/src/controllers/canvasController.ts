import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';
import { canvasFnctns } from '@ck/common';

import * as canvasSvc from '../services/canvasService';

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas')
  try {
    const buffer = await canvasSvc.getCanvas(req.query.date as string | undefined);
    let type = req.query.type?.toString().toLowerCase();
    let ret = buffer;
    switch (type) {
      case 'png':
        ret = canvasFnctns.b8ToPNG(buffer);
        break;
      case 'bmp':
        ret = canvasFnctns.b8ToBMP(buffer);
        break;
      case 'rawrgba':
        ret = canvasFnctns.b8ToRaw(buffer);
        break;
      default:
        type = 'raw';
        break;
    }
    if (!type.includes('raw')) res.setHeader('Content-Type', `image/${type}`);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}
