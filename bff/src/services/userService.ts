import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import moment from 'moment';

import { ckUserTbl } from '../db';
import { IUser, IUserInfo } from './interfaces';
import Query, { Tx } from '../db/Query';
import { currentContext } from '../context';
import config from '../config';
import { storeSession } from './sessions';

const saltRounds = 6;

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
    const ctx = currentContext();
    ctx.userId = user.id;
    ctx.appId = userInfo.ip + userInfo.userAgent;

    const sessionId = v4();
    const jwtToken = jwt.sign(
      { email: user.email, iat: ctx.now.unix(), audience: ctx.appId },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
        issuer: config.api.endpoint,
        subject: user.id,
        jwtid: sessionId
      }
    )
    const { exp } = jwt.decode(jwtToken) as jwt.JwtPayload;
    const expire = moment(exp).utc();
    const session = {
      id: sessionId,
      userId: user.id!,
      address: userInfo.ip,
      userAgent: userInfo.userAgent,
      expire
    }
    await storeSession(session);

    return { user, sessionId, jwtToken };
  }
}

export const createUser = async (user: IUser) => {
  user.id = v4();
  user.password = bcrypt.hashSync(user.password!, saltRounds);
  return await ckUserTbl.save(user, new Tx());
}