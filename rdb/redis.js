var Redis = require('ioredis');
var client = new Redis(
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
)
client.del('canvas').then(() => {
  var size = parseInt(process.env.CANVAS_SIZE);
  var vals = [];
  for (var i=0;i<size*size;i++) {
    // vals.push(Buffer.from([Math.floor(Math.random()*255)]))
    vals.push(Buffer.from([255]))
  }
  client.lpush('canvas', vals).then(() => client.disconnect())
})