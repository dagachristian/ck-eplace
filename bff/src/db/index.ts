import { Pool } from 'pg';
import config from '../config';

export let pool: Pool;

const testConnection = async () => {
  await pool.query('SELECT NOW()');
};

export const connectDb = async () => {
  const { host, database, password, poolMax: max, port, user } = config.db;
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

  await testConnection();
}

export const disconnectDb = async () => {
  await pool.end();
};