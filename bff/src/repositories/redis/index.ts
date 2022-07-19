import Redis from 'ioredis';

import config from '../../config';

export let client: Redis;

export const connectRedis = async () => {
  client = new Redis({
    port: config.redis.port,
    host: config.redis.host
  });
  client.get('canvas', async (err, data) => {
    var size = (config.canvas.size * config.canvas.size);
    if (err || data==null || data.length != size) {
      console.log('populating canvas data')
      var val = 0xff
      var vals = [];
      for (var i=0;i<size;i++) {
        // vals.push(Buffer.from([Math.floor(Math.random()*255)]))
        vals.push(val)
      }
      await client.del('canvas')
      await client.set('canvas', Buffer.from(vals))
    }
  })
}

export const disconnectRedis = async () => {
  await client.disconnect();
}
