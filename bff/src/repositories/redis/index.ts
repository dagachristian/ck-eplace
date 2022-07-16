import Redis from 'ioredis';

import config from '../../config';

export let client: Redis;

export const connectRedis = async () => {
  client = new Redis({
    port: config.redis.port,
    host: config.redis.host
  });
  client.get('canvas', (err, data) => {
    if (err || !data) {
      console.log('populating canvas data')
      var size = config.canvas.size;
      var vals: Buffer[] = [];
      const val = Buffer.from([255])
      for (var i=0;i<size*size;i++) {
        // vals.push(Buffer.from([Math.floor(Math.random()*255)]))
        vals.push(val)
      }
      client.lpush('canvas', ...vals)
    }
  })
}

export const disconnectRedis = async () => {
  await client.disconnect();
}
