import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';

import { ckUserTbl } from '../repositories/db';
import { IUser, IUserInfo } from './interfaces';
import Query from '../repositories/db/Query';
import { currentContext } from '../context';
import config from '../config';
import { ApiError, Errors } from '../errors';

const saltRounds = 6;

const publishUser = (user: IUser) => {
  delete user.enabled;
  delete user.created;
  delete user.createdBy;
  delete user.lastModified;
  delete user.lastModifiedBy;
  delete user.password;
  return user;
}

const newSession = async (user: IUser, ip: string, userAgent: string) => {
  const ctx = currentContext();
  ctx.userId = user.id;
  ctx.appId = ip + userAgent;

  const sessionId = v4();
  const apiToken = jwt.sign(
    { username: user.username, iat: ctx.now.unix(), audience: ctx.appId },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn.api,
      issuer: config.api.endpoint,
      subject: user.id,
      jwtid: sessionId
    }
  )
  const refreshToken = jwt.sign(
    { username: user.username, iat: ctx.now.unix(), audience: ctx.appId },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn.refresh,
      issuer: config.api.endpoint,
      subject: user.id,
      jwtid: sessionId
    }
  )

  return { sessionId, apiToken, refreshToken }
}

export const login = async (userInfo: IUserInfo) => {
  const user = await Query.findOne(
    { t: 'ck_user' },
    {
      where: {
        clause: 't.username = :username AND t.enabled = :enabled',
        params: { username: userInfo.username, enabled: true }
      }
    }
  ) as IUser;
  if (user && bcrypt.compareSync(userInfo.password, user.password!)) {
    const { sessionId, apiToken, refreshToken } = await newSession(user, userInfo.ip, userInfo.userAgent);
    return { user: publishUser(user), sessionId, apiToken, refreshToken };
  } else if (!user)
    throw new ApiError(Errors.NOT_EXIST);
  else
    throw new ApiError(Errors.UNAUTHORIZED);
}

export const renewSession = async (refreshToken: jwt.JwtPayload, ip: string, userAgent: string) => {
  const user = await Query.findOne(
    { t: 'ck_user' },
    {
      where: {
        clause: 't.id = :id AND t.enabled = :enabled',
        params: { id: refreshToken.sub, enabled: true }
      }
    }
  ) as IUser;
  if (user && refreshToken.audience == ip+userAgent) {
    const { sessionId, apiToken } = await newSession(user, ip, userAgent);
    return { user: publishUser(user), sessionId, apiToken };
  } else if (!user)
    throw new ApiError(Errors.NOT_EXIST);
  else
    throw new ApiError(Errors.UNAUTHORIZED);
}

export const createUser = async (user: IUser) => {
  user.id = v4();
  user.password = bcrypt.hashSync(user.password!, saltRounds);
  const createdUser = await ckUserTbl.save(user);
  if (createdUser) return createdUser
  throw new ApiError(Errors.EXISTS);
}