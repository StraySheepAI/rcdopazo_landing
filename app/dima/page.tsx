"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { PERSONAL_EMAIL } from "@/app/lib/contact";
import { BOOK_WORDS } from "@/lib/dima/catalog";
import { DIMA_STEPS, normalize, readResult, type DimaResult } from "@/lib/dima/schema";
import styles from "./page.module.css";

type Door = "configuracion" | "metalquimico" | "coleccion";
function TextFlow({ children }: { children?: string | string[] }) {
  const text = Array.isArray(children) ? children.join(" · ") : children || "";
  return <div className={styles.textFlow}>{text.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 16)}`}>{paragraph}</p>)}</div>;
}

const INITIAL_WORDS = ["Patraña", "Embole"];
const ORIGINS = { planilla: "Planilla DIMA", base: "Archivo ampliado", ia: "Lectura asistida · provisional", archivo: "Ficha de referencia" };
const STATES = { documentado: "Base lingüística documentada", interpretacion: "Interpretación DIMA", pendiente: "Pendiente de verificación o análisis" };

export default function DimaPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [door, setDoor] = useState<Door>("configuracion");
  const [word, setWord] = useState("Patraña");
  const [result, setResult] = useState<DimaResult | null>(null);
  const [depth, setDepth] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [freeWords, setFreeWords] = useState(INITIAL_WORDS);
  const [notice, setNotice] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const words = useMemo(() => (door === "coleccion" ? BOOK_WORDS : freeWords), [door, freeWords]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/dima", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (Array.isArray(data.palabras) && data.palabras.length && data.palabras.every((item: unknown) => typeof item === "string")) setFreeWords(data.palabras);
      if (typeof data.aviso === "string") setNotice(data.aviso);
    }).catch(() => {
      if (!controller.signal.aborted) setNotice("No pudimos cargar el catálogo. Podés consultar las fichas de referencia.");
    });
    return () => { controller.abort(); activeRequest.current?.abort(); };
  }, []);

  function clearReading() {
    requestId.current += 1;
    activeRequest.current?.abort();
    setResult(null); setError(""); setLoading(false); setDepth(1);
  }

  async function reveal(event?: FormEvent) {
    event?.preventDefault();
    clearReading();
    const id = requestId.current;
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    const queriedWord = word.trim();
    try {
      const nivel = door === "coleccion" ? "libro" : door === "metalquimico" ? "metalquimico" : "free";
      const response = await fetch("/api/dima", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ palabra: queriedWord, nivel }), signal: controller.signal });
      const data = await response.json();
      if (controller.signal.aborted || id !== requestId.current) return;
      if (!response.ok || data.error) throw new Error(data.error || "No pude abrir esta palabra.");
      const reading = readResult(data);
      if (normalize(reading.palabra) !== normalize(queriedWord)) throw new Error("La ficha recibida corresponde a otra palabra.");
      setResult(reading);
    } catch (cause) {
      if (!controller.signal.aborted && id === requestId.current) setError(cause instanceof Error ? cause.message : "No pude abrir esta palabra.");
    } finally {
      if (!controller.signal.aborted && id === requestId.current) setLoading(false);
    }
  }

  function chooseWord(next: string) { clearReading(); setWord(next); }
  function chooseDoor(next: Door) { clearReading(); setDoor(next); setWord(next === "coleccion" ? "Embole" : "Patraña"); }

  return <main className={styles.page}>
    <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <header className={styles.header}><Link href="/mpa">← MPA</Link><span>DIMA · {lang === "es" ? "ARCHIVO VIVO" : "LIVING ARCHIVE"}</span><div className={styles.headerActions}><button className={lang === "es" ? styles.langActive : ""} onClick={() => setLang("es")}>ES</button><button className={lang === "en" ? styles.langActive : ""} onClick={() => setLang("en")}>EN</button><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">PULSUS FRACTUM</Link></div></header>
    <section className={styles.hero}>
      <div className={styles.orbit} aria-hidden="true"><span>Δ</span></div>
      <img className={styles.dimaFigure} src="/dima-machine-cutout-v1.png" alt="DIMA" />
      <p className={styles.eyebrow}>{lang === "es" ? "DISPOSITIVO INTELIGENTE METALQUÍMICO ACTIVO" : "ACTIVE INTELLIGENT METALKIMIC DEVICE"}</p><h1>DIMA</h1>
      <p className={styles.manifesto}>{lang === "es" ? "No define la palabra. La abre para mostrar la configuración que contiene." : "It does not define the word. It opens it to reveal the configuration it contains."}</p>
      <div className={styles.sequence}><span><b>01</b> {lang === "es" ? "Elegí una puerta" : "Choose a door"}</span><i /><span><b>02</b> {lang === "es" ? "Recibí una revelación" : "Receive a revelation"}</span><i /><span><b>03</b> {lang === "es" ? "Profundizá si lo necesitás" : "Go deeper if needed"}</span></div>
    </section>
    <section className={styles.portal}>
      <p className={styles.sectionLabel}>{lang === "es" ? "¿QUÉ QUERÉS MIRAR HOY?" : "WHAT DO YOU WANT TO LOOK AT TODAY?"}</p>
      <div className={styles.doors}>
        <button className={door === "configuracion" ? styles.activeDoor : ""} onClick={() => chooseDoor("configuracion")}><span className={styles.glyph}>◐</span><small>{lang === "es" ? "PUERTA I" : "DOOR I"}</small><b>{lang === "es" ? "Configuración oculta" : "Hidden configuration"}</b><em>{lang === "es" ? "Lo que creés decir / lo que la forma contiene" : "What you think you say / what the form contains"}</em></button>
        <button className={door === "metalquimico" ? styles.activeDoor : ""} onClick={() => chooseDoor("metalquimico")}><span className={styles.glyph}>△</span><small>{lang === "es" ? "PUERTA II" : "DOOR II"}</small><b>{lang === "es" ? "Análisis Metalquímico" : "Metalkimic Analysis"}</b><em>{lang === "es" ? "Una lectura completa, entregada por capas" : "A complete reading, delivered in layers"}</em></button>
        <button className={door === "coleccion" ? styles.activeDoor : ""} onClick={() => chooseDoor("coleccion")}><span className={styles.glyph}>◇</span><small>{lang === "es" ? "PUERTA III" : "DOOR III"}</small><b>{lang === "es" ? "Colecciones de obra" : "Work collections"}</b><em>{lang === "es" ? "Glosarios que se abren con cada libro o producto" : "Glossaries unlocked by each book or product"}</em></button>
      </div>
    </section>
    <section className={styles.consultation}>
      <div className={styles.consultCopy}><p className={styles.sectionLabel}>{door === "coleccion" ? "COLECCIÓN · ¡QUÉ EMBOLE!" : "PRIMERA REVELACIÓN · ACCESO ABIERTO"}</p><h2>{door === "configuracion" ? "Elegí una palabra." : door === "metalquimico" ? "Abrí la primera capa del análisis." : "Entrá al glosario vivo de la obra."}</h2><p>Primero, la base lingüística; después, la lectura DIMA. Cada paso distingue lo documentado, lo interpretativo y lo pendiente.</p></div>
      <form className={styles.form} onSubmit={reveal}>
        <label htmlFor="dima-word">FORMA A DESVELAR</label>
        <div className={door === "metalquimico" ? undefined : styles.singleField}>
          <select id="dima-word" value={words.includes(word) ? word : ""} onChange={(e) => chooseWord(e.target.value)}>
            {!words.includes(word) && <option value="">Elegí una forma</option>}
            {words.map((item) => <option key={item}>{item}</option>)}
          </select>
          {door === "metalquimico" && <><label className={styles.inputLabel} htmlFor="dima-custom">O escribí una palabra o expresión</label><input id="dima-custom" aria-label="Otra palabra o expresión" value={word} onChange={(e) => chooseWord(e.target.value)} placeholder="o escribí una palabra" maxLength={100} /></>}
        </div>
        <button disabled={loading || !word.trim()}>{loading ? "DIMA ESTÁ OBSERVANDO…" : "REVELAR CONFIGURACIÓN"}</button>
        {notice && <p className={styles.notice}>{notice}</p>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <p className={styles.notice} role="status">{loading ? `Consultando ${word}…` : result ? `Lectura de ${result.palabra} disponible.` : ""}</p>
      </form>
    </section>
    {result && <section className={styles.reading} aria-label={`Análisis DIMA de ${result.palabra}`}>
      <div className={styles.readingHead}>
        <p className={styles.sectionLabel}>{ORIGINS[result.origen]}</p><h2>{result.palabra}</h2>
        <p className={styles.contrast}>{result.estado === "parcial" ? "Ficha parcial: los pasos pendientes se indican expresamente." : "Recorrido de ocho pasos: evidencia lingüística y propuesta DIMA diferenciadas."}</p>
      </div>
      <nav className={styles.depthNav} aria-label="Profundidad de la lectura">
        <button className={depth >= 1 ? styles.done : ""} aria-pressed={depth === 1} onClick={() => setDepth(1)}><b>01</b><span>Base y operación</span><small>Pasos 1–3</small></button><i aria-hidden="true" />
        <button className={depth >= 2 ? styles.done : ""} aria-pressed={depth === 2} onClick={() => setDepth(2)}><b>02</b><span>Distinciones y relación</span><small>Pasos 4–5</small></button><i aria-hidden="true" />
        <button className={depth >= 3 ? styles.done : ""} aria-pressed={depth === 3} onClick={() => setDepth(3)}><b>03</b><span>Transmutación y síntesis</span><small>Pasos 6–8</small></button>
      </nav>
      {DIMA_STEPS.filter((step) => step.depth <= depth).map((step) => {
        const section = result.analisis[step.id];
        const number = DIMA_STEPS.findIndex((item) => item.id === step.id) + 1;
        return <article key={step.id} className={`${styles.analysisCard} ${styles.stepCard}`} aria-labelledby={`dima-step-${step.id}`}>
          <p className={styles.sectionLabel}>PASO {number} DE 8</p><h3 id={`dima-step-${step.id}`}>{step.title}</h3>
          <p className={`${styles.evidenceLabel} ${section.estado === "pendiente" ? styles.pending : ""}`}>{STATES[section.estado]}</p>
          {step.id === "morfologia" && section.estado === "pendiente" && <p className={styles.notice}>No hay evidencia lingüística revisada para esta entrada. El texto disponible debe contrastarse antes de tratarlo como un hecho histórico.</p>}
          <TextFlow>{section.texto}</TextFlow>
          {section.fuentes.length > 0 && <p className={styles.sourceLinks}>Fuentes: {section.fuentes.map((id) => <a key={id} href={`#dima-source-${id}`}>{result.fuentes.find((source) => source.id === id)?.titulo}</a>)}</p>}
        </article>;
      })}
      {depth < 3 && <button className={styles.nextDepth} onClick={() => setDepth(depth === 1 ? 2 : 3)}>{depth === 1 ? "VER DISTINCIONES Y RELACIÓN →" : "VER TRANSMUTACIÓN Y SÍNTESIS →"}</button>}
      <aside className={styles.evidence} aria-label="Fuentes y notas">
        <h3>Fuentes y notas</h3>
        {result.fuentes.length ? <ul>{result.fuentes.map((source) => <li key={source.id} id={`dima-source-${source.id}`}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.titulo}</a><span>Referencia comprobada el {source.consulta}. Respalda los datos lingüísticos indicados; las etapas DIMA son interpretativas.</span></li>)}</ul> : <p>Esta entrada no tiene fuentes lingüísticas revisadas. Una ficha de archivo no equivale a una verificación histórica.</p>}
        {result.archivo.length > 0 && <details className={styles.whyDetail}><summary>Consultar material heredado sin verificar</summary><div className={styles.legacyContent}><p>Se conserva con sus nombres originales. No constituye evidencia ni completa por sí solo los ocho pasos.</p>{result.archivo.map((item, index) => <section key={`${index}-${item.etiqueta}`}><h4>{item.etiqueta}</h4><TextFlow>{item.texto}</TextFlow></section>)}</div></details>}
      </aside>
    </section>}
    <section className={styles.valuePath}><p className={styles.sectionLabel}>DIMA CRECE CON TU PREGUNTA</p><h2>Una sola lectura. Distintas entregas.</h2><div><article><small>ABIERTO</small><b>Revelación inicial</b><p>Una muestra clara de la configuración.</p></article><article><small>AMPLIADO</small><b>100+ formas</b><p>Morfología, Verbus Prime y archivo validado.</p></article><article><small>INFORME</small><b>Análisis Metalquímico</b><p>ATS + ARS M + integración descargable.</p></article><article><small>PERSONAL</small><b>Integración acompañada</b><p>Consulta personalizada más intervención ATS.</p></article></div><a href={`mailto:${PERSONAL_EMAIL}?subject=Integración personalizada DIMA`}>AGENDAR UNA INTEGRACIÓN PERSONALIZADA</a></section>
  </main>;
}
