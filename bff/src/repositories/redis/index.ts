import Redis from 'ioredis';

import { populateCanvas } from '../../services/canvasService';
import config from '../../config';

export let client: Redis;

export const connectRedis = async () => {
  client = new Redis({
    port: config.redis.port,
    host: config.redis.host
  });
  client.on('connect', () => console.log('Redis Connected.'))
  client.on('error', (e) => console.log('Redis Error.', e))
  client.on('close', () => console.log('Redis Disconnected.'))
  client.get('0', async (err, data) => {
    var size = (config.canvas.size * config.canvas.size);
    if (err || data==null || data.length != size) {
      console.log('populating canvas data...')
      await client.del('0')
      await populateCanvas('0', config.canvas.size);
    }
  })
}

export const disconnectRedis = async () => {
  await client.quit();
}
