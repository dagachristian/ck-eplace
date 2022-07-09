import Redis from 'ioredis';

import config from '../../config';

export let client: Redis;

export const connectRedis = async () => {
  client = new Redis({
    port: config.redis.port,
    host: config.redis.host
  });
}

export const disconnectRedis = async () => {
  await client.disconnect();
}
