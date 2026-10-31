import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMA_STEPS, readResult } from '../lib/dima/schema.ts';
import { adaptRow, parseCsv } from '../lib/dima/adapter.ts';
import { REVIEWED_WORDS, getReviewedAnalysis } from '../lib/dima/corpus.ts';
import { parseGeneration } from '../lib/dima/prompt.ts';
import { createDimaHandlers } from '../lib/dima/service.ts';

const request = (body) => new Request('http://localhost/api/dima', { method: 'POST', body: JSON.stringify(body) });
const noFetch = async () => { throw new Error('This path must not access the network'); };
const csv = () => new Response('Forma,Indicia Obscura\nEntrada especial,Material antiguo sobre esta entrada\n');
const generated = () => ({ analisis: Object.fromEntries(DIMA_STEPS.map(({ id }) => [id, { texto: `Propuesta específica para ${id}`, estado: 'interpretacion', fuentes: [] }])) });

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
  assert.equal(data.palabras.length, 43);
  assert.equal(new Set(data.palabras).size, 43);
  assert.ok(data.palabras.every((word) => getReviewedAnalysis(word)?.estado === 'completo'));
  for (const word of ['Normal', 'Miedo', 'Éxito', 'Trabajo', 'Right', 'Infans']) assert.ok(data.palabras.includes(word));
  assert.ok(!data.palabras.includes('Rigth'));
});

test('Patraña y Embole mantienen la misma lectura en las tres modalidades', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const palabra of ['Patraña', 'Embole']) {
    const results = [];
    for (const nivel of ['free', 'libro', 'metalquimico']) results.push(await (await POST(request({ palabra, nivel }))).json());
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
  const response = await POST(request({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
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
  const response = await POST(request({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
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
  const response = await POST(request({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
  assert.equal(response.status, 503); const data = await response.json(); assert.ok(data.error); assert.equal(data.analisis, undefined);
  assert.ok(calls.every((url) => url.includes('docs.google.com')));
});

test('Los errores del proveedor devuelven una explicación controlada sin detalles privados', async () => {
  for (const providerResponse of [new Response('secret-provider-detail', { status: 401 }), Response.json({ stop_reason: 'max_tokens', content: [{ type: 'text', text: JSON.stringify(generated()) }] })]) {
    const { POST } = createDimaHandlers({ env: { ANTHROPIC_API_KEY: 'fake' }, fetch: async (url) => url.includes('docs.google.com') ? csv() : providerResponse });
    const response = await POST(request({ palabra: 'Entrada especial', nivel: 'metalquimico' }));
    assert.equal(response.status, 502); assert.ok(!(await response.text()).includes('secret-provider-detail'));
  }
});

test('Entradas inválidas se rechazan antes de acceder a servicios', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const body of [null, [], {}, { palabra: 'Normal' }, { palabra: ' ', nivel: 'free' }, { palabra: 'A'.repeat(101), nivel: 'free' }, { palabra: 'Normal', nivel: 'invalido' }, { palabra: 'Normal', nivel: 'free', contexto: 42 }]) assert.equal((await POST(request(body))).status, 400);
  assert.equal((await POST(request({ palabra: 'Fuera', nivel: 'libro' }))).status, 404);
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{broken' }))).status, 400);
});
