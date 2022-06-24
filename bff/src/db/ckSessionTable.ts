import Table from './Table';

const tableName = 'ck_session';

class CkSessionTbl extends Table {
  constructor() {
    super(tableName);
  }
}
export default new CkSessionTbl();