import { IUser } from '../../services/interfaces';
import { currentContext } from '../../context';
import Table from './Table';
import { Obj, Tx } from './Query';

class CkUserTbl extends Table {
  async save(user: IUser, tx?: Tx) {
    const ctx = currentContext();
    user = {
      ...user, 
      created: ctx.now, 
      createdBy: user.id!,
      lastModified: ctx.now,
      lastModifiedBy: user.id!
    }
    return super.save(user as Obj, tx)
  }
}
export default new CkUserTbl('ck_user', {});