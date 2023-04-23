import { ClusterListener } from './src/cluster/listener.js';
import { redisClient } from './src/infra/redis.client.js';
import { WebSocketServer } from 'ws';
import { ClusterManager } from './src/cluster/manager.js';
import { getPortPromise } from 'portfinder';

async function main(){
  const clusterListener = new ClusterListener(redisClient);
  const clusterManager = new ClusterManager(clusterListener, (data) => {
    const socket = sockets[data.id];
    if(!socket){
      console.log(`received message for ${data.id} but no socket`);
      return;
    }
    
    console.log(`Emitting message to ${data.id}`);
    socket.send(JSON.stringify({
      response: 'Ok',
      data
    }));
  });

  clusterManager.init();

  const sockets = {};

  const WS_PORT = await getPortPromise();

  console.log(`Starting WS on ${WS_PORT}`);

  const server = new WebSocketServer({ port: WS_PORT })

  server.on('connection', (socket) => {

    const id = Math.ceil(Math.random() * 3);

    console.log(`supposed user with id: ${id} connected into websocket`);

    sockets[id] = socket;

    socket.emit('message', JSON.stringify({ id }));
    
    socket.on('message', (dataBuffer) => {
      clusterManager.publish(dataBuffer)
    });
  })

}

main()