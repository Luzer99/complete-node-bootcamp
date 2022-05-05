import * as http from 'http';
import { readFileSync } from 'fs';
import * as url from 'url';
import slugify from 'slugify';
import {ProductQuery} from "./types/query";
import {DataElement} from "./types/data-element";
import {replaceTemplate} from "../modules/replaceTemplate";

type ProductParse = { query: ProductQuery, pathname: string };

const tempOverview = readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj: DataElement[] = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { query, pathname } : ProductParse = url.parse(req.url, true);

    //OVERVIEW PAGE
    if (['/', '/overview'].some((val) => val === pathname)) {
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

      res.writeHead(200, { 'Content-type': 'text/html' });
      res.end(output);
      //PRODUCT PAGE
    } else if (pathname === '/product') {
      const product = dataObj[Number(query.id)];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    //API
    } else if (pathname === '/api') {
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
