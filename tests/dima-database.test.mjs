import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createStore, createDimaStore, DIMA_PROMPT_VERSION } from '../lib/dima/database.ts';
import { createSqliteDriver } from '../lib/dima/database-sqlite.ts';
import { getReviewedAnalysis, REVIEWED_WORDS } from '../lib/dima/corpus.ts';
import { createDimaHandlers } from '../lib/dima/service.ts';
import { createDimaAccessHandlers, hashCode } from '../lib/dima/access.ts';
import { createReviewHandlers } from '../lib/dima/review.ts';
import { parseGeneration } from '../lib/dima/prompt.ts';

const env = { DIMA_SESSION_SECRET: 'test-only-'.repeat(5), DIMA_PLUS_CODE_HASH: hashCode('TEST PLUS'), DIMA_BOOK_CODE_HASH: hashCode('TEST BOOK') };
const noFetch = async () => { throw new Error('No network expected'); };
async function query(word, context = '', level = 'plus') {
  const auth = await createDimaAccessHandlers(env).POST(new Request('http://localhost/api/dima/access', { method: 'POST', body: JSON.stringify({ codigo: 'TEST PLUS' }) }));
  return new Request('http://localhost/api/dima', { method: 'POST', headers: { cookie: auth.headers.get('set-cookie').split(';')[0] }, body: JSON.stringify({ palabra: word, contexto: context, nivel: level }) });
}
const memory = () => createStore(createSqliteDriver(':memory:'));

test('La base real conserva las lecturas completas al cerrar y volver a abrir el archivo', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'dima-db-'));
  const filename = path.join(directory, 'dima.sqlite');
  let store;
  try {
    store = await createDimaStore({ DIMA_SQLITE_PATH: filename });
    const result = getReviewedAnalysis('Molde');
    const saved = await store.save(result, { contexto: 'Un ejemplo privado', modelo: 'test-model' });
    store.close();
    store = await createDimaStore({ DIMA_SQLITE_PATH: filename });
    const restored = await store.get(saved.id);
    assert.deepEqual(restored.resultado, result);
    assert.equal(restored.contexto, 'Un ejemplo privado');
    assert.equal(restored.estado, 'pendiente');
    assert.equal(restored.consultas, 1);
    assert.equal(restored.versionPrompt, DIMA_PROMPT_VERSION);
  } finally { store?.close(); await rm(directory, { recursive: true, force: true }); }
});

test('Repetir una respuesta no duplica la ficha y cuenta cada consulta, incluso en concurrencia', async () => {
  const store = memory();
  try {
    await Promise.all(Array.from({ length: 12 }, () => store.save(getReviewedAnalysis('Devoción'))));
    const list = await store.list();
    assert.equal(list.total, 1);
    assert.equal(list.entradas[0].consultas, 12);
  } finally { store.close(); }
});

test('Las 44 entradas se importan sin duplicarse ni inventar consultas de usuarios', async () => {
  const store = memory();
  try {
    for (let run = 0; run < 2; run++) for (const word of REVIEWED_WORDS) await store.save(getReviewedAnalysis(word), { seleccion: true, consulta: false });
    const list = await store.list();
    assert.equal(list.total, 44);
    assert.ok(list.entradas.every((entry) => entry.estado === 'seleccion' && entry.consultas === 0));
    const delivered = await store.save(getReviewedAnalysis('Devoción'));
    assert.equal(delivered.estado, 'seleccion');
    assert.equal(delivered.consultas, 1);
  } finally { store.close(); }
});

test('El caché separa contexto, acentos, modelo y versiones descartadas', async () => {
  const store = memory();
  try {
    const result = { ...getReviewedAnalysis('Devoción'), palabra: 'sí', origen: 'ia' };
    const saved = await store.save(result, { contexto: 'en un vínculo', modelo: 'modelo-a' });
    assert.equal((await store.find('Sí', 'en un vínculo', 'modelo-a')).id, saved.id);
    assert.equal(await store.find('si', 'en un vínculo', 'modelo-a'), undefined);
    assert.equal(await store.find('sí', 'en el trabajo', 'modelo-a'), undefined);
    assert.equal(await store.find('sí', 'en un vínculo', 'modelo-b'), undefined);
    await store.review(saved.id, 'revisada');
    assert.equal((await store.find('sí', 'en un vínculo', 'modelo-a')).estado, 'revisada');
    await store.review(saved.id, 'descartada');
    assert.equal(await store.find('sí', 'en un vínculo', 'modelo-a'), undefined);
    await assert.rejects(store.save(result, { contexto: 'en un vínculo', modelo: 'modelo-a' }));
    assert.equal((await store.get(saved.id)).estado, 'descartada');
    assert.equal((await store.get(saved.id)).consultas, 1);
    assert.equal((await store.list()).total, 1); // History remains available.
  } finally { store.close(); }
});

test('Un fallo al registrar la consulta revierte también la inserción de la ficha', async () => {
  const driver = createSqliteDriver(':memory:');
  const store = createStore(driver);
  try {
    await store.initialize();
    await driver.query("CREATE TRIGGER fail_log BEFORE INSERT ON dima_consultations BEGIN SELECT RAISE(ABORT, 'test failure'); END");
    await assert.rejects(store.save(getReviewedAnalysis('Molde')));
    assert.equal((await store.list()).total, 0);
  } finally { store.close(); }
});

test('Plus guarda antes de responder y reutiliza una lectura sin volver a llamar a la IA', async () => {
  const store = memory(); let providerCalls = 0;
  try {
    const generated = getReviewedAnalysis('Devoción');
    const handlers = createDimaHandlers({ env: { ...env, ANTHROPIC_API_KEY: 'test-only', DIMA_MODEL: 'test-model' }, store, fetch: async (url) => {
      if (url.includes('docs.google.com')) return new Response('Forma,Texto\nOtra,archivo\n');
      providerCalls++;
      return Response.json({ model: 'test-model', stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(generated) }] });
    } });
    const first = await handlers.POST(await query('Palabra de prueba'));
    assert.equal(first.status, 200);
    const response = await first.json();
    assert.equal(response.registro.guardado, true);
    assert.equal(response.registro.estado, 'pendiente');
    assert.equal((await store.get(response.registro.id)).resultado.palabra, 'Palabra de prueba');
    const again = await (await handlers.POST(await query('Palabra de prueba'))).json();
    assert.equal(again.registro.id, response.registro.id);
    assert.equal(providerCalls, 1);
    assert.equal((await store.get(response.registro.id)).consultas, 2);
    assert.equal((await (await handlers.GET()).json()).palabras.length, 44);
  } finally { store.close(); }
});

test('La selección conocida también se registra cuando se consulta desde Plus', async () => {
  const store = memory();
  try {
    const handlers = createDimaHandlers({ env, store, fetch: noFetch });
    const result = await (await handlers.POST(await query('Molde'))).json();
    assert.equal(result.registro.guardado, true);
    assert.equal((await store.get(result.registro.id)).resultado.inside.linguistica.categoria, 'Sustantivo masculino.');
  } finally { store.close(); }
});

test('Sin una base duradera Plus falla antes de gastar IA; la gratuita sigue disponible', async () => {
  const handlers = createDimaHandlers({ env, fetch: noFetch });
  assert.equal((await handlers.POST(await query('Molde'))).status, 503);
  assert.equal((await handlers.POST(await query('Molde', '', 'free'))).status, 200);
  await assert.rejects(createDimaStore({ VERCEL: '1', DIMA_SQLITE_PATH: '/tmp/dima.sqlite' }));
});

test('No se afirma un guardado cuando la escritura falla ni se aceptan lecturas sin morfología', async () => {
  const store = memory();
  try {
    const result = getReviewedAnalysis('Devoción'); delete result.inside.linguistica;
    await assert.rejects(store.save(result));
    assert.throws(() => parseGeneration(JSON.stringify(result), 'end_turn', 'Devoción'));
    const handlers = createDimaHandlers({ env, store: { ...store, save: async () => { throw new Error('private-db-detail'); } }, fetch: noFetch });
    const response = await handlers.POST(await query('Molde'));
    assert.equal(response.status, 503);
    const body = await response.text();
    assert.ok(!body.includes('private-db-detail'));
    assert.ok(!body.includes('"guardado":true'));
  } finally { store.close(); }
});

test('Una modalidad con formato inválido no permite evitar el guardado de Plus', async () => {
  const store = memory();
  try {
    const handlers = createDimaHandlers({ env, store, fetch: noFetch });
    const response = await handlers.POST(await query('Molde', '', ['plus']));
    assert.equal(response.status, 400);
    assert.equal((await store.list()).total, 0);
  } finally { store.close(); }
});

test('La revisión y la exportación son privadas; revisar una ficha no la publica', async () => {
  const store = memory();
  try {
    const saved = await store.save(getReviewedAnalysis('Molde'));
    const handlers = createReviewHandlers({ DIMA_LOCAL_REVIEW: '1' }, async () => store);
    assert.equal((await handlers.GET(new Request('https://example.test/api/dima/base'))).status, 404);
    assert.equal((await createReviewHandlers({ DIMA_LOCAL_REVIEW: '1', VERCEL: '1' }, async () => store).GET(new Request('http://localhost/api/dima/base'))).status, 404);
    assert.equal((await handlers.PATCH(new Request('http://localhost/api/dima/base', { method: 'PATCH', headers: { origin: 'https://evil.test' }, body: JSON.stringify({ id: saved.id, estado: 'revisada' }) }))).status, 403);
    const response = await handlers.PATCH(new Request('http://localhost/api/dima/base', { method: 'PATCH', body: JSON.stringify({ id: saved.id, estado: 'revisada' }) }));
    assert.equal((await response.json()).estado, 'revisada');
    const exported = await handlers.GET(new Request('http://localhost/api/dima/base?exportar=1'));
    assert.ok(exported.headers.get('content-disposition').includes('attachment'));
    assert.equal((await exported.json()).entradas.length, 1);
    assert.equal(REVIEWED_WORDS.length, 44);
  } finally { store.close(); }
});
