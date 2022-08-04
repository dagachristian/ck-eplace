import type { Response, NextFunction } from 'express';
import type { Request } from 'express-jwt';
import httpStatus from 'http-status';

import * as userSvc from '../services/userService';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/get users')
  try {
    const ret = await userSvc.getUsers();
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Users error', e)
    next(e);
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/get user')
  try {
    const { userId: identity } = req.params;
    const ret = await userSvc.getUser(identity);
    res.status(httpStatus.OK).send({ users: ret });
  } catch (e) {
    console.log('Get Users error', e)
    next(e);
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/update user')
  try {
    const ret = await userSvc.updateUser(req.body);
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Users error', e)
    next(e);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('/delete user')
  try {
    const ret = await userSvc.deleteUser();
    res.status(httpStatus.OK).send(ret);
  } catch (e) {
    console.log('Get Users error', e)
    next(e);
  }
}
