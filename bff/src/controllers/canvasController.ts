import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';

import { ICanvas } from '../services/interfaces';
import * as canvasFnctns from '../services/canvasFunctions';
import * as canvasSvc from '../services/canvasService';

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas', req.params.canvasId)
  try {
    const { canvasId } = req.params;
    const userId = req.auth?.sub
    let ret: ICanvas | Buffer = await canvasSvc.getCanvas(canvasId, userId);
    const img = ret.img as Buffer;
    let type = req.query.type?.toString().toLowerCase();
    switch (type) {
      case 'png':
        ret = canvasFnctns.b8ToPNG(img);
        break;
      case 'bmp':
        ret = canvasFnctns.b8ToBMP(img);
        break;
      default:
        type = 'raw';
        delete ret.img;
        // ret.img = canvasFnctns.b8ToRaw(img).toString();
        break;
    }
    if (!type.includes('raw')) res.setHeader('Content-Type', `image/${type}`);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Canvas error', e);
    next(e);
  }
}

export const createCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/createCanvas')
  try {
    const ret = await canvasSvc.createCanvas(req.auth?.sub!, req.body);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Create Canvas error', e);
    next(e);
  }
}
