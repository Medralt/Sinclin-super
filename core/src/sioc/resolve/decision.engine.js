const fs = require('fs');

const sessions = {};

function saveSession(id,data){
const dir="C:\\sinclin\\core\\data\\anamnese\\sessions";
if(!fs.existsSync(dir)){fs.mkdirSync(dir,{recursive:true});}
fs.writeFileSync(dir+"\\"+id+".json",JSON.stringify(data,null,2));
}

function run(p){

const id=p.session_id;

if(!sessions[id]){
sessions[id]={step:"start",data:{paciente:{},anamnese:{}}};
}

const s=sessions[id];
const t=p.input.raw_text;

let r="";

switch(s.step){

case "start":
s.step="coletar_id";
r="Informe o identificador do paciente (CPF ou ID):";
break;

case "coletar_id":
s.data.paciente.id=t;
s.step="coletar_nome";
r="Qual o nome do paciente?";
break;

case "coletar_nome":
s.data.paciente.nome=t;
s.step="coletar_idade";
r="Qual a idade do paciente?";
break;

case "coletar_idade":
s.data.paciente.idade=t;
s.step="coletar_queixa";
r="Qual a principal queixa?";
break;

case "coletar_queixa":
s.data.anamnese.queixa=t;
s.step="coletar_intensidade";
r="Qual a intensidade (0 a 10)?";
break;

case "coletar_intensidade":
s.data.anamnese.intensidade=t;
saveSession(s.data.paciente.id,s.data);
s.step="finalizado";
r="Anamnese finalizada.";
break;
}

return {text:r,next_step:s.step,structured:s.data};
}

module.exports={run};
