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
    CREATE TABLE ck_session (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES ck_user,
      address text NOT NULL,
      user_agent text NOT NULL,
      expire timestamp NOT NULL
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE ck_session CASCADE;
  `);
};

exports._meta = {
  version: 1
};
