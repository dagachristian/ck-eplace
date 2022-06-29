'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.runSql(`
    INSERT INTO ck_user
    (
      id,
      username,
      password,
      email,
      enabled,
      created,
      created_by,
      last_modified,
      last_modified_by 
    ) VALUES (
      '00000000-0000-0000-0000-000000001001',
      'testuser',
      '$2b$06$Ev6C0S1hHZm61gp7QchHFOomP.8fqqqGs7k7Z3ptltpBuoHBG.iNq',
      'test@test.com',
      true,
      '2022-06-24 19:00:06.688',
      '00000000-0000-0000-0000-000000000000',
      '2022-06-24 19:00:06.688',
      '00000000-0000-0000-0000-000000000000'
    );
  `)
};

exports.down = function(db) {
  return db.runSql(`
    DELETE from ck_user where id = '00000000-0000-0000-0000-000000001001';
  `);
};

exports._meta = {
  version: 1
};
