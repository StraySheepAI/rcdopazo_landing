"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = ["Umbral", "Discernimiento", "Práctica", "Bitácora"];

export default function FundamentosClaseUnoPage() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState("");
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");

  useEffect(() => {
    setCompleted(window.localStorage.getItem("pulsus-fundamentos-clase-1") === "complete");
    setNote(window.localStorage.getItem("pulsus-fundamentos-clase-1-note") || "");
    setHasAccess(window.sessionStorage.getItem("pulsus-campus-access") === "open");
    setAccessChecked(true);
  }, []);

  const unlockClass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bytes = new TextEncoder().encode(accessCode.trim().toUpperCase());
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hashValue = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    if (hashValue === "8af20e022f7ff3850831ae6f8757cb9b11d83aee2da9fb7b0ec39ccfde994666") {
      window.sessionStorage.setItem("pulsus-campus-access", "open");
      setAccessError("");
      setHasAccess(true);
    } else setAccessError("La Escuela todavía no reconoce esa palabra.");
  };

  const saveNote = (value: string) => {
    setNote(value);
    window.localStorage.setItem("pulsus-fundamentos-clase-1-note", value);
  };

  const finish = () => {
    const next = !completed;
    setCompleted(next);
    window.localStorage.setItem("pulsus-fundamentos-clase-1", next ? "complete" : "open");
  };

  if (!accessChecked) return <main className="school-access-gate" />;

  if (!hasAccess) return (
    <main className="school-access-gate">
      <div className="school-visitor-stars" aria-hidden="true" />
      <Link className="school-access-back" href="/mpa/transmuta/pulsus-fractum?entry=mpa">← Volver al índice de Fundamentos</Link>
      <section>
        <div className="school-access-seal" aria-hidden="true"><i>PF</i></div>
        <p>Umbral de Fundamentos</p>
        <h1>La clase se abre<br />con la palabra del campus.</h1>
        <span>El índice puede visitarse. El contenido, los materiales y la bitácora pertenecen al espacio de cursantes.</span>
        <form onSubmit={unlockClass}>
          <label htmlFor="class-access">Palabra de acceso</label>
          <div><input id="class-access" type="password" value={accessCode} onChange={(event) => { setAccessCode(event.target.value); setAccessError(""); }} autoComplete="current-password" autoFocus /><button type="submit">Abrir Fundamentos →</button></div>
          <small className={accessError ? "is-error" : ""}>{accessError || "Usá la misma palabra de acceso que recibiste para el campus."}</small>
        </form>
      </section>
    </main>
  );

  return (
    <main className="pf-classroom">
      <div className="pf-classroom-stars" aria-hidden="true" />
      <header className="pf-classroom-header">
        <Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← Volver al Ágora</Link>
        <span>Escuela de Metalkimia · Pulsus Fractum</span>
        <b>{completed ? "Clase completada" : "Progreso guardado"}</b>
      </header>

      <div className="pf-classroom-layout">
        <aside className="pf-classroom-index">
          <p>Fundamentos</p>
          <h2>Clase 1</h2>
          <div className="pf-classroom-progress"><i style={{ width: `${completed ? 100 : Math.max(18, (active + 1) * 25)}%` }} /></div>
          <small>{completed ? "100% completada" : `Tramo ${active + 1} de ${sections.length}`}</small>
          <nav aria-label="Índice de la clase">
            {sections.map((section, index) => <button key={section} type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)}><em>{String(index + 1).padStart(2, "0")}</em><span>{section}</span>{completed || index < active ? <b>✓</b> : null}</button>)}
          </nav>
          <div className="pf-classroom-resource"><span>Cuaderno de la clase</span><b>Vigilia I · Capacidad, elección y agencia</b><a href="/materiales/cuaderno-vigilia-1.pdf" download>Descargar PDF ↓</a></div>
        </aside>

        <section className="pf-classroom-content">
          <div className="pf-classroom-eyebrow">Fundamento I · Vigilia</div>
          <h1>Antes de transformar,<br />hay que aprender a mirar.</h1>
          <blockquote>“No observamos problemas. Observamos configuraciones.”</blockquote>

          <div className="pf-classroom-panel">
            {active === 0 && <article><p className="pf-lesson-label">Umbral de entrada</p><h2>Mirar no es explicar</h2><p>La primera práctica de Metalkimia no consiste en encontrar una respuesta. Consiste en interrumpir por un momento la explicación automática y reconocer qué elementos, relaciones y límites componen lo que está ocurriendo.</p><p>Una configuración no es una condena ni una identidad. Es una forma que tomó un conjunto de relaciones. Si puede discernirse, puede comenzar a explorarse.</p><div className="pf-lesson-callout"><b>Pregunta de umbral</b><span>¿Qué cambia cuando dejás de preguntar “qué está mal” y preguntás “cómo está configurado”?</span></div></article>}
            {active === 1 && <article><p className="pf-lesson-label">Primer discernimiento</p><h2>Mi parte, la parte del otro y la del sistema</h2><p>Discernir no es dividir el mundo en dos. Es sostener tres referencias a la vez para reconocer correspondencias sin apropiarse de todo ni expulsarlo todo.</p><div className="pf-distinction-grid"><div><b>01 · Mi parte</b><span>¿Qué depende de mi elección, mi capacidad y mi acción?</span></div><div><b>02 · La parte del otro</b><span>¿Qué pertenece a su decisión, su respuesta y su campo?</span></div><div><b>03 · La configuración</b><span>¿Qué emerge de la relación y no pertenece por completo a ninguno?</span></div></div></article>}
            {active === 2 && <article><p className="pf-lesson-label">Práctica de Separatio</p><h2>Los platos que sostenés</h2><p>Anotá todo lo que hoy intentás sostener. No lo ordenes todavía. Después observá tu capacidad real: tiempo, energía, atención y recursos disponibles.</p><ol><li>Reconocé qué platos sí corresponden a tu campo.</li><li>Discerní cuáles pertenecen al campo de otra persona o al sistema compartido.</li><li>Elegí la alternativa más valiosa para este sistema, en este momento y para este propósito.</li></ol><div className="pf-lesson-callout"><b>La no-priorización también es una decisión.</b><span>Si no elegís qué plato dejar caer, lo elegirá el cansancio, una crisis o una fecha incumplida.</span></div></article>}
            {active === 3 && <article><p className="pf-lesson-label">Bitácora personal</p><h2>Dejá una huella de lo observado</h2><p>Este registro queda guardado en este dispositivo. Escribí una frase que nombre la distinción más importante que apareció durante la práctica.</p><label htmlFor="lesson-note">Mi fragmento</label><textarea id="lesson-note" value={note} onChange={(event) => saveNote(event.target.value)} placeholder="Hoy pude distinguir que…"/><small>{note ? "Fragmento guardado automáticamente." : "Todavía no escribiste tu fragmento."}</small></article>}
          </div>

          <div className="pf-classroom-controls">
            <button type="button" disabled={active === 0} onClick={() => setActive(active - 1)}>← Anterior</button>
            {active < sections.length - 1 ? <button className="primary" type="button" onClick={() => setActive(active + 1)}>Continuar →</button> : <button className="primary" type="button" onClick={finish}>{completed ? "Reabrir la clase" : "Completar la clase ✓"}</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
