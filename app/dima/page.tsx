"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { PERSONAL_EMAIL } from "@/app/lib/contact";
import styles from "./page.module.css";

type Door = "configuracion" | "metalquimico" | "coleccion";
type Result = {
  fuente?: string;
  bloque1: { forma: string; indicia: string; ludum_mpae: string; causa_mpae: string; ordo?: string };
  bloque2: { initium: string; lectio: string; gradus: string; natura: string };
  bloque3: { viae: string; dictum: string; provocatio: string; sussurro?: string; activatio: string; cierre: string };
};

const FREE_WORDS = ["Realidad", "Problema", "Forma", "Conciencia", "Integración", "Transmutación"];
const BOOK_WORDS = ["Embole", "Bola", "Patraña", "Carga", "Peso", "Sostener", "Soltar", "Hastío", "Deseo", "Movimiento", "Incomodidad", "Fricción"];
const EMBOLE: Result = {
  fuente: "archivo",
  bloque1: { forma: "Embole", ordo: "Transmuta", indicia: "No nombra solamente aburrimiento: contiene una forma que entra, pesa y reduce el movimiento posible.", ludum_mpae: "Detectar qué se volvió bola antes de intentar empujarlo.", causa_mpae: "La palabra muestra una configuración de carga, quietud y fricción, no una identidad personal." },
  bloque2: { initium: "Em- + bole: una forma compuesta por dos núcleos activos.", lectio: "Em- introduce o sitúa dentro. Bole remite a bola, lanzamiento, masa y golpe. Juntas producen la imagen de algo que entra y ocupa.", gradus: "2 Verbus Prime · EM + BOLE", natura: "Configuración mínima: algo ingresa, adquiere peso y compromete el movimiento." },
  bloque3: { viae: "Nombrar la carga · distinguir lo inmóvil · recuperar un movimiento mínimo.", dictum: "No soy el embole: observo qué se hizo bola y elijo qué puede volver a moverse.", provocatio: "¿Qué estás llamando aburrimiento para no mirar la carga que contiene?", sussurro: "¿Qué cambiaría si dejara de ser una definición sobre vos?", activatio: "ATS descompone la forma. ARS M abre una configuración alternativa sin negar lo observado.", cierre: "Lo visto no desaparece: cambia su relación con lo posible." },
};

export default function DimaPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [door, setDoor] = useState<Door>("configuracion");
  const [word, setWord] = useState("Embole");
  const [result, setResult] = useState<Result | null>(null);
  const [depth, setDepth] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const words = useMemo(() => (door === "coleccion" ? BOOK_WORDS : FREE_WORDS), [door]);

  async function reveal(event?: FormEvent) {
    event?.preventDefault(); setError(""); setDepth(1);
    if (word.trim().toLowerCase() === "embole") { setResult(EMBOLE); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/dima", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ palabra: word.trim(), nivel: door === "coleccion" ? "libro" : "free" }) });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "No pude abrir esta palabra.");
      setResult(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No pude abrir esta palabra."); }
    finally { setLoading(false); }
  }

  function chooseDoor(next: Door) { setDoor(next); setResult(null); setDepth(1); setWord(next === "coleccion" ? "Embole" : "Realidad"); }

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
      <div className={styles.consultCopy}><p className={styles.sectionLabel}>{door === "coleccion" ? "COLECCIÓN · ¡QUÉ EMBOLE!" : "PRIMERA REVELACIÓN · ACCESO ABIERTO"}</p><h2>{door === "configuracion" ? "Elegí una palabra." : door === "metalquimico" ? "Abrí la primera capa del análisis." : "Entrá al glosario vivo de la obra."}</h2><p>La primera lectura es breve y comprensible. DIMA solo revela más cuando vos decidís avanzar.</p></div>
      <form className={styles.form} onSubmit={reveal}><label>FORMA A DESVELAR</label><div><select value={words.includes(word) ? word : ""} onChange={(e) => setWord(e.target.value)}>{!words.includes(word) && <option value="">Elegí una forma</option>}{words.map((item) => <option key={item}>{item}</option>)}</select>{door !== "coleccion" && <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="o escribí una palabra" maxLength={50} />}</div><button disabled={loading || !word.trim()}>{loading ? "DIMA ESTÁ OBSERVANDO…" : "REVELAR CONFIGURACIÓN"}</button>{error && <p className={styles.error}>{error}</p>}</form>
    </section>
    {result && <section className={styles.reading}>
      <div className={styles.readingHead}><p className={styles.sectionLabel}>REVELACIÓN I · {result.fuente === "ia" ? "LECTURA ASISTIDA" : "ARCHIVO DIMA"}</p><h2>{result.bloque1.forma}</h2><p className={styles.contrast}><span>Creías que decías</span> una palabra conocida. <strong>DIMA encuentra</strong> una configuración activa.</p></div>
      <article className={styles.revealCard}><small>INDICIO</small><p>{result.bloque1.indicia}</p><div><span><b>ORDO</b>{result.bloque1.ordo || "Por observar"}</span><span><b>APUESTA</b>{result.bloque1.ludum_mpae}</span></div><blockquote>{result.bloque1.causa_mpae}</blockquote></article>
      <nav className={styles.depthNav}><button className={depth >= 1 ? styles.done : ""} onClick={() => setDepth(1)}><b>01</b><span>Revelación</span><small>Acceso abierto</small></button><i /><button className={depth >= 2 ? styles.done : ""} onClick={() => setDepth(2)}><b>02</b><span>ATS · Descomponer</span><small>Morfología y Verbus Prime</small></button><i /><button className={depth >= 3 ? styles.done : ""} onClick={() => setDepth(3)}><b>03</b><span>ARS M · Reconfigurar</span><small>Alternativas e integración</small></button></nav>
      {depth >= 2 && <article className={`${styles.analysisCard} ${styles.ats}`}><header><span>ATS</span><div><small>ANATESIS</small><h3>Descomposición de la forma</h3></div></header><div className={styles.analysisGrid}><section><small>MORFOLOGÍA</small><p>{result.bloque2.lectio}</p></section><section><small>NÚMERO DE VERBUS PRIME</small><strong>{result.bloque2.gradus}</strong></section><section><small>CONFIGURACIÓN MÍNIMA</small><p>{result.bloque2.natura}</p></section><section><small>INITIUM DIMA</small><p>{result.bloque2.initium}</p></section></div>{depth === 2 && <button className={styles.nextDepth} onClick={() => setDepth(3)}>ABRIR LA RECONFIGURACIÓN →</button>}</article>}
      {depth >= 3 && <article className={`${styles.analysisCard} ${styles.ars}`}><header><span>ARS M</span><div><small>RECONFIGURACIÓN</small><h3>Volver a abrir lo posible</h3></div></header><div className={styles.analysisGrid}><section><small>VIAE · ALTERNATIVAS</small><p>{result.bloque3.viae}</p></section><section><small>DICTUM MUTARE</small><strong>{result.bloque3.dictum}</strong></section><section><small>PROVOCATIO</small><p>{result.bloque3.provocatio}</p></section><section><small>ACTIVATIO</small><p>{result.bloque3.activatio}</p></section></div><blockquote>{result.bloque3.sussurro}</blockquote></article>}
    </section>}
    <section className={styles.valuePath}><p className={styles.sectionLabel}>DIMA CRECE CON TU PREGUNTA</p><h2>Una sola lectura. Distintas entregas.</h2><div><article><small>ABIERTO</small><b>Revelación inicial</b><p>Una muestra clara de la configuración.</p></article><article><small>AMPLIADO</small><b>100+ formas</b><p>Morfología, Verbus Prime y archivo validado.</p></article><article><small>INFORME</small><b>Análisis Metalquímico</b><p>ATS + ARS M + integración descargable.</p></article><article><small>PERSONAL</small><b>Integración acompañada</b><p>Consulta personalizada más intervención ATS.</p></article></div><a href={`mailto:${PERSONAL_EMAIL}?subject=Integración personalizada DIMA`}>AGENDAR UNA INTEGRACIÓN PERSONALIZADA</a></section>
  </main>;
}
