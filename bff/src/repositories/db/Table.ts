import _ from 'lodash';

import Query, {
  convertDbFieldsToModel,
  convertModelToDbFields,
  constructWhere,
  Expression,
  Obj,
  Tx,
  Where
} from './Query';

import { currentContext } from '../../context';
import { pool } from './db';

export default class Table {
  #tableName;

  #hasCreated;

  #hasLastModified;

  #aliases;

  constructor(tableName: string, { hasCreated = true, hasLastModified = true }) {
    if (new.target === Table) {
      throw new TypeError('Cannot construct Table instances directly.');
    }

    this.#tableName = tableName;
    this.#hasCreated = hasCreated;
    this.#hasLastModified = hasLastModified;
    this.#hasLastModified = hasLastModified;
    this.#aliases = { t: this.#tableName };
  }

  get tableName() {
    return this.#tableName;
  }

  async save(attribs: Obj, tx?: Tx) {
    const model = _.cloneDeep(attribs);

    const ctx = currentContext();
    if (this.#hasCreated) {
      if (!model.created) {
        model.created = ctx.now;
      }
      if (!model.createdBy) {
        model.createdBy = ctx.userId;
      }
    }
    if (this.#hasLastModified) {
      if (!model.lastModified) {
        model.lastModified = ctx.now;
      }
      if (!model.lastModifiedBy) {
        model.lastModifiedBy = ctx.userId;
      }
    }

    const saveObj = convertModelToDbFields(model);

    const attribNames = Object.keys(saveObj).join(', ');
    const attribValues = Object.values(saveObj);
    let cnt = 0;
    const valueParams = Object.keys(saveObj)
      // eslint-disable-next-line no-plusplus
      .map(() => `$${++cnt}`)
      .join(', ');

    const text = `INSERT INTO ${this.#tableName} (${attribNames}) VALUES (${valueParams}) RETURNING *`;
    console.log(`save(),\nquery=${text}\nparams=${attribValues}\n`);

    const dbClient = tx ? tx.db : pool;
    try {
      const { rowCount, rows } = await dbClient.query(text, attribValues);
      return rowCount === 1 ? convertDbFieldsToModel(rows[0]) : undefined;
    } catch (err) {
      console.log(`Save error.`, err);
    }
  }

  async update(updateAttribs: Obj, where: Where, tx?: Tx) {
    const model = _.cloneDeep(updateAttribs);

    const ctx = currentContext();
    if (this.#hasLastModified) {
      if (!model.lastModified) {
        model.lastModified = ctx.now;
      }
      if (!model.lastModifiedBy) {
        model.lastModifiedBy = ctx.userId;
      }
    }

    const saveObj = convertModelToDbFields(model);
    let text = `UPDATE ${this.#tableName} t SET`;
    let values = Object.values(saveObj).filter(val => !(val instanceof Expression));
    let setSeparator = ' ';
    let idx = 0;
    Object.entries(saveObj).forEach(([key, val]) => {
      if (val instanceof Expression) {
        text += `${setSeparator}${key} = ${val.expression}`;
      } else {
        text += `${setSeparator}${key} = $${idx + 1}`;
        idx += 1;
      }
      setSeparator = ', ';
    });

    const { clause, params } = constructWhere(where, idx + 1);
    text += `${clause} RETURNING *`;
    values = [...values, ...params];

    console.log(`update(),\nquery=${text}\nparams=${values}\n`);
    const dbClient = tx ? tx.db : pool;
    try {
      const { rows } = await dbClient.query(text, values);
      return rows.map((row: Obj) => convertDbFieldsToModel(row));
    } catch (err) {
      console.log(`Update error.`, err);
    }
  }

  async delete(where: Where, tx?: Tx) {
    const { clause, params } = constructWhere(where);
    const text = `DELETE FROM ${this.#tableName} t ${clause} RETURNING *`;

    console.log(`delete(),\nquery=${text}\nparams=${params}`);
    const dbClient = tx ? tx.db : pool;
    try {
      const { rows } = await dbClient.query(text, params);
      return rows.map((row: Obj) => convertDbFieldsToModel(row));
    } catch (err) {
      console.log(`Delete error.`, err);
    }
  }
}
