"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { DIMA_STEPS, normalize, readResult, type DimaResult } from "@/lib/dima/schema";
import styles from "./page.module.css";

const INITIAL_WORDS = ["Normal", "Miedo", "Patraña", "Embole"];

function TextFlow({ text }: { text: string }) {
  return <div className={styles.textFlow}>{text.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>;
}

export default function DimaPage() {
  const [word, setWord] = useState("");
  const [words, setWords] = useState(INITIAL_WORDS);
  const [result, setResult] = useState<DimaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const reading = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams(window.location.search).get("palabra");
    if (query) setWord(query.slice(0, 100));
    fetch("/api/dima", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!controller.signal.aborted && Array.isArray(data.palabras) && data.palabras.length && data.palabras.every((item: unknown) => typeof item === "string")) setWords(data.palabras);
    }).catch(() => {
      if (!controller.signal.aborted) setError("No pudimos cargar la selección. Intentá nuevamente.");
    });
    return () => { controller.abort(); activeRequest.current?.abort(); };
  }, []);

  function clearReading() {
    requestId.current += 1;
    activeRequest.current?.abort();
    setResult(null); setError(""); setLoading(false);
  }

  function chooseWord(value: string) { clearReading(); setWord(value); }

  async function consult(value: string, event?: FormEvent) {
    event?.preventDefault();
    clearReading();
    const term = value.trim();
    if (!term) return;
    const id = requestId.current;
    const controller = new AbortController();
    activeRequest.current = controller;
    setWord(term); setLoading(true);
    try {
      const nivel = words.some((item) => normalize(item) === normalize(term)) ? "free" : "metalquimico";
      const response = await fetch("/api/dima", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ palabra: term, nivel }), signal: controller.signal });
      const data = await response.json();
      if (controller.signal.aborted || id !== requestId.current) return;
      if (!response.ok || data.error) throw new Error(data.error || "No pudimos abrir esta palabra.");
      const next = readResult(data);
      if (normalize(next.palabra) !== normalize(term)) throw new Error("La ficha recibida corresponde a otra palabra.");
      setResult(next);
    } catch (cause) {
      if (!controller.signal.aborted && id === requestId.current) setError(cause instanceof Error ? cause.message : "No pudimos completar la consulta.");
    } finally {
      if (!controller.signal.aborted && id === requestId.current) setLoading(false);
    }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href="/mpa">← Magia para Atrevidos</Link>
      <span>ARCHIVO VIVO DEL LENGUAJE</span>
    </header>
    <section className={styles.intro} aria-labelledby="dima-title">
      <div className={styles.brand}>
        <img src="/dima-machine-cutout-v1.png" alt="" width={96} height={114} />
        <div><p className={styles.eyebrow}>DISPOSITIVO INTELIGENTE METALQUÍMICO ACTIVO</p><h1 id="dima-title">DIMA</h1></div>
      </div>
      <h2>Abrí una palabra.</h2>
      <p className={styles.lead}>Explorá de dónde viene, cómo opera y qué otra relación puede abrir.</p>
      <form className={styles.form} onSubmit={(event) => consult(word, event)}>
        <label htmlFor="dima-word">¿Qué palabra querés consultar?</label>
        <div className={styles.searchRow}>
          <input id="dima-word" list="dima-words" value={word} onChange={(event) => chooseWord(event.target.value)} placeholder="Escribí o elegí una palabra" maxLength={100} autoComplete="off" />
          <datalist id="dima-words">{words.map((item) => <option key={item} value={item} />)}</datalist>
          <button type="submit" disabled={loading || !word.trim()}>{loading ? "Consultando…" : "Consultar →"}</button>
        </div>
        <p className={styles.status} role="status">{loading ? `DIMA está consultando ${word}.` : result ? `Análisis de ${result.palabra} disponible: ocho pasos en una misma ficha.` : ""}</p>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </form>
      <div className={styles.examples}><span>Podés empezar por</span>{INITIAL_WORDS.map((item) => <button key={item} type="button" onClick={() => consult(item)}>{item}</button>)}</div>
      <details className={styles.catalog}><summary>Ver las {words.length} palabras disponibles</summary><div>{words.map((item) => <button type="button" key={item} onClick={() => consult(item)}>{item}</button>)}</div></details>
    </section>
    {result && <section className={styles.reading} ref={reading} aria-labelledby="dima-result-title">
      <div className={styles.readingHead}>
        <p className={styles.eyebrow}>LECTURA DIMA{result.origen === "ia" ? " · ASISTIDA" : ""}</p>
        <h2 id="dima-result-title">{result.palabra}</h2>
        <p>Primero, la información lingüística con su fuente. Después, una interpretación DIMA que podés recorrer y cuestionar.</p>
      </div>
      <ol className={styles.steps}>
        {DIMA_STEPS.map((step, index) => {
          const section = result.analisis[step.id];
          return <li key={step.id} aria-labelledby={`dima-step-${step.id}`}>
            <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <article>
              <div className={styles.stepHeading}><h3 id={`dima-step-${step.id}`}>{step.title}</h3>{index === 0 && <span className={styles.tag}>{section.estado === "documentado" ? "Con fuente lingüística" : "Origen no verificado"}</span>}</div>
              <TextFlow text={section.texto} />
              {index === 0 && section.fuentes.length > 0 && <p className={styles.sourceInline}>{section.fuentes.map((id) => <a key={id} href={`#dima-source-${id}`}>{result.fuentes.find((source) => source.id === id)?.titulo}</a>)}</p>}
              {index === 7 && <p className={styles.interpretationNote}>Los pasos 2–8 son una propuesta interpretativa DIMA; no afirman una etimología ni una verdad única sobre la palabra.</p>}
            </article>
          </li>;
        })}
      </ol>
      <aside className={styles.sources} aria-label="Fuentes y notas">
        <h3>Fuentes y notas</h3>
        {result.fuentes.length ? <ul>{result.fuentes.map((source) => <li key={source.id} id={`dima-source-${source.id}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a><span>Referencia consultada el {source.consulta}. Respalda el paso lingüístico en el alcance indicado.</span></li>)}</ul> : <p>Esta lectura no cuenta con una fuente lingüística revisada para el origen. Esa limitación se conserva en el primer paso.</p>}
        {result.archivo.length > 0 && <details><summary>Material de archivo utilizado</summary><p>Se conserva con sus etiquetas originales y no se toma como evidencia histórica.</p>{result.archivo.map((item, index) => <section key={index}><h4>{item.etiqueta}</h4><TextFlow text={item.texto} /></section>)}</details>}
      </aside>
      <div className={styles.readAgain}><p>¿Qué otra palabra querés mirar?</p><button type="button" onClick={() => { clearReading(); setWord(""); document.getElementById("dima-word")?.focus(); }}>Consultar otra palabra ↑</button></div>
    </section>}
    <footer className={styles.footer}><span>DIMA · Magia para Atrevidos</span><Link href="/mpa">Volver al universo MPA →</Link></footer>
  </main>;
}
