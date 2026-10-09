import {http} from './http.js';import {createService} from './service.js';
const routes=[
 ['POST',/^\/scripts$/, (s,b)=>s.create(b)],
 ['GET',/^\/scripts\/([^/]+)$/, (s,b,id)=>s.get(id)],
 ['POST',/^\/scripts\/([^/]+)\/changes$/, (s,b,id)=>s.requestChange(id,b)],
 ['POST',/^\/scripts\/([^/]+)\/versions$/, (s,b,id)=>s.submitVersion(id,b)],
 ['POST',/^\/scripts\/([^/]+)\/approve$/, (s,b,id)=>s.approve(id)]
];
export function createApp(service=createService()){return http(service,routes);}
if(process.argv[1]&&import.meta.url===new URL(`file://${process.argv[1]}`).href){createApp().listen(3003,()=>console.log('http://localhost:3003'));}
