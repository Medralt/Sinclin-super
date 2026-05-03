const http=require('http');
const fs=require('fs');

http.createServer((req,res)=>{
fs.readFile('index.html',(e,d)=>{
res.writeHead(200,{'Content-Type':'text/html'});
res.end(d);
});
}).listen(8080,()=>console.log('UI ON 8080'));
