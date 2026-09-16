"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Piece = { id: string; name: string; kind: "fundamento" | "laboratorio" | "encuentro"; href?: string; complete: boolean };

export default function MiRecorridoPage() {
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [pieces, setPieces] = useState<Piece[]>([]);
  useEffect(() => {
    const readCompleted = (key: string) => { try { return Boolean(JSON.parse(window.localStorage.getItem(key) || "{}").completed); } catch { return false; } };
    const fundamentals = readCompleted("pulsus-fundamentos-clase-1-state-v1") || window.localStorage.getItem("pulsus-fundamentos-clase-1") === "complete";
    const logic = readCompleted("pulsus-logica-clase-1-v1");
    const principles = (() => { try { return JSON.parse(window.localStorage.getItem("pulsus-principios-universales-v1") || "{}"); } catch { return {}; } })();
    setName(window.localStorage.getItem("pulsus-student-name") || principles.participant || "");
    setPieces([
      { id: "f1", name: "Fundamentos I", kind: "fundamento", href: "/mpa/transmuta/pulsus-fractum/fundamentos/clase-1", complete: fundamentals },
      { id: "f2", name: "Lógica Simbólica I", kind: "fundamento", href: "/mpa/transmuta/pulsus-fractum/logica/clase-1", complete: logic },
      { id: "f3", name: "Fundamento III", kind: "fundamento", complete: false },
      { id: "l1", name: "Laboratorio de las siete lentes", kind: "laboratorio", href: "/mpa/transmuta/pulsus-fractum/agora/principios-universales", complete: Boolean(principles.completed) },
      { id: "l2", name: "Laboratorio II", kind: "laboratorio", complete: false },
      { id: "l3", name: "Laboratorio III", kind: "laboratorio", complete: false },
      { id: "e1", name: "Encuentro · Principios Universales", kind: "encuentro", href: "/mpa/transmuta/pulsus-fractum/agora/principios-universales", complete: Boolean(principles.attended) },
      { id: "e2", name: "Encuentro II", kind: "encuentro", complete: false },
      { id: "e3", name: "Encuentro III", kind: "encuentro", complete: false },
    ]);
    setReady(true);
  }, []);
  const saveName = (value: string) => { setName(value); window.localStorage.setItem("pulsus-student-name", value); };
  const completed = pieces.filter(piece => piece.complete).length;
  const progress = Math.round((completed / 9) * 100);
  if (!ready) return <main className="campus-journey"/>;
  return <main className="campus-journey"><div className="pf-classroom-stars"/><header><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← Volver al Ágora</Link><span>Escuela de Metalkimia · Pulsus Fractum</span><b>Grado I</b></header><section className="journey-hero"><p>Mi recorrido</p><h1>{name ? `${name}, este es tu mapa.` : "Tu recorrido deja huellas."}</h1><blockquote>No necesitás hacer todo de una vez. El primer grado reúne tres fundamentos, tres laboratorios y tres encuentros.</blockquote><label>Tu nombre<input value={name} onChange={event => saveName(event.target.value)} placeholder="¿Cómo querés que te nombre el Campus?"/></label><div className="journey-progress"><div style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><b>{progress}%</b><span>{completed} de 9 piezas</span></div><p><strong>{completed >= 9 ? "Grado I completado" : completed >= 3 ? "Tu práctica ya empezó" : "Estás abriendo el recorrido"}</strong><span>{completed >= 9 ? "Ya podés solicitar tu integración y certificado de Grado I." : "Cada pieza completada queda registrada en este dispositivo."}</span></p></div></section><section className="journey-grid">{(["fundamento", "laboratorio", "encuentro"] as const).map(kind => <article key={kind}><p>{kind === "fundamento" ? "Comprender" : kind === "laboratorio" ? "Practicar" : "Compartir"}</p><h2>{kind === "fundamento" ? "3 Fundamentos" : kind === "laboratorio" ? "3 Laboratorios" : "3 Encuentros"}</h2>{pieces.filter(piece => piece.kind === kind).map((piece, index) => piece.href ? <Link key={piece.id} className={piece.complete ? "is-complete" : ""} href={piece.href}><em>{String(index + 1).padStart(2, "0")}</em><span><b>{piece.name}</b><small>{piece.complete ? "Completado" : "Continuar recorrido"}</small></span><i>{piece.complete ? "✓" : "→"}</i></Link> : <div key={piece.id} className="is-locked"><em>{String(index + 1).padStart(2, "0")}</em><span><b>{piece.name}</b><small>Próxima apertura</small></span><i>◇</i></div>)}</article>)}</section><footer><p>Podés comenzar a practicar desde los primeros tres meses. La aplicación con otras personas se habilita al integrar las nueve piezas del Grado I.</p><Link href="/mpa/transmuta/pulsus-fractum/oraculo">Consultar el Oráculo de los Pasajes →</Link></footer></main>;
}
