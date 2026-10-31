import test from 'node:test';
import assert from 'node:assert/strict';
import { DIMA_STEPS, readResult } from '../lib/dima/schema.ts';
import { adaptRow, parseCsv } from '../lib/dima/adapter.ts';
import { getReviewedAnalysis } from '../lib/dima/corpus.ts';
import { parseGeneration } from '../lib/dima/prompt.ts';
import { createDimaHandlers } from '../lib/dima/service.ts';

const request = (body) => new Request('http://localhost/api/dima', { method: 'POST', body: JSON.stringify(body) });
const csv = (text = 'Forma,Indicia Obscura\nNormal,Una lectura anterior\n') => new Response(text);
const noFetch = async () => { throw new Error('This path must not access the network'); };
const generated = () => ({ analisis: Object.fromEntries(DIMA_STEPS.map(({ id }) => [id, { texto: `Propuesta para ${id}`, estado: 'interpretacion', fuentes: [] }])) });

for (const word of ['Patraña', 'Embole']) {
  test(`${word}: las tres modalidades devuelven la misma ficha con ocho pasos y fuentes`, async () => {
    const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
    const results = [];
    for (const nivel of ['free', 'libro', 'metalquimico']) {
      const response = await POST(request({ palabra: word.toUpperCase(), nivel }));
      assert.equal(response.status, 200);
      const data = readResult(await response.json());
      assert.equal(data.estado, 'completo');
      assert.deepEqual(Object.keys(data.analisis), DIMA_STEPS.map(({ id }) => id));
      assert.equal(data.analisis.morfologia.estado, 'documentado');
      assert.ok(data.fuentes.length);
      results.push(data);
    }
    assert.deepEqual(results[0], results[1]); assert.deepEqual(results[1], results[2]);
  });
}

test('CSV: preserva comillas, saltos, acentos y columnas duplicadas; ignora invisibles', () => {
  const rows = parseCsv('\uFEFFForma,Ordo MPAe,Ordo MPAe,Indicia Obscura\r\n"Patraña","Uno","Dos","Una, línea\ncon ""comillas"""\r\nÉxito,,,\u200b\n');
  assert.equal(rows[0].Forma, 'Patraña');
  assert.equal(rows[0]['Ordo MPAe'], 'Uno\n\nDos');
  assert.equal(rows[0]['Indicia Obscura'], 'Una, línea\ncon "comillas"');
  assert.equal(rows[1]['Indicia Obscura'], undefined);
  assert.throws(() => parseCsv('Forma,Texto\nNormal,"sin cierre'));
  assert.throws(() => parseCsv('Otra,Texto\nNormal,dato'));
});

test('Los campos vibracionales y el contador Pulsus nunca se renombran como análisis nuevo', () => {
  const data = adaptRow({ Forma: 'Normal', Gradus_Vibrationi: 'Alta', Natura_Vibrationis: 'Disruptiva', Pulsus: 312, Radix_Aucta: 'origen sin fuente', Cierre: 'ritual' }, 'Normal', 'base');
  assert.equal(data.estado, 'parcial');
  for (const { id } of DIMA_STEPS) assert.equal(data.analisis[id].estado, 'pendiente');
  assert.ok(data.archivo.some(({ etiqueta, texto }) => etiqueta === 'Gradus Vibrationi' && texto === 'Alta'));
  assert.ok(data.archivo.some(({ etiqueta }) => etiqueta === 'Radix Aucta'));
  assert.ok(!data.analisis.sintesis.texto.includes('ritual'));
});

test('Una ficha vacía no se presenta como una ficha completa', () => {
  const data = adaptRow({ Forma: 'Éxito', 'Indicia Obscura': '\u200b', Gradus_Vibrationi: '—' }, 'Éxito', 'planilla');
  assert.equal(data.estado, 'parcial'); assert.deepEqual(data.archivo, []);
});

test('Los campos nuevos se respetan; el origen aún requiere verificación editorial', () => {
  const data = adaptRow({ Forma: 'Normal', Morfologia_Etimologia: 'Origen declarado', Pulsus_DIMA: 'Aproximación', Nodus_DIMA: 'Relación propuesta' }, 'Normal', 'base');
  assert.equal(data.analisis.morfologia.estado, 'pendiente');
  assert.equal(data.analisis.pulsus.texto, 'Aproximación');
  assert.equal(data.analisis.nodus.estado, 'interpretacion');
});

test('Consulta pública: lectura de planilla sin generación aunque exista una clave', async () => {
  const calls = [];
  const { POST } = createDimaHandlers({ fetch: async (url) => { calls.push(url); return csv(); }, env: { ANTHROPIC_API_KEY: 'fake' } });
  const response = await POST(request({ palabra: 'Normal', nivel: 'free' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).origen, 'planilla');
  assert.equal(calls.length, 1); assert.ok(calls[0].startsWith('https://docs.google.com/'));
});

test('Catálogo: respaldo de referencia durante caída de Sheets', async () => {
  const { GET } = createDimaHandlers({ fetch: noFetch, env: {} });
  const response = await GET(); const data = await response.json();
  assert.equal(response.status, 200); assert.deepEqual(data.palabras, ['Patraña', 'Embole']); assert.ok(data.aviso);
});

test('Catálogo: sin duplicados por acentos o mayúsculas', async () => {
  const { GET } = createDimaHandlers({ fetch: async () => csv('Forma\nPatraña\nPATRANA\nNormal\n'), env: {} });
  assert.equal((await (await GET()).json()).palabras.length, 3);
});

test('Airtable sigue disponible si Sheets falla; sin escrituras ni servicio antiguo', async () => {
  const calls = [];
  const { POST } = createDimaHandlers({ env: { AIRTABLE_TOKEN: 'fake' }, fetch: async (url, options) => {
    calls.push([url, options]);
    if (url.includes('docs.google.com')) throw new Error('outage');
    return Response.json({ records: [{ fields: { Forma: 'Normal', Indicia_Obscura: 'archivo' } }] });
  } });
  const response = await POST(request({ palabra: 'normal', nivel: 'metalquimico' }));
  assert.equal(response.status, 200); assert.equal((await response.json()).origen, 'base');
  assert.equal(calls.length, 2); assert.ok(calls.every(([, options]) => !options.method));
});

test('Generación: usa system separado y archivo contextual; no permite certificar fuentes inventadas', async () => {
  let sent;
  const value = generated();
  for (const section of Object.values(value.analisis)) { section.estado = 'documentado'; section.fuentes = ['inventada']; }
  const { POST } = createDimaHandlers({ env: { ANTHROPIC_API_KEY: 'fake' }, fetch: async (url, options) => {
    if (url.includes('docs.google.com')) return csv();
    assert.equal(url, 'https://api.anthropic.com/v1/messages');
    sent = JSON.parse(options.body);
    const output = JSON.stringify(value); const middle = Math.floor(output.length / 2);
    return Response.json({ stop_reason: 'end_turn', content: [{ type: 'text', text: output.slice(0, middle) }, { type: 'text', text: output.slice(middle) }] });
  } });
  const response = await POST(request({ palabra: 'Normal', nivel: 'metalquimico' }));
  assert.equal(response.status, 200); assert.ok(sent.system.includes('RECORRIDO OBLIGATORIO'));
  assert.equal(sent.messages[0].role, 'user');
  assert.equal(JSON.parse(sent.messages[0].content).archivoNoVerificado.material[0].texto, 'Una lectura anterior');
  const result = readResult(await response.json());
  assert.equal(result.estado, 'parcial'); assert.equal(result.analisis.morfologia.estado, 'pendiente');
  assert.equal(result.analisis.nodus.estado, 'interpretacion'); assert.deepEqual(result.fuentes, []);
  assert.ok(Object.values(result.analisis).every((section) => section.fuentes.length === 0));
});

test('Generación: rechaza JSON inválido, pasos ausentes y respuestas truncadas', () => {
  assert.throws(() => parseGeneration('no json', 'end_turn', 'X'));
  const missing = generated(); delete missing.analisis.nodus;
  assert.throws(() => parseGeneration(JSON.stringify(missing), 'end_turn', 'X'));
  assert.throws(() => parseGeneration(JSON.stringify(generated()), 'max_tokens', 'X'));
  const valid = parseGeneration(JSON.stringify(generated()), 'end_turn', 'X');
  assert.equal(valid.analisis.morfologia.estado, 'pendiente');
  assert.ok(valid.analisis.sintesis.texto);
});

test('Validador: rechaza enlaces inseguros y fuentes inexistentes', () => {
  const invalid = getReviewedAnalysis('Embole'); invalid.fuentes[0].url = 'javascript:alert(1)';
  assert.throws(() => readResult(invalid));
  const missing = getReviewedAnalysis('Embole'); missing.fuentes = [];
  assert.throws(() => readResult(missing));
});

test('Sin clave no se invoca el generador antiguo; con archivo se devuelve una ficha parcial', async () => {
  const calls = [];
  const { POST } = createDimaHandlers({ env: {}, fetch: async (url) => { calls.push(url); return csv(); } });
  const unavailable = await POST(request({ palabra: 'Inédita', nivel: 'metalquimico' }));
  assert.equal(unavailable.status, 503);
  const archived = await POST(request({ palabra: 'Normal', nivel: 'metalquimico' }));
  assert.equal(archived.status, 200); assert.equal((await archived.json()).estado, 'parcial');
  assert.ok(calls.every((url) => url.includes('docs.google.com')));
});

test('Errores del proveedor y truncamiento devuelven un error controlado', async () => {
  for (const providerResponse of [new Response('secret-provider-detail', { status: 401 }), Response.json({ stop_reason: 'max_tokens', content: [{ type: 'text', text: JSON.stringify(generated()) }] })]) {
    const { POST } = createDimaHandlers({ env: { ANTHROPIC_API_KEY: 'fake' }, fetch: async (url) => url.includes('docs.google.com') ? csv() : providerResponse });
    const response = await POST(request({ palabra: 'Inédita', nivel: 'metalquimico' }));
    assert.equal(response.status, 502); assert.ok(!(await response.text()).includes('secret-provider-detail'));
  }
});

test('Entradas inválidas se rechazan antes de acceder a servicios', async () => {
  const { POST } = createDimaHandlers({ fetch: noFetch, env: {} });
  for (const body of [null, [], {}, { palabra: 'Normal' }, { palabra: ' ', nivel: 'free' }, { palabra: 'A'.repeat(101), nivel: 'free' }, { palabra: 'Normal', nivel: 'invalido' }, { palabra: 'Normal', nivel: 'free', contexto: 42 }]) {
    assert.equal((await POST(request(body))).status, 400);
  }
  assert.equal((await POST(request({ palabra: 'Fuera', nivel: 'libro' }))).status, 404);
  assert.equal((await POST(new Request('http://localhost', { method: 'POST', body: '{broken' }))).status, 400);
});
