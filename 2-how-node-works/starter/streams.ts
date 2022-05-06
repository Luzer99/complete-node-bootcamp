import {createServer, IncomingMessage, ServerResponse} from 'http';
import {createReadStream} from "fs";
// import * as fs from "fs";

const server = createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // const readable = createReadStream('test-file.txt');
  // readable.on('data', chunk => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found.');
  // });

  const readable = createReadStream('test-file.txt');
  readable.pipe(res);
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listen to http://127.0.0.1:3000');
});