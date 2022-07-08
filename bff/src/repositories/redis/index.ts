import { createClient, RedisClientType } from 'redis';

import config from '../../config';

export let client: RedisClientType;

export const connectRedis = async () => {
  client = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`
  });
  await client.connect();
}

export const disconnectRedis = async () => {
  await client.disconnect();
}
