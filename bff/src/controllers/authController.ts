import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK).send('Logged in')
  } catch (e) {
    console.log('Login error')
    next(e);
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {

}
