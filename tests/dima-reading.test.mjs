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

// Render the real component with a style stub; this verifies content/structure, not visual CSS.
const require = createRequire(import.meta.url);
const source = await fs.readFile(new URL('../app/dima/InsideReading.tsx',import.meta.url),'utf8');
let compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText;
compiled = compiled.replaceAll('"react/jsx-runtime"', JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href));
compiled = compiled.replaceAll('"@/lib/dima/schema"', JSON.stringify(new URL('../lib/dima/schema.ts',import.meta.url).href));
compiled = compiled.replace(/import styles from "\.\/page\.module\.css";/, 'const styles = new Proxy({}, {get: (_, key) => String(key)});');
const directory = await fs.mkdtemp(path.join(os.tmpdir(),'dima-reading-'));
const modulePath = path.join(directory,'component.mjs'); await fs.writeFile(modulePath,compiled);
const { default: Reading } = await import(pathToFileURL(modulePath).href);
const render = (result,ampliado=false) => renderToStaticMarkup(React.createElement(Reading,{result,ampliado}));

const headings = ['Palabra raíz','Morfología','Morfología mágica','¿Qué nos dice DIMA?','Frase transmutada','Dictum Mutare','MPI Insight','Activación'];

test('Devoción se presenta como la consulta editorial de referencia y no como ocho casilleros', () => {
 const html=render(getReviewedAnalysis('Devoción'));
 let previous=-1;
 for(const title of headings){const index=html.indexOf(`<h3>${title}</h3>`);assert.ok(index>previous,title);previous=index;}
 for(const text of ['Devoto · Devota','¿A qué te entregás con tanta dedicación','Orientación','Dedicación','Discernimiento','Que mi entrega tenga dirección,','que mi presencia sostenga mi elección.','El lenguaje revela el hechizo'])assert.ok(html.includes(text),text);
 assert.ok(html.includes('<table>'));assert.ok(html.includes('<th scope="col">Movimiento</th>'));
 assert.ok(!html.includes('Ver el análisis ampliado')); assert.ok(!html.includes('PASO 1 DE 8')); assert.ok(!html.includes('Nodus · relación y agencia'));
});

test('Las 44 fichas gratuitas renderizan lectura, morfología mágica, Dictum, insight y activación', () => {
 for(const word of REVIEWED_WORDS){
  const html=render(getReviewedAnalysis(word));
  assert.ok(getReviewedAnalysis(word).inside.linguistica,word);
  for(const title of headings)assert.ok(html.includes(`<h3>${title}</h3>`),`${word}: ${title}`);
  assert.ok(!html.includes('Pendiente de análisis y revisión'),word);
 }
});

test('El análisis técnico ampliado aparece solo cuando se solicita esa presentación', () => {
 const result=getReviewedAnalysis('Devoción');
 assert.ok(!render(result).includes('Ver el análisis ampliado'));
 const html=render(result,true);assert.ok(html.includes('Ver el análisis ampliado'));assert.ok(html.includes('Nodus · relación y agencia'));
});

await fs.rm(directory, { recursive: true, force: true });
