var redis = require('redis');
var client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
client.connect().then(() => {
  client.del('canvas').then(() => {
    var size = parseInt(process.env.CANVAS_SIZE);
    var vals = [];
    for (var i=0;i<size*size;i++) {
      vals.push(Math.floor(Math.random()*255).toString())
    }
    client.lPush('canvas', vals).then(() => client.disconnect())
  })
});