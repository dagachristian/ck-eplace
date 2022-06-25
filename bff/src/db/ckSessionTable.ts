import { v4 } from 'uuid';
import { Obj, Tx } from './Query';

import Table from './Table';

class CkSessionTbl extends Table {
  async save(model: Obj, tx: Tx) {
    model.id = v4();
    return super.save(model, tx);
  }
}
export default new CkSessionTbl('ck_session', {});