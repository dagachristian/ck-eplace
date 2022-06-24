import { Pool } from 'pg';
import config from '../config';

export let pool: Pool;

export const connectDb = async () => {
  const { host, name: database, password, poolMax: max, port, user } = config.db;
  pool = new Pool({
    database,
    host,
    max,
    password,
    port,
    user
  });

  pool.on('error', (error, client) => {
    console.log('Postgres error.', { error, client })
  })
}

export const disconnectDb = async () => {
  await pool.end();
};