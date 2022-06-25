import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { ckUserTbl } from '../db';
import { IUser } from './interfaces';
import { Tx } from '../db/Query';

const saltRounds = 6;

export const createUser = async (user: IUser) => {
  user.id = v4();
  user.password = bcrypt.hashSync(user.password!, saltRounds);
  return await ckUserTbl.save(user, new Tx());
}