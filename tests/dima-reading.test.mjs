import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getReviewedAnalysis, REVIEWED_WORDS } from '../lib/dima/corpus.ts';
import { getWordMap } from '../lib/dima/word-map.ts';

// Render the real component with a style stub; this verifies content/structure, not visual CSS.
const require = createRequire(import.meta.url);
const source = await fs.readFile(new URL('../app/dima/InsideReading.tsx',import.meta.url),'utf8');
let compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText;
compiled = compiled.replaceAll('"react/jsx-runtime"', JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href));
compiled = compiled.replaceAll('"@/lib/dima/schema"', JSON.stringify(new URL('../lib/dima/schema.ts',import.meta.url).href));
compiled = compiled.replaceAll('"@/lib/dima/word-map"', JSON.stringify(new URL('../lib/dima/word-map.ts',import.meta.url).href));
compiled = compiled.replace(/import styles from "\.\/page\.module\.css";/, 'const styles = new Proxy({}, {get: (_, key) => String(key)});');
const directory = await fs.mkdtemp(path.join(os.tmpdir(),'dima-reading-'));
const modulePath = path.join(directory,'component.mjs'); await fs.writeFile(modulePath,compiled);
const { default: Reading } = await import(pathToFileURL(modulePath).href);
const render = (result,ampliado=false) => renderToStaticMarkup(React.createElement(Reading,{result,ampliado}));

const headings = ['La palabra por dentro','La lectura DIMA','¿Qué nos dice DIMA?','Frase transmutada','Dictum Mutare','MPI Insight','Activación'];

test('Devoción se presenta como la consulta editorial de referencia y no como ocho casilleros', () => {
 const html=render(getReviewedAnalysis('Devoción'));
 let previous=-1;
 for(const title of headings){const index=html.indexOf(`<h3>${title}</h3>`);assert.ok(index>previous,title);previous=index;}
 for(const text of ['Devoto · Devota','¿A qué te entregás con tanta dedicación','Orientación','Dedicación','Discernimiento','Que mi entrega tenga dirección,','que mi presencia sostenga mi elección.','El lenguaje revela el hechizo'])assert.ok(html.includes(text),text);
 assert.ok(html.includes('<figure'));assert.ok(html.includes('class="movementCards"'));
 assert.ok(html.includes('<details class="wordDetails"><summary>Ver el origen y la formación en detalle</summary>'));
 assert.ok(!html.includes('<table>'));
 assert.ok(!html.includes('Ver el análisis ampliado')); assert.ok(!html.includes('PASO 1 DE 8')); assert.ok(!html.includes('Nodus · relación y agencia'));
});

test('Las 44 fichas muestran el mapa de la palabra, las tarjetas DIMA y los detalles lingüísticos', () => {
 for(const word of REVIEWED_WORDS){
  const html=render(getReviewedAnalysis(word));
  assert.ok(getReviewedAnalysis(word).inside.linguistica,word);
  assert.ok(getWordMap(word),word);
  assert.ok(html.includes('<figure'),word);
  assert.ok(html.includes('<h4>Morfología</h4>'),word);
  assert.equal((html.match(/class="movementCards"/g)||[]).length,1,word);
  for(const title of headings)assert.ok(html.includes(`<h3>${title}</h3>`),`${word}: ${title}`);
  assert.ok(!html.includes('Pendiente de análisis y revisión'),word);
 }
});

test('Los diagramas distinguen relaciones de componentes sin inventar divisiones', () => {
 const devotion=getWordMap('Devoción');
 assert.equal(devotion.origen.forma,'devotio');
 assert.equal(devotion.piezas,undefined);
 assert.deepEqual(devotion.ramas[1].formas,['devoto','devota']);
 assert.equal(getWordMap('Molde').piezas,undefined);
 assert.deepEqual(getWordMap('Productividad').piezas.map(piece=>piece.forma),['productiv-','-idad']);
 assert.equal(getWordMap('Una expresión nueva'),undefined);
 const result=getReviewedAnalysis('Devoción');result.palabra='Una expresión nueva';
 const html=render(result);
 assert.ok(html.includes('Cómo está formada'));
 assert.ok(!html.includes('class="wordPieces"'));
});

test('El análisis técnico ampliado aparece solo cuando se solicita esa presentación', () => {
 const result=getReviewedAnalysis('Devoción');
 assert.ok(!render(result).includes('Ver el análisis ampliado'));
 const html=render(result,true);assert.ok(html.includes('Ver el análisis ampliado'));assert.ok(html.includes('Nodus · relación y agencia'));
});

await fs.rm(directory, { recursive: true, force: true });
