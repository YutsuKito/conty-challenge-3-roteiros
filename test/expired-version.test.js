import test from 'node:test';import assert from 'node:assert/strict';import {createService} from '../src/service.js';
test('versão recebida no primeiro milissegundo após prazo é recusada sem alterar histórico',()=>{
  let current='2026-04-02T02:59:59.999Z';const service=createService({now:()=>new Date(current)});
  const script=service.create({brand_id:'b',content:'original'});service.requestChange(script.id,{reason:'ajustar',deadline_date:'2026-04-01'});
  const before=service.get(script.id);current='2026-04-02T03:00:00.000Z';
  assert.throws(()=>service.submitVersion(script.id,{content:'late'}),{status:409});assert.deepEqual(service.get(script.id),before);
});
