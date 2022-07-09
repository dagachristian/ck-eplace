export default require('./local.env.json') as {
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
    poolMax: 10
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