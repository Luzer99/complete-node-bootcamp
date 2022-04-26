import * as http from 'http';
import { readFileSync } from 'fs';

const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const pathName = req.url;

    if (['/', '/overview'].some((val) => val === pathName)) {
      res.end('This is the OVERVIEW');
    } else if (pathName === '/product') {
      res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
    } else {
      res.writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'hello-world',
      });
      res.end('<h1>Page not found!</h1>');
    }
  }
);

server.listen(8000, '127.0.0.1', () => {
  console.log('Listen to requests on http://localhost:8000');
});
