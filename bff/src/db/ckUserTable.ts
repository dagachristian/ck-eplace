import Table from './Table';

const tableName = 'ck_user';

class CkUserTbl extends Table {
  constructor() {
    super(tableName);
  }
}
export default new CkUserTbl();