import local from './local.env';

const environment = process.env.NODE_ENV || 'dev';
let temp;
switch (environment) {
  case 'dev':
    temp = local;
    break;
  default:
    temp = local;
    break;
}
let config: {
  api: {
    endpoint: string
  },
  signed: {
    cookie: {
      secret: string[]
    }
  },
  db: {
    host: string,
    database: string,
    port: number,
    user: string,
    password: string,
    poolMax: number
  },
  redis: {
    host: string,
    port: number
  },
  jwt: {
    secret: string,
    refreshSecret: string,
    expiresIn: {
      api: string,
      refresh: string
    }
  },
  canvas: {
    size: number
  }
} = {
  db: {
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'postgres',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    poolMax: 10
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  canvas: {
    size: parseInt(process.env.CANVAS_SIZE || '20')
  },
  ...temp
};

export default config;