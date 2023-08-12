import { redisClient } from "../infra/redis.client.js";
import { EventEmitter } from 'events'
import { getPubPort } from "../infra/pub-port.js";

export class ClusterListener extends EventEmitter {

    constructor(redisClient){
      super()
      this.redisClient = redisClient;
    }
  
    init(){
        this._addToStream(() => {
            redisClient.zrange('websocket:cluster:nodes', 0, -1, (err, values) => {
              if(err){
                throw err;
              }
              for(const host of values){
                this.emit('newHost', host);
              }
              setInterval(() => {
                const usedTimestamp = Date.now();
                redisClient.zrangebyscore('websocket:cluster:nodes', `${this.currentTimestamp}`, `${usedTimestamp}`, (err, values) => {
                  if(err){
                    throw err;
                  }
                  if(values.length){
                    this.currentTimestamp = usedTimestamp;
                  }
                  for(const host of values){
                    this.emit('newHost', host);
                  }
                  
                })
              }, 1000)
            })
          });
    }

    async _addToStream(cb){
      const PORT = await getPubPort();
      this.currentTimestamp = Date.now();
      this.redisClient.zadd('websocket:cluster:nodes', this.currentTimestamp, `127.0.0.1:${PORT}`, cb);
    }
}
