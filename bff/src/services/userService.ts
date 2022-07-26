import { IUser } from "./interfaces"
import { ckUserTbl } from "../repositories/db";
import Query from '../repositories/db/Query';
import { ApiError, Errors } from "../errors";
import { currentContext } from "../context";

export const getUsers = async (filters?: any) => {
  return await Query.findMany({t: 'ck_user'}, {});
}

export const getUser = async (identity: string) => {
  const user = await Query.findOne({t: 'ck_user'}, {
    where: {
      clause: 't.id = :identity OR t.username = :identity',
      params: { identity }
    }
  })
  if (!user) throw new ApiError(Errors.NOT_EXIST);
  return user;
}

export const updateUser = async (updateInfo: Partial<IUser>) => {
  const ctx = currentContext();
  const updated = await ckUserTbl.update(updateInfo, {
    clause: 't.id = :userId',
    params: { userId: ctx.userId }
  });
  return updated;
}

export const deleteUser = async () => {
  const ctx = currentContext();
  const deleted = await ckUserTbl.delete({
    clause: 't.id = :userId',
    params: { userId: ctx.userId }
  })
  return deleted;
}