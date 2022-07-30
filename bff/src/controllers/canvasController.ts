import type { Response, NextFunction } from 'express';
import type { Request } from 'express-jwt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { DatabaseError } from 'pg';

import type { ICanvas } from '../services/interfaces';
import * as canvasFnctns from '../services/canvasFunctions';
import * as canvasSvc from '../services/canvasService';
import config from '../config';
import { ApiError, Errors } from '../errors';


export const getCanvases = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvases')
  try {
    const filters = req.query;
    let userId: string | jwt.JwtPayload | undefined = req.get('authorization');
    if (userId) jwt.verify(userId?.split(' ')[1], config.jwt.secret, (err, decoded) => {
      userId = decoded?.sub;
    })
    const ret = await canvasSvc.getCanvases(filters, userId as string | undefined);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Canvases error', e);
    next(e);
  }
}

export const getCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/canvas', req.params.canvasId)
  try {
    const { canvasId } = req.params;
    let userId: string | jwt.JwtPayload | undefined = req.get('authorization');
    if (userId) jwt.verify(userId?.split(' ')[1], config.jwt.secret, (err, decoded) => {
      userId = decoded?.sub;
    })
    const imgType = req.query.type?.toString().toLowerCase();
    const canvas = await canvasSvc.getCanvas(canvasId, imgType, userId);
    if (imgType) res.setHeader('Content-Type', `image/${imgType}`);
    res.status(httpStatus.OK).send(canvas);
  } catch (e) {
    console.log('Get Canvas error', e);
    if (e instanceof DatabaseError)
      next(new ApiError(Errors.NOT_EXIST, e));
    else
      next(e)
  }
}

export const createCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/createCanvas')
  try {
    const ret = await canvasSvc.createCanvas(req.body);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Create Canvas error', e);
    next(e);
  }
}

export const updateCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/updateCanvas')
  try {
    const { canvasId } = req.params;
    const ret = await canvasSvc.updateCanvas(canvasId, req.body);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Update Canvas error', e);
    next(e);
  }
}

export const deleteCanvas = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/deleteCanvas')
  try {
    const { canvasId } = req.params
    const ret = await canvasSvc.deleteCanvas(canvasId as string);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Delete Canvas error', e);
    next(e);
  }
}

export const addSub = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/updateSub')
  try {
    const { canvasId } = req.params;
    const { subId } = req.query;
    const ret = await canvasSvc.addSub(subId as string, canvasId as string);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Update Sub error', e);
    next(e);
  }
}

export const removeSub = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/deleteSub')
  try {
    const { canvasId } = req.params;
    const { subId } = req.query;
    const ret = await canvasSvc.removeSub(subId as string, canvasId as string);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Delete Sub error', e);
    next(e);
  }
}