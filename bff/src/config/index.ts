export default require('./local.env.json') as {
  db: {
    host: string,
    database: string,
    port: number,
    user: string,
    password: string,
    poolMax: 10
  },
  jwt: {
    secret: string
  }
};