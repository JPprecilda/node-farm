const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require(`${__dirname}/modules/replaceTemplate`);


const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/cards.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
console.log(slugs);


console.log(slugify('Fresh Avocados', {lower: true}));
 

//////////
// SERVER
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //routing

   if(pathname === '/' || pathname === '/overview'){
    res.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);



    res.end(output);
   }
   else if(pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
   }
   else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
   }
   else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
            
        });
        res.end('<h1>Page not Found!</h1>');
   }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Listen request to server 8080!');
});