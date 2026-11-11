// LOCAL MOCK ONLY: serves dist and exercises the actual server handler without sending email.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname,'../dist');
const handler = require('../api/contact');
const propertyHandler=require('../api/property-review');
const mock=require('./property-review-mock.cjs')();
global.fetch=mock.fetch;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.xml':'application/xml','.avif':'image/avif','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
 res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/api/contact'||pathname==='/api/property-review') {
  if(req.method==='POST') {
   let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>32768){res.writeHead(413,{'Content-Type':'application/json'});res.end('{"ok":false}');return;}}
   req.body=raw;
  }
  res.status=s=>{res.statusCode=s;return res;};res.json=v=>{console.log("MOCK RESPONSE",res.statusCode,v.error||"ok");res.end(JSON.stringify(v));return res;};await (pathname==='/api/property-review'?propertyHandler:handler)(req,res);return;
 }
 if(pathname==='/api/article-views/'){if(req.method!=='GET'){res.writeHead(405);res.end();return;}res.setHeader('Content-Type','application/json');res.end('{"counts":{}}');return;}
 if(req.method!=='GET'){res.writeHead(405);res.end();return;}
 let file=path.resolve(ROOT,'.'+decodeURIComponent(pathname));
 if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return;}
 let raw=fs.readFileSync(file);const ext=path.extname(file);
 if(ext==='.html')raw=raw.toString().replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,block=>/googletagmanager\.com|clarity\.ms|gtag\(/.test(block)?'':block).replace(/<noscript>[\s\S]*?<\/noscript>/gi,block=>block.includes('googletagmanager.com')?'':block);
 res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream'});res.end(raw);
}).listen(4178,'127.0.0.1',()=>console.log('LOCAL MOCK ONLY: http://127.0.0.1:4178/en/igalawrealestateduediligence/#property-legal-review — no emails sent. [simulate failure] tests errors.'));
