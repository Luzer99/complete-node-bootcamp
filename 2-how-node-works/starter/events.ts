import {EventEmitter} from 'events';
import * as http from 'http';


class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Costumer name: Jonas');
});

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.`);
})

myEmitter.emit('newSale', 9);

/////////////////////////////////////
const server = http.createServer();

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log('Request received!');
  res.end('Request received!');
});

server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
  console.log('Another request!');
});

server.on('close', () => {
  console.log('Server closed!');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listen to http://127.0.0.1:3000');
});

