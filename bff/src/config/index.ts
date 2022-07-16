import local from './local.env';

const environment = process.env.NODE_ENV || 'dev';
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
    expiresIn: {
      api: string,
      refresh: string
    }
  },
  canvas: {
    size: number
  }
};

switch (environment) {
  case 'dev':
    config = local;
    break;
  default:
    config = local;
    break;
}

export default config;