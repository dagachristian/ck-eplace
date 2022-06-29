export default require('./local.env.json') as {
  api: {
    endpoint: string
  },
  db: {
    host: string,
    database: string,
    port: number,
    user: string,
    password: string,
    poolMax: 10
  },
  jwt: {
    secret: string,
    expiresIn: string
  }
};