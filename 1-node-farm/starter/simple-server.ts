import * as http from 'http';
import { readFileSync } from 'fs';
import { DataElement } from './types/data-element';

const replaceTemplate = (temp: string, product: DataElement) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
}

const tempOverview = readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj: DataElement[] = JSON.parse(data);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const pathName = req.url;

    //OVERVIEW PAGE
    if (['/', '/overview'].some((val) => val === pathName)) {
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

      res.writeHead(200, { 'Content-type': 'text/html' });
      res.end(output);
      //PRODUCT PAGE
    } else if (pathName === '/product') {
      res.end('This is the PRODUCT');
    //API
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

server.listen(3000, '127.0.0.1', () => {
  console.log('Listen to requests on http://localhost:3000');
});
