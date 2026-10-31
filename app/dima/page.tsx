"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { normalize, readResult, type DimaResult } from "@/lib/dima/schema";
import ReadingJourney, { type ReadingDepth } from "./ReadingJourney";
import shell from "./shell.module.css";
import { PERSONAL_EMAIL } from "@/app/lib/contact";

type Mode = "free" | "libro" | "plus";
type Access = "libro" | "plus" | null;
const INITIAL_WORDS = ["Devoción", "Normal", "Miedo", "Embole"];
export default function DimaPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [depth, setDepth] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<Mode>("free");
  const [access, setAccess] = useState<Access>(null);
  const [providerReady, setProviderReady] = useState(false);
  const [word, setWord] = useState("");
  const [publicWords, setPublicWords] = useState<string[]>([]);
  const [bookWords, setBookWords] = useState<string[]>([]);
  const [bookNotice, setBookNotice] = useState("");
  const [result, setResult] = useState<DimaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [code, setCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [accessError, setAccessError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const pendingLayer = useRef<ReadingDepth | null>(null);
  const words = mode === "libro" ? bookWords : publicWords;
  const locked = mode !== "free" && access !== mode;

  function focusLayer(layer: ReadingDepth) {
    const panel = document.getElementById(`dima-layer-${layer}`);
    panel?.focus({ preventScroll: true });
    panel?.scrollIntoView({ block: "start", behavior: "auto" });
  }
  useEffect(() => {
    if (pendingLayer.current) { focusLayer(pendingLayer.current); pendingLayer.current = null; }
  }, [depth]);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams(window.location.search).get("palabra");
    if (query) setWord(query.slice(0, 100));
    fetch("/api/dima", { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.palabras) || !data.palabras.every((item: unknown) => typeof item === "string")) throw new Error();
      if (!controller.signal.aborted) setPublicWords(data.palabras);
    }).catch(() => { if (!controller.signal.aborted) setError("No pudimos cargar la selección. Intentá nuevamente."); });
    fetch("/api/dima/access", { signal: controller.signal }).then((response) => response.json()).then((data) => {
      if (controller.signal.aborted) return;
      if (data.acceso === "libro" || data.acceso === "plus") setAccess(data.acceso);
      setProviderReady(data.consultaLibreDisponible === true);
    }).catch(() => undefined);
    return () => { controller.abort(); activeRequest.current?.abort(); };
  }, []);

  useEffect(() => {
    if (mode !== "libro" || access !== "libro") return;
    const controller = new AbortController();
    fetch("/api/dima?nivel=libro", { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos abrir la colección.");
      if (controller.signal.aborted) return;
      if (!Array.isArray(data.palabras) || !data.palabras.every((item: unknown) => typeof item === "string")) throw new Error("La colección llegó incompleta.");
      setBookWords(data.palabras); setBookNotice(typeof data.aviso === "string" ? data.aviso : "");
    }).catch((cause) => { if (!controller.signal.aborted) setError(cause.message); });
    return () => controller.abort();
  }, [mode, access]);

  function clearReading() {
    requestId.current += 1; activeRequest.current?.abort();
    pendingLayer.current = null;
    setResult(null); setError(""); setLoading(false); setSaved(false); setDepth(1);
  }
  function chooseWord(value: string) { clearReading(); setWord(value); }
  function chooseMode(next: Mode) { clearReading(); setMode(next); setWord(""); setCode(""); setAccessError(""); }

  async function unlock(event: FormEvent) {
    event.preventDefault(); setUnlocking(true); setAccessError("");
    try {
      const response = await fetch("/api/dima/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo: code }) });
      const data = await response.json();
      if (!response.ok || !["libro", "plus"].includes(data.acceso)) throw new Error(data.error || "No pudimos abrir este acceso.");
      clearReading(); setAccess(data.acceso); setMode(data.acceso); setCode("");
      const status = await (await fetch("/api/dima/access")).json();
      setProviderReady(status.consultaLibreDisponible === true);
    } catch (cause) { setAccessError(cause instanceof Error ? cause.message : "No pudimos validar la clave."); }
    finally { setUnlocking(false); }
  }

  async function logout() {
    clearReading(); setAccess(null); setMode("free"); setBookWords([]); setBookNotice(""); setCode(""); setWord(""); setProviderReady(false);
    try {
      const response = await fetch("/api/dima/access", { method: "DELETE" });
      if (!response.ok) throw new Error();
      clearReading(); setAccess(null); setMode("free"); setBookWords([]); setBookNotice(""); setCode(""); setWord(""); setProviderReady(false);
    } catch { setAccessError("No pudimos cerrar el acceso. Intentá nuevamente."); }
  }

  async function consult(value: string, event?: FormEvent) {
    event?.preventDefault(); clearReading();
    const term = value.trim();
    if (!term || locked) return;
    const id = requestId.current; const controller = new AbortController(); activeRequest.current = controller;
    setWord(term); setLoading(true);
    try {
      const response = await fetch("/api/dima", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ palabra: term, nivel: mode }), signal: controller.signal });
      const data = await response.json();
      if (controller.signal.aborted || id !== requestId.current) return;
      if (!response.ok || data.error) {
        if (response.status === 401) { setAccess(null); setBookWords([]); }
        throw new Error(data.error || "No pudimos abrir esta palabra.");
      }
      const next = readResult(data);
      if (normalize(next.palabra) !== normalize(term) || !next.inside) throw new Error("La lectura recibida no corresponde a esta consulta.");
      setResult(next); setSaved(data.registro?.guardado === true);
    } catch (cause) {
      if (!controller.signal.aborted && id === requestId.current) setError(cause instanceof Error ? cause.message : "No pudimos completar la consulta.");
    } finally { if (!controller.signal.aborted && id === requestId.current) setLoading(false); }
  }

  function advance(next: ReadingDepth) {
    if (next <= depth) { focusLayer(next); return; }
    pendingLayer.current = next;
    setDepth((current) => Math.max(current, next) as ReadingDepth);
  }

  return <main className={shell.page}>
    <div className={shell.atmosphere} aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <header className={shell.header}><Link href="/mpa">← MPA</Link><span>DIMA · {lang === "es" ? "ARCHIVO VIVO" : "LIVING ARCHIVE"}</span><div className={shell.headerActions}><button type="button" className={lang === "es" ? shell.langActive : ""} aria-pressed={lang === "es"} onClick={() => setLang("es")}>ES</button><button type="button" className={lang === "en" ? shell.langActive : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">PULSUS FRACTUM</Link></div></header>
    <section className={shell.hero} aria-labelledby="dima-title">
      <div className={shell.orbit} aria-hidden="true"><span>Δ</span></div>
      <img className={shell.dimaFigure} src="/dima-machine-cutout-v1.png" alt="DIMA" width={470} height={560} />
      <p className={shell.eyebrow}>{lang === "es" ? "DISPOSITIVO INTELIGENTE METALQUÍMICO ACTIVO" : "ACTIVE INTELLIGENT METALKIMIC DEVICE"}</p><h1 id="dima-title">DIMA</h1>
      <p className={shell.manifesto}>{lang === "es" ? "No define la palabra. La abre para mostrar la configuración que contiene." : "It does not define the word. It opens it to reveal the configuration it contains."}</p>
      <div className={shell.sequence}><span><b>01</b> {lang === "es" ? "Elegí una puerta" : "Choose a door"}</span><i /><span><b>02</b> {lang === "es" ? "Recibí una revelación" : "Receive a revelation"}</span><i /><span><b>03</b> {lang === "es" ? "Profundizá si lo necesitás" : "Go deeper if needed"}</span></div>
    </section>
    <section className={shell.portal}>
      <p className={shell.sectionLabel}>{lang === "es" ? "¿QUÉ QUERÉS MIRAR HOY?" : "WHAT DO YOU WANT TO LOOK AT TODAY?"}</p>
      <nav className={shell.doors} aria-label="Puertas de DIMA">
        <button type="button" className={mode === "free" ? shell.activeDoor : ""} aria-pressed={mode === "free"} onClick={() => chooseMode("free")}><span className={shell.glyph}>◐</span><small>PUERTA I</small><b>Configuración oculta</b><em>Lo que creés decir / lo que la forma contiene</em></button>
        <button type="button" className={mode === "plus" ? shell.activeDoor : ""} aria-pressed={mode === "plus"} onClick={() => chooseMode("plus")}><span className={shell.glyph}>△</span><small>PUERTA II</small><b>Análisis Metalquímico</b><em>Una lectura completa, entregada por capas</em></button>
        <button type="button" className={mode === "libro" ? shell.activeDoor : ""} aria-pressed={mode === "libro"} onClick={() => chooseMode("libro")}><span className={shell.glyph}>◇</span><small>PUERTA III</small><b>Colecciones de obra</b><em>Glosarios que se abren con cada libro o producto</em></button>
      </nav>
    </section>
    <section className={shell.consultation} id="dima-consultation" aria-labelledby="consultation-title">
      <div className={shell.consultCopy}><p className={shell.sectionLabel}>{mode === "libro" ? "COLECCIÓN · ¡QUÉ EMBOLE!" : mode === "plus" ? "ANÁLISIS AMPLIADO · DIMA PLUS" : "PRIMERA REVELACIÓN · ACCESO ABIERTO"}</p><h2 id="consultation-title">{mode === "free" ? "Elegí una palabra." : mode === "plus" ? "Abrí la primera capa del análisis." : "Entrá al glosario vivo de la obra."}</h2><p>{mode === "free" ? `${publicWords.length ? `Explorá ${publicWords.length} palabras sin clave.` : "Explorá la selección de palabras sin clave."} Primero abrimos su construcción; después, sus relaciones y posibilidades de reconfiguración. La síntesis llega al final.` : mode === "plus" ? "Tu clave de DIMA Plus abre el análisis ampliado y la consulta de palabras o expresiones libres." : "La clave incluida en ¡Qué embole! abre su colección. Conservá la misma clave que figura en tu libro."}</p>
        {access && <div className={shell.accessState}><span>Tu acceso {access === "libro" ? "¡Qué embole!" : "DIMA Plus"} está abierto.</span><button type="button" onClick={logout}>Cerrar acceso</button></div>}
        {lang === "en" && <p className={shell.notice}>The prepared readings are currently available in Spanish.</p>}
      </div>
      {locked ? <form className={shell.form} onSubmit={unlock}><label htmlFor="dima-code">{mode === "libro" ? "CLAVE DE ¡QUÉ EMBOLE!" : "CLAVE DE DIMA PLUS"}</label><div className={shell.keyFields}><input id="dima-code" type="password" value={code} onChange={(event) => setCode(event.target.value)} maxLength={120} autoComplete="off" placeholder="Ingresá tu clave" /></div><button type="submit" disabled={unlocking || !code.trim()}>{unlocking ? "COMPROBANDO…" : "ABRIR MI ACCESO"}</button>{accessError && <p className={shell.error} role="alert">{accessError}</p>}</form> : <form className={shell.form} onSubmit={(event) => consult(word, event)}>
        <label htmlFor="dima-word">FORMA A DESVELAR</label>
        <div className={mode === "libro" ? shell.keyFields : undefined}>
          {mode !== "libro" && <select aria-label="Elegí una palabra de la selección" value={words.includes(word) ? word : ""} onChange={(event) => chooseWord(event.target.value)}><option value="">Elegí una palabra</option>{words.map((item) => <option key={item} value={item}>{item}</option>)}</select>}
          {mode === "libro" ? <select id="dima-word" value={words.includes(word) ? word : ""} onChange={(event) => chooseWord(event.target.value)}><option value="">Elegí una forma</option>{words.map((item) => <option key={item} value={item}>{item}</option>)}</select> : <input id="dima-word" value={word} onChange={(event) => chooseWord(event.target.value)} placeholder={mode === "plus" ? "o escribí una palabra o expresión" : "o escribí una palabra"} maxLength={100} autoComplete="off" />}
        </div>
        <button type="submit" disabled={loading || !word.trim() || (mode === "plus" && !providerReady && !publicWords.some((item) => normalize(item) === normalize(word.trim())))}>{loading ? "DIMA ESTÁ OBSERVANDO…" : "REVELAR CONFIGURACIÓN"}</button>
        {mode === "plus" && !providerReady && <p className={shell.notice}>La generación de palabras nuevas todavía no está conectada en esta copia. Podés probar el análisis ampliado y el guardado con las palabras de la selección.</p>}
        {mode === "plus" && <p className={shell.notice}>Las consultas de Plus se conservan en el archivo privado de DIMA para su revisión.</p>}
        {mode === "libro" && bookNotice && <p className={shell.notice}>{bookNotice}</p>}
        {error && <p className={shell.error} role="alert">{error}</p>}{accessError && <p className={shell.error} role="alert">{accessError}</p>}
        <p className={shell.notice} role="status">{loading ? `DIMA está consultando ${word}.` : result ? `Consulta de ${result.palabra} disponible.${saved ? " Guardada en la base de DIMA." : ""}` : ""}</p>
      </form>}
    </section>
    {mode === "free" && <div className={shell.startWords}><span>Podés empezar por</span>{INITIAL_WORDS.map((item) => <button key={item} type="button" onClick={() => consult(item)}>{item}</button>)}</div>}
    {result && !locked && <section className={shell.reading} aria-label={`Consulta DIMA de ${result.palabra}`}>
      <header className={shell.readingHead} id="dima-reading-heading"><p className={shell.sectionLabel}>{mode === "free" ? "LECTURA GRATUITA" : mode === "libro" ? "COLECCIÓN · ¡QUÉ EMBOLE!" : "ANÁLISIS METALQUÍMICO"}</p><h2>{result.palabra}</h2><p className={shell.contrast}>Empezá por su origen y su construcción. Después explorá sus relaciones y reconfiguración; la síntesis reúne lo descubierto al final.</p></header>
      <ReadingJourney result={result} depth={depth} ampliado={mode === "plus"} onAdvance={advance} onRestart={() => { clearReading(); setWord(""); document.getElementById("dima-consultation")?.scrollIntoView({ block: "start" }); document.getElementById("dima-word")?.focus(); }} />
    </section>}
    <section className={shell.valuePath}><p className={shell.sectionLabel}>DIMA CRECE CON TU PREGUNTA</p><h2>Una sola lectura. Distintas entregas.</h2><div><article><small>ABIERTO</small><b>Configuración oculta</b><p>{publicWords.length ? `${publicWords.length} lecturas completas` : "Lecturas de la selección"}, para recorrer sin clave y a tu ritmo.</p></article><article><small>AMPLIADO · CON CLAVE</small><b>Análisis Metalquímico</b><p>DIMA Plus: análisis ampliado, consulta libre y guardado en la base. Las palabras nuevas requieren la conexión de IA.</p><button type="button" onClick={() => { const selected = word; chooseMode("plus"); setWord(selected); document.getElementById("dima-consultation")?.scrollIntoView({ block: "start" }); }}>Abrir DIMA Plus</button></article><article><small>COLECCIÓN · CON CLAVE</small><b>¡Qué embole!</b><p>El glosario de la obra se abre con la clave que ya tenés en el libro.</p><button type="button" onClick={() => { chooseMode("libro"); document.getElementById("dima-consultation")?.scrollIntoView({ block: "start" }); }}>Abrir mi colección</button></article><article><small>PERSONAL</small><b>Integración acompañada</b><p>Un espacio para profundizar tu pregunta con acompañamiento.</p></article></div><a href={`mailto:${PERSONAL_EMAIL}?subject=Integraci%C3%B3n%20personalizada%20DIMA`}>CONSULTAR POR UNA INTEGRACIÓN PERSONALIZADA</a></section>
    <footer className={shell.footer}><span>DIMA · Magia para Atrevidos</span><Link href="/mpa">Volver al universo MPA →</Link></footer>
  </main>;
}
