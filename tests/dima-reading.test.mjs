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

const journeySource=await fs.readFile(new URL('../app/dima/ReadingJourney.tsx',import.meta.url),'utf8');
let journeyCompiled=ts.transpileModule(journeySource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
journeyCompiled=journeyCompiled.replaceAll('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href)).replaceAll('"./InsideReading"',JSON.stringify(pathToFileURL(modulePath).href));
journeyCompiled=journeyCompiled.replace(/import shell from "\.\/shell\.module\.css";/,'const shell = new Proxy({}, {get: (_, key) => String(key)});');
const journeyPath=path.join(directory,'journey.mjs');await fs.writeFile(journeyPath,journeyCompiled);
const {default:ReadingJourney}=await import(pathToFileURL(journeyPath).href);

const pageSource = await fs.readFile(new URL('../app/dima/page.tsx',import.meta.url),'utf8');
let pageCompiled = ts.transpileModule(pageSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;
for(const [specifier,target] of [['react',pathToFileURL(require.resolve('react')).href],['react/jsx-runtime',pathToFileURL(require.resolve('react/jsx-runtime')).href],['next/link',pathToFileURL(require.resolve('next/link')).href],['@/lib/dima/schema',new URL('../lib/dima/schema.ts',import.meta.url).href],['@/app/lib/contact',new URL('../app/lib/contact.ts',import.meta.url).href],['./ReadingJourney',pathToFileURL(journeyPath).href]])pageCompiled=pageCompiled.replaceAll(JSON.stringify(specifier),JSON.stringify(target));
pageCompiled=pageCompiled.replace(/import shell from "\.\/shell\.module\.css";/,'const shell = new Proxy({}, {get: (_, key) => String(key)});');
const pagePath=path.join(directory,'page.mjs');await fs.writeFile(pagePath,pageCompiled);
const {default:DimaPage}=await import(pathToFileURL(pagePath).href);

const headings = ['Palabra raíz','Configuración de la palabra','La lectura DIMA','Activación','¿Qué está diciendo esta palabra?','Definición DIMA','Frase transmutada','Dictum Mutare','MPI Insight'];

test('La entrada recupera las tres puertas y la cámara de la página publicada',async()=>{
 const html=renderToStaticMarkup(React.createElement(DimaPage));
 for(const title of ['Configuración oculta','Análisis Metalquímico','Colecciones de obra'])assert.ok(html.includes(title),title);
 assert.ok(html.includes('class="dimaFigure"'));
 assert.ok(html.includes('/dima-machine-cutout-v1.png'));
 assert.ok(html.includes('aria-label="Puertas de DIMA"'));
 assert.ok(!html.includes('Conjuratio Dominus'));
 const css=await fs.readFile(new URL('../app/dima/shell.module.css',import.meta.url),'utf8');
 assert.ok(css.includes("url('/dima-chamber-v1.png')"));
 assert.ok(css.includes('--gold:#967b45'));
});

test('Devoción se presenta como la consulta editorial de referencia y no como ocho casilleros', () => {
 const html=render(getReviewedAnalysis('Devoción'));
 let previous=-1;
 for(const title of headings){const index=html.indexOf(`<h3>${title}</h3>`);assert.ok(index>previous,title);previous=index;}
 for(const text of ['Devoto · Devota','¿A qué te entregás con tanta dedicación','Orientación','Dedicación','Discernimiento','Que mi entrega tenga dirección,','que mi presencia sostenga mi elección.','El lenguaje revela el hechizo'])assert.ok(html.includes(text),text);
 assert.ok(html.includes('<figure'));assert.ok(html.includes('class="movementCards"'));
 assert.ok(!html.includes('Ver el origen y la formación en detalle'));
 assert.ok(!html.includes('<table>'));
 assert.ok(!html.includes('Ver el análisis ampliado')); assert.ok(!html.includes('PASO 1 DE 8')); assert.ok(!html.includes('Nodus · relación y agencia'));
});

test('Las 44 fichas integran la morfología en el diagrama con las precisiones completas disponibles', () => {
 for(const word of REVIEWED_WORDS){
  const result=getReviewedAnalysis(word);
  const html=render(result);
  const visible=html.replace(/<details\b[\s\S]*?<\/details>/g,'');
  const figure=visible.match(/<figure\b[\s\S]*?<\/figure>/)?.[0]||'';
  const escape=(text)=>renderToStaticMarkup(React.createElement(React.Fragment,null,text));
  assert.ok(result.inside.linguistica,word);
  for(const text of [result.inside.raiz,result.inside.linguistica.categoria,result.inside.linguistica.flexion,result.inside.morfologia.nota])assert.ok(visible.includes(escape(text)),`${word}: estructura esencial visible`);
  for(const text of Object.values(result.inside.linguistica))assert.ok(html.match(/<figure\b[\s\S]*?<\/figure>/)[0].includes(escape(text)),`${word}: explicación completa conservada dentro del diagrama`);
  for(const label of ['Cómo está formada','Cómo varía'])assert.ok(figure.includes(`<h4>${label}</h4>`),word);
  assert.ok(figure.includes('<b>Clase de palabra.</b>'),word);
  assert.ok(getWordMap(word),word);
  assert.ok(html.includes('<figure'),word);
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
 const brief=render(getReviewedAnalysis('Molde')).replace(/<details\b[\s\S]*?<\/details>/g,'');
 assert.ok(brief.includes('Base léxica: molde.'));
 const complete=render(getReviewedAnalysis('Molde'));
 assert.ok(complete.includes('Ver la explicación completa'));
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

test('Las 44 consultas comienzan por la anátesis, reconfiguran después y reservan la síntesis para el cierre', () => {
 for(const word of REVIEWED_WORDS){
  const result=getReviewedAnalysis(word);
  const layers=[1,2,3].map(layer=>renderToStaticMarkup(React.createElement(Reading,{result,layer,showTitle:false})));
  assert.ok(layers[0].includes('Configuración de la palabra'),word);
  assert.ok(layers[0].includes('Cómo está formada'),word);
  assert.ok(layers[0].includes('Cómo varía'),word);
  assert.ok(!layers[0].includes('<h3>Síntesis DIMA</h3>'),word);
  assert.ok(!layers[0].includes('¿Qué está diciendo esta palabra?'),word);
  assert.ok(layers[1].includes('Relación y agencia'),word);
  assert.ok(layers[1].includes('Activación'),word);
  assert.ok(!layers[1].includes('<h3>Definición DIMA</h3>'),word);
  assert.ok(layers[2].includes('<h3>Síntesis DIMA</h3>'),word);
  assert.ok(layers[2].includes('Frase transmutada'),word);
  assert.ok(layers[2].includes('¿Qué está diciendo esta palabra?'),word);
  const full=layers.join('');
  const escape=(text)=>renderToStaticMarkup(React.createElement(React.Fragment,null,text));
  for(const text of [result.inside.raiz,...Object.values(result.inside.linguistica),...result.inside.lectura,result.inside.activacion])assert.ok(full.includes(escape(text)),word);
 }
});

test('Al avanzar se agregan paneles: la primera lectura y los desplegables se conservan en el recorrido',()=>{
 const result=getReviewedAnalysis('Devoción');
 const renderJourney=(depth)=>renderToStaticMarkup(React.createElement(ReadingJourney,{result,depth,ampliado:false,onAdvance:()=>{},onRestart:()=>{}}));
 for(const depth of [1,2,3]){
  const html=renderJourney(depth);
  assert.ok(html.includes('id="dima-layer-1"'));
  assert.ok(html.includes('Configuración de la palabra'));
  assert.equal(html.includes('id="dima-layer-2"'),depth>=2);
  assert.equal(html.includes('id="dima-layer-3"'),depth>=3);
  assert.ok(html.includes('Cómo está construida'));
  assert.equal(html.includes('Cómo se relaciona y qué puede cambiar'),depth>=2);
  assert.equal(html.includes('<h3>Síntesis DIMA</h3>'),depth>=3);
  assert.equal(html.includes('¿Qué está diciendo esta palabra?'),depth>=3);
  assert.equal(html.includes('¿Por qué DIMA llega a esta lectura?'),depth>=3);
  assert.equal(html.includes('Escuchar el susurro de DIMA'),depth>=3);
  assert.ok(!html.includes('open=""')); // Native details remain optional, closed initially.
 }
 const full=renderJourney(3);
 assert.ok(full.indexOf('id="dima-layer-1"')<full.indexOf('id="dima-layer-2"'));
 assert.ok(full.indexOf('id="dima-layer-2"')<full.indexOf('id="dima-layer-3"'));
 assert.equal((full.match(/aria-expanded="true"/g)||[]).length,3);
});

await fs.rm(directory, { recursive: true, force: true });
