import test from 'node:test';import assert from 'node:assert/strict';
import {createService,localDay} from '../src/service.js';
const clock=iso=>({now:()=>new Date(iso)});
test('último instante de dia da marca é válido, primeiro do dia seguinte não',()=>{
 assert.equal(localDay('2026-04-02T02:59:59.999Z'),'2026-04-01');assert.equal(localDay('2026-04-02T03:00:00.000Z'),'2026-04-02');
 const s=createService(clock('2026-04-02T02:59:59.999Z'));const x=s.create({brand_id:'marca',content:'v1'});s.requestChange(x.id,{reason:'marca pediu correção',deadline_date:'2026-04-01'});assert.equal(s.submitVersion(x.id,{content:'v2'}).versions.length,2);
 const t=createService(clock('2026-04-02T03:00:00.000Z'));const y=t.create({brand_id:'marca',content:'v1'});assert.throws(()=>t.requestChange(y.id,{reason:'tarde',deadline_date:'2026-04-01'}),{status:409});
});
test('histórico imutável, aprovação terminal e estados explícitos',()=>{const s=createService(clock('2026-01-02T15:00:00Z'));const x=s.create({brand_id:'a',content:'original'});assert.throws(()=>s.requestChange(x.id,{reason:'',deadline_date:'2026-01-03'}));assert.throws(()=>s.requestChange(x.id,{reason:'x'}));s.requestChange(x.id,{reason:'corrigir',deadline_date:'2026-01-03'});assert.throws(()=>s.approve(x.id),{status:409});s.submitVersion(x.id,{content:'novo'});assert.equal(s.get(x.id).versions[0].content,'original');s.approve(x.id);assert.throws(()=>s.requestChange(x.id,{reason:'x',deadline_date:'2026-01-04'}),{status:409});assert.throws(()=>s.submitVersion(x.id,{content:'outro'}),{status:409});});

test('prazo civil impossível retorna erro validado',()=>{const s=createService(clock('2026-01-01T12:00:00Z'));const x=s.create({brand_id:'brand',content:'v1'});assert.throws(()=>s.requestChange(x.id,{reason:'x',deadline_date:'2026-99-99'}),{status:400});});
