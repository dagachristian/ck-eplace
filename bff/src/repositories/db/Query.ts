/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import moment from 'moment';

import { pool } from './db';

export type Obj = {
  [key: string]: any
}

export type Where = {
  clause: string,
  params?: Obj,
  distinct?: []
}

export type Options = {
  join?: Obj,
  select?: Where,
  tx?: Tx,
  where?: Where,
  raw?: boolean
}

const utcOffsetOfLocal = moment().utcOffset() * 60 * 1000;

export const dbTsToMoment = (dbTs: Date) => {
  return moment(dbTs.getTime() + utcOffsetOfLocal).utc();
};

export const momentToDbTs = (m: any) => {
  if (!moment.isMoment(m)) {
    return m;
  }
  const ret = moment.utc(m);
  return ret.isValid() ? ret.toDate() : m;
};

export const convertModelKeyToDbField = (modelKey: string) => {
  return _.kebabCase(modelKey).replace(/-/g, '_');
};

export const convertModelToDbFields = (model: Obj) => {
  return Object.entries(model).reduce((dbFields: Obj, [key, val]) => {
    dbFields[convertModelKeyToDbField(key)] = momentToDbTs(val); // eslint-disable-line no-param-reassign
    return dbFields;
  }, {});
};

export const convertDbFieldsToModel = (dbFields: Obj) => {
  return Object.keys(dbFields).reduce((model: Obj, key) => {
    const modelFieldName = _.camelCase(key);
    const fieldValue = dbFields[key];
    model[modelFieldName] = fieldValue instanceof Date ? dbTsToMoment(fieldValue) : fieldValue; // eslint-disable-line no-param-reassign
    return model;
  }, {});
};

export const constructSelect = (select: Where | undefined) => {
  if (!select) {
    return 'SELECT *';
  }

  const { clause, distinct } = select;
  const distinctClause = distinct && distinct.length > 0 ? `DISTINCT ON (${distinct.join()})` : '';
  return `SELECT ${distinctClause} ${clause || '*'}`;
};

export const constructFrom = (aliases: Obj) => {
  // const text = Object.entries(aliases)
  //   .map(([alias, table]) => `${table} ${alias}`)
  //   .join(', ');
  const [alias, table] = Object.entries(aliases)[0];
  return `FROM ${table} ${alias}`;
};

export const constructJoin = (join: Obj | undefined, aliases: Obj) => {
  if (!join) {
    return '';
  }

  return Object.entries(join)
    .map(([alias, on]) => `JOIN ${aliases[alias]} ${alias} ON ${on}`)
    .join(' ');
};

export const constructWhere = (where?: Where, paramIdxStart = 1) => {
  if (!where) {
    return { clause: '', params: [] };
  }

  const { clause, params } = where;
  let retClause = '';
  const retParams = [];
  if (clause) {
    const toks = clause.split(/(:[\w]*)/g);
    let idx = paramIdxStart;
    const tokArray = [];
    for (let i = 0; i < toks.length; i += 1) {
      if (toks[i].startsWith(':') && toks[i].length > 1 && (i < 2 || toks[i - 2] !== ':')) {
        const param = toks[i].substring(1).trim();
        retParams.push(momentToDbTs(params![param]));
        // eslint-disable-next-line no-plusplus
        tokArray.push(`$${idx++}`);
      } else {
        tokArray.push(toks[i]);
      }
    }
    retClause = ` WHERE ${tokArray.join('')}`;
  }
  // SELECT * FROM table WHERE id = ANY($1::int[])
  return { clause: retClause, params: retParams };
};

export enum Order {
  'ASC',
  'DEC'
}

export class Tx {
  #client: any = null;

  #inTransaction = false;

  #commitActions: any[] = [];

  get db() {
    return this.#client;
  }

  async begin() {
    this.#client = await pool.connect();
    console.log(`begin(),\nquery=BEGIN`);
    await this.#client.query('BEGIN');
    this.#inTransaction = true;
    return this;
  }

  async commit() {
    try {
      console.log(`commit(),\nquery=COMMIT`);
      await this.#client.query('COMMIT');
    } finally {
      this.#inTransaction = false;
      this.#client.release();
    }

    this.#commitActions.forEach(f => f());
  }

  async rollback() {
    if (this.#inTransaction) {
      try {
        console.log(`rollback(),\nquery=ROLLBACK`);
        await this.#client.query('ROLLBACK');
      } finally {
        this.#inTransaction = false;
        this.#client.release();
      }
    }
  }

  addCommitAction(f: any) {
    this.#commitActions.push(f);
  }
}

export class Expression {
  expression;

  constructor(expression: string) {
    this.expression = expression;
  }
}

export default class Query {
  static tx() {
    return new Tx();
  }

  static expr(expression: string) {
    return new Expression(expression);
  }

  static async findOne(aliases: Obj, options: Options) {
    const { join, select, tx, where } = options || {};
    const { clause, params } = constructWhere(where);
    let text = `${constructSelect(select)} ${constructFrom(aliases)} ${constructJoin(join, aliases)} ${clause}`;
    text += ' LIMIT 1';

    const paramsArray = Object.values(params);
    console.log(`findOne(),\nquery=${text}\nparams=${paramsArray}`);
    const dbClient = tx ? tx.db : pool;
    const { rowCount, rows } = await dbClient.query(text, paramsArray);
    return rowCount > 0 ? convertDbFieldsToModel(rows[0]) : undefined;
  }

  static async findMany(aliases: Obj, options: Options) {
    const { where, select, join, raw = false, tx } = options || {};
    const { clause, params } = constructWhere(where);
    const text = `${constructSelect(select)} ${constructFrom(aliases)} ${constructJoin(join, aliases)} ${clause}`;

    const paramsArray = Object.values(params);
    console.log(`findMany(),\nquery=${text}\nparams=${paramsArray}`);
    const dbClient = tx ? tx.db : pool;
    const { rows } = await dbClient.query(text, paramsArray);
    if (raw) {
      return rows;
    }
    return rows.map((row: Obj) => convertDbFieldsToModel(row));
  }
}
