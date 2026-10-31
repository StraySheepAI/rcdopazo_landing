"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { normalize, readResult, type DimaResult } from "@/lib/dima/schema";
import InsideReading from "./InsideReading";
import styles from "./page.module.css";

type Mode = "free" | "libro" | "plus";
type Access = "libro" | "plus" | null;
const INITIAL_WORDS = ["Devoción", "Normal", "Miedo", "Embole"];
const MODE_INFO = {
  free: { title: "DIMA gratuita", description: "Una selección de palabras para explorar." },
  libro: { title: "¡Qué embole!", description: "El glosario del libro, con su clave de acceso." },
  plus: { title: "DIMA Plus", description: "Consultá una palabra o expresión cualquiera con tu acceso." },
};

export default function DimaPage() {
  const [mode, setMode] = useState<Mode>("free");
  const [access, setAccess] = useState<Access>(null);
  const [providerReady, setProviderReady] = useState(false);
  const [word, setWord] = useState("");
  const [publicWords, setPublicWords] = useState(INITIAL_WORDS);
  const [bookWords, setBookWords] = useState<string[]>([]);
  const [bookNotice, setBookNotice] = useState("");
  const [result, setResult] = useState<DimaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [accessError, setAccessError] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const words = mode === "libro" ? bookWords : publicWords;
  const locked = mode !== "free" && access !== mode;

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
    setResult(null); setError(""); setLoading(false);
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
      setResult(next);
    } catch (cause) {
      if (!controller.signal.aborted && id === requestId.current) setError(cause instanceof Error ? cause.message : "No pudimos completar la consulta.");
    } finally { if (!controller.signal.aborted && id === requestId.current) setLoading(false); }
  }

  return <main className={styles.page}>
    <header className={styles.header}><Link href="/mpa">← Magia para Atrevidos</Link><span>ARCHIVO VIVO DEL LENGUAJE</span></header>
    <section className={styles.intro} aria-labelledby="dima-title">
      <div className={styles.brand}><img src="/dima-machine-cutout-v1.png" alt="" width={96} height={114} /><div><p className={styles.eyebrow}>EL LENGUAJE TAMBIÉN PUEDE SER UNA LLAVE</p><h1 id="dima-title">DIMA</h1></div></div>
      <h2>Abrí una palabra.</h2><p className={styles.lead}>Explorá su raíz, descubrí qué pone en movimiento y elegí cómo querés usarla.</p>
      <nav className={styles.modes} aria-label="Modalidad de DIMA">{(["free", "libro", "plus"] as const).map((item) => <button key={item} type="button" aria-pressed={mode === item} onClick={() => chooseMode(item)}><strong>{MODE_INFO[item].title}</strong><span>{MODE_INFO[item].description}</span>{item !== "free" && <small>{access === item ? "Acceso abierto" : "Con clave"}</small>}</button>)}</nav>
      {access && <div className={styles.accessState}><span>Tu acceso {access === "libro" ? "¡Qué embole!" : "DIMA Plus"} está abierto.</span><button type="button" onClick={logout}>Cerrar acceso</button></div>}
      {!locked && accessError && <p className={styles.error} role="alert">{accessError}</p>}
      {locked ? <form className={styles.accessForm} onSubmit={unlock}><h3>{MODE_INFO[mode].title}</h3><p>{mode === "libro" ? "Ingresá la clave de ¡Qué embole! para abrir el glosario de la obra." : "Ingresá tu clave de DIMA Plus para abrir la consulta libre."}</p><label htmlFor="dima-code">Tu clave de acceso</label><div className={styles.searchRow}><input id="dima-code" type="password" value={code} onChange={(event) => setCode(event.target.value)} maxLength={120} autoComplete="off" /><button type="submit" disabled={unlocking || !code.trim()}>{unlocking ? "Comprobando…" : "Abrir mi acceso"}</button></div>{accessError && <p className={styles.error} role="alert">{accessError}</p>}</form> : <>
        <form className={styles.form} onSubmit={(event) => consult(word, event)}>
          <label htmlFor="dima-word">{mode === "libro" ? "Elegí una palabra de ¡Qué embole!" : mode === "plus" ? "¿Qué palabra o expresión querés consultar?" : "¿Qué palabra querés explorar?"}</label>
          <div className={styles.searchRow}><input id="dima-word" list="dima-words" value={word} onChange={(event) => chooseWord(event.target.value)} placeholder={mode === "plus" ? "Escribí una palabra o expresión" : "Escribí o elegí una palabra"} maxLength={100} autoComplete="off" /><datalist id="dima-words">{words.map((item) => <option key={item} value={item} />)}</datalist><button type="submit" disabled={loading || !word.trim() || (mode === "plus" && !providerReady)}>{loading ? "Consultando…" : "Consultar →"}</button></div>
          {mode === "plus" && !providerReady && <p className={styles.setupNotice}>Tu acceso está reconocido. La consulta libre todavía no está conectada en esta copia de prueba.</p>}
          {mode === "libro" && bookNotice && <p className={styles.setupNotice}>{bookNotice}</p>}
          <p className={styles.status} role="status">{loading ? `DIMA está consultando ${word}.` : result ? `Consulta DIMA de ${result.palabra} disponible.` : ""}</p>
          {error && <p className={styles.error} role="alert">{error}</p>}
        </form>
        {mode === "free" && <div className={styles.examples}><span>Podés empezar por</span>{INITIAL_WORDS.map((item) => <button key={item} type="button" onClick={() => consult(item)}>{item}</button>)}</div>}
        {mode !== "plus" && <details className={styles.catalog}><summary>Ver las {words.length} palabras disponibles{mode === "libro" ? " en esta colección" : " gratis"}</summary><div>{words.map((item) => <button type="button" key={item} onClick={() => consult(item)}>{item}</button>)}</div></details>}
      </>}
    </section>
    {result && !locked && <section className={styles.reading} aria-label={`Consulta DIMA de ${result.palabra}`}><InsideReading result={result} ampliado={mode === "plus"} /><div className={styles.readAgain}><p>¿Qué otra palabra querés mirar?</p><button type="button" onClick={() => { clearReading(); setWord(""); document.getElementById("dima-word")?.focus(); }}>Consultar otra palabra ↑</button></div></section>}
    <footer className={styles.footer}><span>DIMA · Magia para Atrevidos</span><Link href="/mpa">Volver al universo MPA →</Link></footer>
  </main>;
}
