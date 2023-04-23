import zeromq from 'zeromq';
import { PUB_HOST_ADDRESS } from '../infra/environment.js'
import { getPubPort } from '../infra/pub-port.js';

export class ClusterManager {
    constructor(clusterListener, callback){
        this.nodesSocket = {};
        this.listener = clusterListener;
        this.callback = callback.bind(this);
        
    }

    async init(){
        const PORT = await getPubPort();
        this.publisher = zeromq.socket('pub').bindSync(`tcp://${PUB_HOST_ADDRESS}:${PORT}`);
        console.log(`Starting Publisher at PORT ${PORT}`);
        this.listener.init();
        this.listener.on('newHost', (host) => {
            this._addNode(host);
        });
    }

    _addNode(host){
        if(!this.nodesSocket[host]){
            console.log(`Adding newHost ${host}`);
            const newSock = zeromq.socket('sub').connect(`tcp://${host}`).subscribe('*');
            newSock.on('message', (_, data) => this.callback(JSON.parse(data)));
            this.nodesSocket[host] = newSock;
        }
    }

    async publish(data){
        return new Promise((res) => {
            console.log(`Publishing message...`);
            this.publisher.send(['*', data], 0, res);
        });
    }

}