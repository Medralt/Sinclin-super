const express=require('express');
const app=express();
app.use(express.json());

const d=require('C:/sinclin/core/src/sioc/resolve/decision.engine.js');

app.post('/chat',(req,res)=>res.json(d.run(req.body)));

app.listen(3001,()=>console.log('API ON 3001'));
