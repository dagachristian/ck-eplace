import type { IUser } from "./interfaces"
import { ckUserTbl } from "../repositories/db";
import Query from '../repositories/db/Query';
import { ApiError, Errors } from "../errors";
import { currentContext } from "../context";

export const checkUuid = (id: string) => {
  return id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
}

const publishPublicUser = (user: any) => {
  return {
    id: user.id,
    username: user.username
  }
}

export const getUsers = async (filters?: any) => {
  return await Query.findMany({t: 'ck_user'}, {});
}

export const getUser = async (identity: string) => {
  const params = {
    id: '00000000-00000000-00000000-00000000',
    username: identity
  }
  if (checkUuid(identity))
    params.id = identity;
  const user = await Query.findOne({t: 'ck_user'}, {
    select: {
      clause: 't.id, t.username'
    },
    where: {
      clause: 't.id = :id OR t.username = :username',
      params
    }
  })
  if (!user) throw new ApiError(Errors.NOT_EXIST);
  return publishPublicUser(user);
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