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
            this.currentTimestamp = Date.now();
            redisClient.xrange('websocket:cluster:nodes', '-', `${this.currentTimestamp}`, (_, values) => {
              for(const [timestamp, [key, value]] of values){
                this.emit('newHost', value);
              }
              this.currentTimestamp = Date.now();
            })
        
            setInterval(() => {
              const usedTimestamp = Date.now();
        
              redisClient.xrange('websocket:cluster:nodes', `${this.currentTimestamp}`, `${usedTimestamp}`, (_, values) => {
                if(values.length){
                  this.currentTimestamp = Date.now();
                }
                for(const [timestamp, [key, value]] of values){
                  this.emit('newHost', value);
                }
                
              })
            }, 1000)
          });
    }

    async _addToStream(cb){
      const PORT = await getPubPort();
      this.redisClient.xadd('websocket:cluster:nodes','*', 'host', `127.0.0.1:${PORT}`, cb);
    }
}
