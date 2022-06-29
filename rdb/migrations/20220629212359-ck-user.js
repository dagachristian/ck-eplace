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
    CREATE TABLE ck_user (
      id uuid PRIMARY KEY,
      username text NOT NULL UNIQUE,
      password text NOT NULL,
      email text NOT NULL UNIQUE,
      enabled boolean NOT NULL DEFAULT TRUE,
      default_locale text DEFAULT 'en',
      meta jsonb NOT NULL DEFAULT '{}'::jsonb,

      created timestamp NOT NULL DEFAULT now(),
      created_by uuid NOT NULL,
      last_modified timestamp NOT NULL DEFAULT now(),
      last_modified_by uuid NOT NULL
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE ck_user CASCADE;
  `);
};

exports._meta = {
  version: 1
};

