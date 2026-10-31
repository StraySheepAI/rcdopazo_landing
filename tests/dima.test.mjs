import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMA_STEPS, readResult } from '../lib/dima/schema.ts';
import { adaptRow, parseCsv } from '../lib/dima/adapter.ts';
import { REVIEWED_WORDS, getReviewedAnalysis } from '../lib/dima/corpus.ts';
import { parseGeneration } from '../lib/dima/prompt.ts';
import { createDimaHandlers as rawCreateDimaHandlers } from '../lib/dima/service.ts';

import { createDimaAccessHandlers, hashCode, readDimaAccess, DIMA_COOKIE } from '../lib/dima/access.ts';
const ACCESS_ENV = { DIMA_SESSION_SECRET: 'test-only-secret-'.repeat(4), DIMA_BOOK_CODE_HASH: hashCode('TEST BOOK'), DIMA_PLUS_CODE_HASH: hashCode('TEST PLUS') };
const createDimaHandlers = (deps) => rawCreateDimaHandlers({ ...deps, env: { ...ACCESS_ENV, ...deps.env } });
async function authorizedRequest(body) {
  const req = request(body);
  if (body.nivel === 'free') return req;
  const response = await createDimaAccessHandlers(ACCESS_ENV).POST(new Request('http://localhost/api/dima/access', { method: 'POST', body: JSON.stringify({ codigo: body.nivel === 'libro' ? 'TEST BOOK' : 'TEST PLUS' }) }));
  req.headers.set('cookie', response.headers.get('set-cookie').split(';')[0]);
  return req;
}

const request = (body) => new Request('http://localhost/api/dima', { method: 'POST', body: JSON.stringify(body) });
const noFetch = async () => { throw new Error('This path must not access the network'); };
const csv = () => new Response('Forma,Indicia Obscura\nEntrada especial,Material antiguo sobre esta entrada\n');
const generated = () => ({ inside: structuredClone(getReviewedAnalysis('Devoción').inside), analisis: Object.fromEntries(DIMA_STEPS.map(({ id }) => [id, { texto: `Propuesta específica para ${id}`, estado: 'interpretacion', fuentes: [] }])) });

for (const palabra of REVIEWED_WORDS) {
  test(`Selección pública: ${palabra} entrega ocho pasos con contenido`, async () => {
    const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
    const response = await POST(request({ palabra: palabra.toUpperCase(), nivel: 'free' }));
    assert.equal(response.status, 200);
    const data = readResult(await response.json());
    assert.equal(data.estado, 'completo');
    assert.deepEqual(Object.keys(data.analisis), DIMA_STEPS.map(({ id }) => id));
    assert.equal(data.analisis.morfologia.estado, 'documentado');
    assert.ok(data.fuentes.length > 0);
    for (const [id, section] of Object.entries(data.analisis)) {
      assert.notEqual(section.estado, 'pendiente');
      assert.ok(section.texto.length > (id === 'sintesis' ? 15 : 40));
      assert.ok(!/Pendiente de análisis y revisión/.test(section.texto));
    }
  });
}

test('Regresión de catálogo: todas las palabras ofrecidas tienen ficha completa y no dependen de Sheets', async () => {
  const { GET } = createDimaHandlers({ fetch: noFetch, env: {} });
  const data = await (await GET()).json();
  assert.equal(data.palabras.length, 44);
  assert.equal(new Set(data.palabras).size, 44);
  assert.ok(data.palabras.every((word) => getReviewedAnalysis(word)?.estado === 'completo'));
  for (const word of ['Devoción', 'Normal', 'Miedo', 'Éxito', 'Trabajo', 'Right', 'Infans']) assert.ok(data.palabras.includes(word));
  assert.ok(!data.palabras.includes('Rigth'));
});

test('Patraña y Embole mantienen la misma lectura en las tres modalidades', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const palabra of ['Patraña', 'Embole']) {
    const results = [];
    for (const nivel of ['free', 'libro', 'metalquimico']) results.push(await (await POST(await authorizedRequest({ palabra, nivel }))).json());
    assert.deepEqual(results[0], results[1]); assert.deepEqual(results[1], results[2]);
  }
});

test('Una entrada sin convertir no puede presentarse como una consulta pública terminada', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  const response = await POST(request({ palabra: 'Entrada especial', nivel: 'free' }));
  assert.equal(response.status, 404);
  const data = await response.json(); assert.ok(data.error); assert.equal(data.analisis, undefined);
});

test('CSV: conserva saltos, comillas, columnas duplicadas y descarta invisibles', () => {
  const rows = parseCsv('\uFEFFForma,Ordo MPAe,Ordo MPAe,Indicia Obscura\r\n"Patraña","Uno","Dos","Una, línea\ncon ""comillas"""\r\nÉxito,,,\u200b\n');
  assert.equal(rows[0].Forma, 'Patraña');
  assert.equal(rows[0]['Ordo MPAe'], 'Uno\n\nDos');
  assert.equal(rows[0]['Indicia Obscura'], 'Una, línea\ncon "comillas"');
  assert.equal(rows[1]['Indicia Obscura'], undefined);
  assert.throws(() => parseCsv('Forma,Texto\nNormal,"sin cierre'));
  assert.throws(() => parseCsv('Otra,Texto\nNormal,dato'));
});

test('El adaptador conserva el archivo y no convierte campos vibracionales en análisis nuevo', () => {
  const data = adaptRow({ Forma: 'Archivo', Gradus_Vibrationi: 'Alta', Natura_Vibrationis: 'Disruptiva', Pulsus: 312, Radix_Aucta: 'origen sin fuente', Cierre: 'ritual' }, 'Archivo', 'base');
  assert.equal(data.estado, 'parcial');
  for (const { id } of DIMA_STEPS) assert.equal(data.analisis[id].estado, 'pendiente');
  assert.ok(data.archivo.some(({ etiqueta, texto }) => etiqueta === 'Gradus Vibrationi' && texto === 'Alta'));
  assert.ok(data.archivo.some(({ etiqueta }) => etiqueta === 'Radix Aucta'));
  assert.ok(!data.analisis.sintesis.texto.includes('ritual'));
});

test('Una ficha vacía no se autocertifica completa', () => {
  const data = adaptRow({ Forma: 'Archivo', 'Indicia Obscura': '\u200b', Gradus_Vibrationi: '—' }, 'Archivo', 'planilla');
  assert.equal(data.estado, 'parcial'); assert.deepEqual(data.archivo, []);
});

test('Los campos nuevos de archivo se conservan sin certificar el origen', () => {
  const data = adaptRow({ Forma: 'Archivo', Morfologia_Etimologia: 'Origen declarado', Pulsus_DIMA: 'Aproximación', Nodus_DIMA: 'Relación propuesta' }, 'Archivo', 'base');
  assert.equal(data.analisis.morfologia.estado, 'pendiente');
  assert.equal(data.analisis.pulsus.texto, 'Aproximación');
  assert.equal(data.analisis.nodus.estado, 'interpretacion');
});

test('Una ficha parcial de Airtable se usa como contexto de análisis en lugar de retornar ocho casilleros', async () => {
  const calls = [];
  const { POST } = createDimaHandlers({ env: { AIRTABLE_TOKEN: 'fake', ANTHROPIC_API_KEY: 'fake' }, fetch: async (url, options) => {
    calls.push([url, options]);
    if (url.includes('docs.google.com')) throw new Error('outage');
    if (url.includes('api.airtable.com')) return Response.json({ records: [{ fields: { Forma: 'Entrada especial', Indicia_Obscura: 'Contenido de archivo' } }] });
    const sent = JSON.parse(options.body);
    assert.equal(JSON.parse(sent.messages[0].content).archivoNoVerificado.material[0].texto, 'Contenido de archivo');
    return Response.json({ stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(generated()) }] });
  } });
  const response = await POST(await authorizedRequest({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
  assert.equal(response.status, 200);
  const data = readResult(await response.json()); assert.equal(data.origen, 'ia');
  assert.equal(data.analisis.nodus.estado, 'interpretacion'); assert.equal(data.archivo.length, 1);
  assert.equal(calls.length, 3); assert.equal(calls[1][1].method, undefined);
});

test('Generación: system separado, archivo contextual y fuentes controladas por servidor', async () => {
  let sent; const value = generated();
  for (const section of Object.values(value.analisis)) { section.estado = 'documentado'; section.fuentes = ['inventada']; }
  const { POST } = createDimaHandlers({ env: { ANTHROPIC_API_KEY: 'fake' }, fetch: async (url, options) => {
    if (url.includes('docs.google.com')) return csv();
    assert.equal(url, 'https://api.anthropic.com/v1/messages'); sent = JSON.parse(options.body);
    const output = JSON.stringify(value); const middle = Math.floor(output.length / 2);
    return Response.json({ stop_reason: 'end_turn', content: [{ type: 'text', text: output.slice(0, middle) }, { type: 'text', text: output.slice(middle) }] });
  } });
  const response = await POST(await authorizedRequest({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
  assert.equal(response.status, 200); assert.ok(sent.system.includes('RECORRIDO OBLIGATORIO'));
  assert.equal(sent.messages[0].role, 'user');
  assert.equal(JSON.parse(sent.messages[0].content).archivoNoVerificado.material[0].texto, 'Material antiguo sobre esta entrada');
  const result = readResult(await response.json());
  assert.equal(result.analisis.morfologia.estado, 'pendiente'); assert.equal(result.analisis.nodus.estado, 'interpretacion');
  assert.deepEqual(result.fuentes, []); assert.ok(Object.values(result.analisis).every((section) => section.fuentes.length === 0));
});

test('Generación rechaza JSON inválido, pasos ausentes y truncamiento', () => {
  assert.throws(() => parseGeneration('no json', 'end_turn', 'X'));
  const missing = generated(); delete missing.analisis.nodus;
  assert.throws(() => parseGeneration(JSON.stringify(missing), 'end_turn', 'X'));
  assert.throws(() => parseGeneration(JSON.stringify(generated()), 'max_tokens', 'X'));
  assert.equal(parseGeneration(JSON.stringify(generated()), 'end_turn', 'X').analisis.morfologia.estado, 'pendiente');
});

test('Validador rechaza enlaces inseguros y referencias inexistentes', () => {
  const invalid = getReviewedAnalysis('Embole'); invalid.fuentes[0].url = 'javascript:alert(1)';
  assert.throws(() => readResult(invalid));
  const missing = getReviewedAnalysis('Embole'); missing.fuentes = [];
  assert.throws(() => readResult(missing));
});

test('Sin clave: no hay generador antiguo ni respuesta con casilleros vacíos', async () => {
  const calls = [];
  const { POST } = createDimaHandlers({ env: {}, fetch: async (url) => { calls.push(url); return csv(); } });
  const response = await POST(await authorizedRequest({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
  assert.equal(response.status, 503); const data = await response.json(); assert.ok(data.error); assert.equal(data.analisis, undefined);
  assert.ok(calls.every((url) => url.includes('docs.google.com')));
});

test('Los errores del proveedor devuelven una explicación controlada sin detalles privados', async () => {
  for (const providerResponse of [new Response('secret-provider-detail', { status: 401 }), Response.json({ stop_reason: 'max_tokens', content: [{ type: 'text', text: JSON.stringify(generated()) }] })]) {
    const { POST } = createDimaHandlers({ env: { ANTHROPIC_API_KEY: 'fake' }, fetch: async (url) => url.includes('docs.google.com') ? csv() : providerResponse });
    const response = await POST(await authorizedRequest({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
    assert.equal(response.status, 502); assert.ok(!(await response.text()).includes('secret-provider-detail'));
  }
});

test('Entradas inválidas se rechazan antes de acceder a servicios', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const body of [null, [], {}, { palabra: 'Normal' }, { palabra: ' ', nivel: 'free' }, { palabra: 'A'.repeat(101), nivel: 'free' }, { palabra: 'Normal', nivel: 'invalido' }, { palabra: 'Normal', nivel: 'free', contexto: 42 }]) assert.equal((await POST(request(body))).status, 400);
  assert.equal((await POST(await authorizedRequest({ palabra: 'Fuera', nivel: 'libro' }))).status, 404);
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{broken' }))).status, 400);
});

test('La gratuita tiene todos los apartados INSIDE, movimientos e intervención, sin exigir acceso', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const palabra of REVIEWED_WORDS) {
    const result = await (await POST(request({ palabra, nivel: 'free' }))).json();
    assert.ok(result.inside.apertura.endsWith('?'));
    assert.equal(result.inside.morfologia.movimientos.length, 3);
    assert.ok(result.inside.lectura.length >= 2);
    assert.equal(result.inside.dictum.length, 2);
    for (const field of ['raiz','fraseTransmutada','insight','activacion','cierre']) assert.ok(result.inside[field]);
  }
});

test('Devoción conserva la referencia editorial de la autora', () => {
  const inside = getReviewedAnalysis('Devoción').inside;
  assert.equal(inside.variantes, 'Devoto · Devota');
  assert.equal(inside.apertura, '¿A qué te entregás con tanta dedicación… y qué lugar ocupás vos en esa entrega?');
  assert.deepEqual(inside.morfologia.movimientos.map((m) => m.nombre), ['Orientación','Dedicación','Discernimiento']);
  assert.equal(inside.dictum[1], 'que mi presencia sostenga mi elección.');
  assert.equal(inside.activacion, 'Elegí algo que merezca tu dedicación hoy. Nombrá un acto concreto para cuidarlo y un límite que te permita participar sin abandonarte.');
});

test('Libro y Plus requieren permiso del servidor incluso si la palabra está preparada', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const nivel of ['libro','plus','vip','metalquimico']) {
    const response = await POST(request({ palabra: 'Embole', nivel }));
    assert.equal(response.status, 401); assert.equal((await response.json()).analisis, undefined);
  }
});

test('Las claves distintas abren solo su alcance y se guardan en una cookie HttpOnly', async () => {
  const handlers = createDimaAccessHandlers(ACCESS_ENV);
  for (const [codigo, scope] of [['test book','libro'],['test-plus','plus']]) {
    const response = await handlers.POST(new Request('https://example.test/api/dima/access', { method: 'POST', body: JSON.stringify({ codigo }) }));
    assert.equal(response.status, 200); assert.equal((await response.json()).acceso, scope);
    const cookie = response.headers.get('set-cookie');
    assert.ok(cookie.includes('HttpOnly')); assert.ok(cookie.includes('Secure')); assert.ok(cookie.includes('SameSite=Strict'));
    const req = new Request('https://example.test/api/dima', { headers: { cookie: cookie.split(';')[0] } });
    assert.equal(readDimaAccess(req, ACCESS_ENV), scope);
    assert.ok(!cookie.includes(codigo)); assert.ok(!cookie.includes(ACCESS_ENV.DIMA_BOOK_CODE_HASH));
  }
});

test('Una clave de libro no habilita la consulta libre; Plus no suplanta la clave del libro', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  const book = await authorizedRequest({ palabra: 'Embole', nivel: 'libro' });
  const plusBody = new Request(book.url, { method: 'POST', headers: book.headers, body: JSON.stringify({ palabra: 'Embole', nivel: 'plus' }) });
  assert.equal((await POST(plusBody)).status, 401);
  const plus = await authorizedRequest({ palabra: 'Embole', nivel: 'plus' });
  const bookBody = new Request(plus.url, { method: 'POST', headers: plus.headers, body: JSON.stringify({ palabra: 'Embole', nivel: 'libro' }) });
  assert.equal((await POST(bookBody)).status, 401);
});

test('Se rechazan sesiones alteradas, vencidas y previas a un cambio de clave', async () => {
  const now = Date.now(); const handlers = createDimaAccessHandlers(ACCESS_ENV, () => now);
  const login = await handlers.POST(new Request('http://localhost/api/dima/access', { method: 'POST', body: JSON.stringify({ codigo: 'TEST PLUS' }) }));
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const req = new Request('http://localhost/api/dima', { headers: { cookie } });
  assert.equal(readDimaAccess(req, ACCESS_ENV, now), 'plus');
  assert.equal(readDimaAccess(req, ACCESS_ENV, now + 8 * 24 * 3600 * 1000), null);
  assert.equal(readDimaAccess(req, { ...ACCESS_ENV, DIMA_PLUS_CODE_HASH: hashCode('NEW CODE') }, now), null);
  assert.equal(readDimaAccess(new Request(req.url, { headers: { cookie: cookie + 'a' } }), ACCESS_ENV, now), null);
});

test('Salir revoca la cookie del dispositivo y no envía la clave en URLs', async () => {
  const response = await createDimaAccessHandlers(ACCESS_ENV).DELETE(new Request('http://localhost/api/dima/access', { method: 'DELETE' }));
  assert.equal(response.status, 200); assert.ok(response.headers.get('set-cookie').includes('Max-Age=0'));
  assert.equal((await response.json()).acceso, null);
});

test('No hay acceso por clave inválida, origen ajeno o secreto ausente', async () => {
  const handlers = createDimaAccessHandlers(ACCESS_ENV);
  const invalid = await handlers.POST(new Request('http://localhost/api/dima/access', { method: 'POST', body: JSON.stringify({ codigo: 'INVALIDA' }) }));
  assert.equal(invalid.status, 401); assert.equal(invalid.headers.get('set-cookie'), null);
  const cross = await handlers.POST(new Request('https://example.test/api/dima/access', { method: 'POST', headers: { origin: 'https://other.test' }, body: JSON.stringify({ codigo: 'TEST PLUS' }) }));
  assert.equal(cross.status, 403);
  assert.equal((await createDimaAccessHandlers({}).POST(new Request('http://localhost/api/dima/access', { method: 'POST', body: '{}' }))).status, 503);
});

test('Los intentos repetidos se limitan en esta instancia', async () => {
  const handlers = createDimaAccessHandlers(ACCESS_ENV);
  for (let i=0;i<8;i++) await handlers.POST(new Request('http://localhost/api/dima/access', { method: 'POST', headers: { 'x-vercel-forwarded-for':'test-limit' }, body: JSON.stringify({ codigo: 'INCORRECTA' }) }));
  const response = await handlers.POST(new Request('http://localhost/api/dima/access', { method: 'POST', headers: { 'x-vercel-forwarded-for':'test-limit' }, body: JSON.stringify({ codigo: 'TEST PLUS' }) }));
  assert.equal(response.status, 429);
});

test('El catálogo del libro está protegido y la consulta libre informa su conexión real', async () => {
  const handlers = createDimaHandlers({ fetch: noFetch, env: {} });
  assert.equal((await handlers.GET(new Request('http://localhost/api/dima?nivel=libro'))).status, 401);
  const req = await authorizedRequest({ palabra: 'Embole', nivel: 'libro' });
  const data = await (await handlers.GET(new Request('http://localhost/api/dima?nivel=libro', { headers: req.headers }))).json();
  assert.ok(data.palabras.includes('Embole')); assert.ok(data.aviso);
  const plus = await authorizedRequest({ palabra: 'Embole', nivel: 'plus' });
  const status = await (await createDimaAccessHandlers(ACCESS_ENV).GET(new Request('http://localhost/api/dima/access', { headers: plus.headers }))).json();
  assert.equal(status.acceso,'plus'); assert.equal(status.consultaLibreDisponible,false);
});
