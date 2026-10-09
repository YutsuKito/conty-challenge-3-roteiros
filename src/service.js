import { fail, required } from './http.js';
const tz='America/Sao_Paulo';
export function localDay(date) {
  const d=new Date(date);
  if (!Number.isFinite(d.getTime())) fail('Data inválida');
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
  const get=x=>parts.find(p=>p.type===x).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
const validDay=s=>{if(typeof s!=='string'||!/^\d{4}-\d\d-\d\d$/.test(s))return false;const date=new Date(`${s}T12:00:00Z`);return Number.isFinite(date.getTime())&&date.toISOString().startsWith(s);};
export function createService({now=()=>new Date()}={}) {
  const scripts=new Map();let serial=0;
  function find(id) {const s=scripts.get(id);if(!s) fail('Roteiro não encontrado',404);return s;}
  return {
    create({brand_id,content}) {required(typeof brand_id==='string'&&brand_id.length>0,'Marca obrigatória');required(typeof content==='string'&&content.trim(),'Conteúdo obrigatório');
      const id=`scr_${++serial}`;const s={id,brand_id,status:'submitted',versions:[{number:1,content,created_at:now().toISOString()}],change_requests:[],current_version:1};scripts.set(id,s);return structuredClone(s);},
    get(id){return structuredClone(find(id));},
    requestChange(id,{reason,deadline_date}) {const s=find(id);if(s.status==='approved') fail('Roteiro aprovado não reabre',409);if(s.status!=='submitted') fail('Já existe pedido de alteração pendente',409);
      required(typeof reason==='string'&&!!reason.trim(),'Motivo é obrigatório');required(validDay(deadline_date),'Prazo civil inválido');if(deadline_date<localDay(now())) fail('Prazo já expirou',409);
      s.change_requests.push({reason:reason.trim(),deadline_date,requested_at:now().toISOString(),for_version:s.current_version});s.status='changes_requested';return structuredClone(s);},
    submitVersion(id,{content}) {const s=find(id);if(s.status==='approved') fail('Roteiro aprovado não aceita versões',409);if(s.status!=='changes_requested') fail('Não há revisão solicitada',409);
      required(typeof content==='string'&&!!content.trim(),'Conteúdo obrigatório');const req=s.change_requests.at(-1);if(localDay(now())>req.deadline_date) fail('Prazo de revisão encerrado',409);
      const number=s.versions.length+1;s.versions.push({number,content,created_at:now().toISOString()});s.current_version=number;s.status='submitted';return structuredClone(s);},
    approve(id) {const s=find(id);if(s.status==='approved') fail('Aprovação é final',409);if(s.status!=='submitted') fail('Alterações pendentes impedem aprovação',409);
      s.status='approved';s.approved_version=s.current_version;s.approved_at=now().toISOString();return structuredClone(s);}
  };
}
