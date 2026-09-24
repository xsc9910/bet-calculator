const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8' };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(path.resolve(root))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(Number(process.env.PORT) || 4173, '127.0.0.1', function () {
  console.log(`http://127.0.0.1:${this.address().port}`);
});
