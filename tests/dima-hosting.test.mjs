import test from 'node:test';
import assert from 'node:assert/strict';
import { createSnapshotStore, SnapshotConflict } from '../lib/dima/database-snapshot.ts';
import { getReviewedAnalysis, REVIEWED_WORDS } from '../lib/dima/corpus.ts';
import { dimaProvider } from '../lib/dima/provider.ts';
import { createDimaHandlers } from '../lib/dima/service.ts';
import { createDimaAccessHandlers, hashCode } from '../lib/dima/access.ts';

function archive() {
 let value, version=0;
 const driver={
  async read(){return value ? {value:structuredClone(value),etag:String(version)} : undefined;},
  async write(next,etag){
   if((value && etag!==String(version)) || (!value && etag!==undefined))throw new SnapshotConflict();
   value=structuredClone(next);version++;
  },
 };
 return {driver, snapshot:()=>structuredClone(value)};
}
const env={DIMA_SESSION_SECRET:'test-secret-'.repeat(5),DIMA_BOOK_CODE_HASH:hashCode('TEST BOOK'),DIMA_PLUS_CODE_HASH:hashCode('TEST PLUS'),VERCEL:'1',VERCEL_OIDC_TOKEN:'test-deployment-identity',DIMA_GATEWAY_MODEL:'anthropic/claude-haiku-4.5'};
async function request(palabra,nivel='plus'){
 const auth=await createDimaAccessHandlers(env).POST(new Request('https://example.com/api/dima/access',{method:'POST',headers:{Origin:'https://example.com'},body:JSON.stringify({codigo:nivel==='libro'?'TEST BOOK':'TEST PLUS'})}));
 return new Request('https://example.com/api/dima',{method:'POST',headers:{cookie:auth.headers.get('set-cookie').split(';')[0]},body:JSON.stringify({palabra,nivel})});
}
function generated(){const result=getReviewedAnalysis('Devoción');return {inside:result.inside,analisis:result.analisis};}

test('El archivo privado conserva una sola ficha y ocho consultas concurrentes entre instancias',async()=>{
 const db=archive();
 const stores=Array.from({length:8},()=>createSnapshotStore(db.driver));
 const results=await Promise.all(stores.map(store=>store.save(getReviewedAnalysis('Common'))));
 assert.equal(new Set(results.map(row=>row.id)).size,1);
 const reopened=createSnapshotStore(db.driver);
 const entry=await reopened.get(results[0].id);
 assert.equal(entry.consultas,8);
 assert.equal((await reopened.list()).total,1);
 assert.equal(db.snapshot().consultas.length,8);
});

test('Un fallo de escritura no modifica ni la ficha ni el registro de consulta',async()=>{
 const db=archive();const store=createSnapshotStore(db.driver);
 const original=await store.save(getReviewedAnalysis('Molde'));
 const before=db.snapshot();
 const broken=createSnapshotStore({...db.driver,write:async()=>{throw new Error('storage unavailable');}});
 await assert.rejects(broken.save(getReviewedAnalysis('Common')));
 assert.deepEqual(db.snapshot(),before);
 assert.equal((await store.get(original.id)).consultas,1);
});

test('El archivo conserva contexto, acentos y modelo al reutilizar; descartar impide reactivar una versión',async()=>{
 const db=archive();const store=createSnapshotStore(db.driver);
 const value=getReviewedAnalysis('Molde');value.palabra='Sí';
 const saved=await store.save(value,{contexto:'mi contexto',modelo:'test-model'});
 assert.equal((await store.find('SÍ','mi contexto','test-model')).id,saved.id);
 assert.equal(await store.find('si','mi contexto','test-model'),undefined);
 assert.equal(await store.find('sí','otro contexto','test-model'),undefined);
 assert.equal(await store.find('sí','mi contexto','otro-modelo'),undefined);
 await store.review(saved.id,'descartada');
 assert.equal(await store.find('sí','mi contexto','test-model'),undefined);
 await assert.rejects(store.save(value,{contexto:'mi contexto',modelo:'test-model'}));
 assert.equal(db.snapshot().consultas.length,1);
});

test('La inicialización incorpora las 44 palabras una sola vez y conserva su estado editorial',async()=>{
 const db=archive();const seed=REVIEWED_WORDS.map(getReviewedAnalysis);
 const store=createSnapshotStore(db.driver,seed);await store.initialize();
 const reopened=createSnapshotStore(db.driver,seed);await reopened.initialize();
 assert.equal((await reopened.list()).total,44);
 const row=(await reopened.exportReadings())[0];
 assert.equal((await reopened.review(row.id,'descartada')).estado,'seleccion');
 assert.equal(db.snapshot().consultas.length,0);
});

test('Gateway usa la identidad solo en Vercel; la conexión directa existente conserva prioridad',()=>{
 const gateway=dimaProvider(env);
 assert.equal(gateway.url,'https://ai-gateway.vercel.sh/v1/messages');
 assert.equal(gateway.headers.Authorization,'Bearer test-deployment-identity');
 assert.equal(gateway.headers['x-api-key'],undefined);
 assert.equal(dimaProvider({...env,VERCEL:undefined}),undefined);
 assert.equal(dimaProvider({...env,ANTHROPIC_API_KEY:'test-provider-key'}).url,'https://api.anthropic.com/v1/messages');
});

test('Una palabra del libro se genera, guarda y reutiliza desde Plus sin una segunda generación',async()=>{
 const db=archive();const store=createSnapshotStore(db.driver);let calls=0;
 const handlers=createDimaHandlers({env,store,fetch:async(url,options)=>{
  if(String(url).includes('/v1/messages')){
   calls++;
   assert.equal(String(url),'https://ai-gateway.vercel.sh/v1/messages');
   assert.equal(options.headers.Authorization,'Bearer test-deployment-identity');
   assert.equal(JSON.parse(options.body).model,env.DIMA_GATEWAY_MODEL);
   return Response.json({model:'provider-returned-alias',stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify(generated())}]});
  }
  return new Response('Forma,Indicia Obscura\nOtra,Texto\n');
 }});
 const book=await handlers.POST(await request('Umbral','libro'));
 assert.equal(book.status,200);const first=await book.json();assert.equal(first.registro.guardado,true);
 const plus=await handlers.POST(await request('Umbral'));
 assert.equal(plus.status,200);const second=await plus.json();
 assert.equal(first.registro.id,second.registro.id);
 assert.equal(calls,1);
 assert.equal((await store.get(first.registro.id)).consultas,2);
 assert.equal((await handlers.GET(new Request('https://example.com/api/dima?nivel=libro',{headers:(await request('Umbral','libro')).headers}))).status,200);
});

test('El libro también exige almacenamiento antes de generar y el acceso informa Gateway disponible',async()=>{
 const handlers=createDimaHandlers({env,fetch:async()=>{throw new Error('no network expected');}});
 assert.equal((await handlers.POST(await request('Umbral','libro'))).status,503);
 const req=await request('Umbral');
 const access=await createDimaAccessHandlers(env).GET(new Request('https://example.com/api/dima/access',{headers:req.headers}));
 assert.equal((await access.json()).consultaLibreDisponible,true);
});

test('El catálogo privado de Plus reúne gratuita, libro y nuevas consultas sin publicar contextos ni fichas descartadas',async()=>{
 const db=archive();const store=createSnapshotStore(db.driver,REVIEWED_WORDS.map(getReviewedAnalysis));
 const novel=getReviewedAnalysis('Molde');novel.palabra='Palabra nueva del vivo';
 await store.save(novel,{contexto:'contexto privado',modelo:env.DIMA_GATEWAY_MODEL});
 const hidden=getReviewedAnalysis('Common');hidden.palabra='Palabra descartada';
 const discarded=await store.save(hidden);await store.review(discarded.id,'descartada');
 const handlers=createDimaHandlers({env,store,fetch:async()=>{throw new Error('no network');}});
 assert.equal((await handlers.GET(new Request('https://example.com/api/dima?nivel=plus'))).status,401);
 const response=await handlers.GET(new Request('https://example.com/api/dima?nivel=plus',{headers:(await request('Molde')).headers}));
 assert.equal(response.status,200);const data=await response.json();
 for(const word of ['Common','Umbral','Palabra nueva del vivo'])assert.ok(data.palabras.includes(word));
 assert.ok(!data.palabras.includes('Palabra descartada'));
 assert.ok(!JSON.stringify(data).includes('contexto privado'));
 assert.equal((await (await handlers.GET()).json()).palabras.length,44);
});
