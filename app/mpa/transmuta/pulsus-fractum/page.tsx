"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PulsusFractumPage() {
  const [hash, setHash] = useState("");
  const [view, setView] = useState<"arrival" | "agora" | "access" | "atlas">("arrival");
  const [ludusOpen, setLudusOpen] = useState(false);
  const [place, setPlace] = useState<"orientation" | "fundamentos" | "custos" | "reconfigura" | "arquitectos" | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [mpaEntry, setMpaEntry] = useState(false);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    const params = new URLSearchParams(window.location.search);
    setMpaEntry(params.get("entry") === "mpa" || document.referrer.includes("/mpa/"));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const requestCampusAccess = () => {
    if (window.sessionStorage.getItem("pulsus-campus-access") === "open") setView("atlas");
    else setView("access");
  };

  const unlockCampus = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bytes = new TextEncoder().encode(accessCode.trim().toUpperCase());
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hashValue = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    if (hashValue === "8af20e022f7ff3850831ae6f8757cb9b11d83aee2da9fb7b0ec39ccfde994666") {
      window.sessionStorage.setItem("pulsus-campus-access", "open");
      setAccessError("");
      setAccessCode("");
      setView("atlas");
    } else {
      setAccessError("La Escuela todavía no reconoce esa palabra.");
    }
  };

  if (view === "arrival") return (
    <main className="school-visitor">
      <div className="school-visitor-stars" aria-hidden="true" />
      <header className="school-visitor-header">
        <Link href="/">← R.C. Dopazo</Link>
        <span>Escuela de Metalkimia</span>
        <button type="button" onClick={requestCampusAccess}>Ya estoy cursando</button>
      </header>

      <section className="school-campus-arrival">
        <div className="school-campus-copy">
          <p>Escuela de Metalquimia · Campus Pulsus Fractum</p>
          <h1>Conocé la Escuela<br />Pulsus Fractum.</h1>
          <span>Una escuela para aprender a distinguir configuraciones, ampliar agencia y transformar experiencia en práctica.</span>
          <div>
            <button type="button" onClick={() => setView("agora")}>Visitar el Ágora</button>
            {mpaEntry ? <button className="school-campus-access-button" type="button" onClick={requestCampusAccess}>Acceso de cursantes</button> : <a href="#vigilia-abierta">Conocer la primera experiencia ↓</a>}
          </div>
        </div>

        <div className="school-arrival-portrait">
          <button type="button" onClick={() => setView("agora")} aria-label="Entrar al Ágora">
            <Image src="/pulsus-agora-interior-v1.png" alt="Interior del Ágora de la Escuela de Metalquimia" width={1680} height={945} priority />
            <span><small>Una mirada al interior</small><b>Ágora Pulsus</b><em>Atravesar la imagen →</em></span>
          </button>
          {mpaEntry && <div className="school-arrival-resources"><a href="/mapa-inicial-pulsus-fractum.svg" download>↓ Descargar mapa inicial</a><button type="button" onClick={() => { setView("agora"); setLudusOpen(true); }}>Abrir Vigilia I</button></div>}
        </div>
      </section>

      <section className="school-open-ludus" id="vigilia-abierta">
        <div>
          <p>Primera experiencia abierta</p>
          <h2>Vigilia I</h2>
          <blockquote>“El que parte y reparte se lleva la mejor parte.”</blockquote>
        </div>
        <div>
          <p>No podés sostener todos los platos. La pregunta es quién decide cuál dejar caer.</p>
          <button type="button" onClick={() => { setView("agora"); setLudusOpen(true); }}>Atravesar el primer Ludus →</button>
          <small>Acceso gratuito · No requiere experiencia previa</small>
        </div>
      </section>
    </main>
  );

  if (view === "agora") return (
    <main className="school-agora">
      <div className="school-visitor-stars" aria-hidden="true" />
      <header className="school-visitor-header">
        <button type="button" onClick={() => setView("arrival")}>← Entrada del Campus</button>
        <span>Ágora Pulsus</span>
        <button type="button" onClick={() => { setHash("#campus"); requestCampusAccess(); }}>Abrir mapa</button>
      </header>

      <section className="school-agora-place">
        <div className="school-agora-intro">
          <p className="school-agora-kicker">Campus Pulsus Fractum · espacio común</p>
          <h1>Ágora</h1>
          <p className="school-agora-welcome">Acá empiezan todos. Elegí qué querés encontrar; el campus te mostrará hasta dónde podés entrar hoy.</p>
        </div>

        <div className="school-agora-world" aria-label="Interior del Ágora de Pulsus Fractum">
          <div className="school-magic-lights" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div className="school-light-beam beam-left" aria-hidden="true" />
          <div className="school-light-beam beam-right" aria-hidden="true" />
          <button className="school-hotspot school-hotspot-board" type="button" onClick={() => setPlace("orientation")}><b>Cartelera viva</b><span>Orientación · talleres · encuentros</span></button>
          <button className="school-hotspot school-hotspot-custos" type="button" onClick={() => setPlace("custos")}><b>◐ Casa de Custos</b><span>Observar y delimitar</span></button>
          <button className="school-hotspot school-hotspot-center" type="button" onClick={() => setLudusOpen(!ludusOpen)}><small>Experiencia abierta</small><b>Vigilia I</b><span>Entrar al círculo</span></button>
          <button className="school-hotspot school-hotspot-reconfigura" type="button" onClick={() => setPlace("reconfigura")}><b>↯ Reconfiguradores</b><span>Intervenir y transformar</span></button>
          <button className="school-hotspot school-hotspot-book" type="button" onClick={() => setPlace("fundamentos")}><b>Libro de Fundamentos</b><span>Abrir el índice</span></button>
          <button className="school-hotspot school-hotspot-architect" type="button" onClick={() => setPlace("arquitectos")}><b>△ Pasaje de Arquitectos</b><span>Profundidad requerida</span></button>
        </div>

        {ludusOpen && (
          <article className="school-ludus-threshold">
            <p>Vigilia I</p>
            <h2>Hay más platos de los que podés sostener.</h2>
            <span>Antes de elegir, mirá: ¿cuáles sostenés porque importan y cuáles porque todavía no decidiste soltarlos?</span>
            <div className="school-plates" aria-hidden="true"><i>Tiempo</i><i>Certeza</i><i>Ayuda</i><i>Movimiento</i></div>
            <button type="button">Comenzar la experiencia →</button>
            <small>La experiencia completa será el próximo espacio que construiremos.</small>
          </article>
        )}

        {place && (
          <div className="school-place-overlay" role="dialog" aria-modal="true" aria-label="Información del espacio">
            <article>
              <button className="school-place-close" type="button" onClick={() => setPlace(null)} aria-label="Cerrar">×</button>
              {place === "orientation" && <><p>Cartelera viva · acceso académico</p><h2>Elegí cómo entrar</h2><span className="school-place-lead">La magia del campus y la estructura de una escuela, juntas. Acá podés descubrir la propuesta, comenzar gratis o continuar tu recorrido.</span><div className="school-course-grid"><button onClick={() => { setPlace(null); setLudusOpen(true); }}><small>Abierto · gratuito</small><b>Vigilia I</b><em>1 experiencia</em><span>Comenzar ahora →</span></button><button onClick={() => setPlace("fundamentos")}><small>Programa inicial</small><b>Fundamentos</b><em>10 fundamentos</em><span>Ver programa →</span></button><button onClick={() => setPlace("custos")}><small>Pasaje formativo</small><b>Custos</b><em>Acceso por inscripción</em><span>Conocer recorrido →</span></button><button onClick={() => setPlace("reconfigura")}><small>Pasaje formativo</small><b>Reconfiguración</b><em>Acceso por inscripción</em><span>Conocer recorrido →</span></button></div><div className="school-student-entry"><div><b>¿Ya estás cursando?</b><span>Entrá a tus clases, materiales y bitácora.</span></div><button onClick={requestCampusAccess}>Abrir mi espacio →</button></div></>}
              {place === "fundamentos" && <><p>Biblioteca común · orientación</p><h2>Fundamentos de Metalquimia</h2><span>Diez fundamentos para distinguir cambio, función, vigilia, agencia y reconfiguración. Podés conocer el índice antes de iniciar un Pasaje.</span><div className="school-depth"><b>Visitante</b><i>Vista general disponible</i><b>Iniciado</b><i>Clases, prácticas y bitácora</i></div><button className="school-place-primary" onClick={() => setLudusOpen(true)}>Comenzar por Vigilia I →</button></>}
              {place === "custos" && <><p>Casa · Pasaje de observación</p><h2>Custos</h2><span>Aprender a distinguir qué ocurre, qué corresponde y dónde termina cada dominio antes de intervenir.</span><div className="school-depth"><b>Visitante</b><i>Podés conocer su propósito</i><b>En Pasaje</b><i>Prácticas y aulas disponibles</i></div><button className="school-place-primary" onClick={requestCampusAccess}>Ya curso: abrir mi acceso →</button></>}
              {place === "reconfigura" && <><p>Casa · Pasaje de intervención</p><h2>Reconfiguradores</h2><span>Explorar configuraciones, alternativas y movimientos capaces de producir otra forma posible.</span><div className="school-depth"><b>Visitante</b><i>El umbral puede recorrerse</i><b>En Pasaje</b><i>Laboratorios y materiales</i></div><button className="school-place-primary" onClick={requestCampusAccess}>Ya curso: abrir mi acceso →</button></>}
              {place === "arquitectos" && <><p>Pasaje de integración</p><h2>Casa de Arquitectos</h2><span>No está cerrada por jerarquía: se revela cuando la experiencia en Custos y Reconfiguración permite integrar sistemas completos.</span><div className="school-seal-lock">△ <b>Profundidad requerida</b></div><button className="school-place-primary" onClick={() => setPlace("orientation")}>Volver a la orientación →</button></>}
            </article>
          </div>
        )}
      </section>
    </main>
  );

  if (view === "access") return (
    <main className="school-access-gate">
      <div className="school-visitor-stars" aria-hidden="true" />
      <button className="school-access-back" type="button" onClick={() => setView("agora")}>← Volver al Ágora</button>
      <section>
        <div className="school-access-seal" aria-hidden="true"><i>PF</i></div>
        <p>Umbral de cursantes</p>
        <h1>El campus reconoce<br />a quienes tienen la palabra.</h1>
        <span>Ingresá la clave recibida para abrir las aulas, los materiales y tu recorrido.</span>
        <form onSubmit={unlockCampus}>
          <label htmlFor="pulsus-access">Palabra de acceso</label>
          <div><input id="pulsus-access" type="password" value={accessCode} onChange={(event) => { setAccessCode(event.target.value); setAccessError(""); }} autoComplete="current-password" autoFocus /><button type="submit">Abrir el campus →</button></div>
          <small className={accessError ? "is-error" : ""}>{accessError || "La palabra distingue mayúsculas y minúsculas por vos: podés escribirla como quieras."}</small>
        </form>
      </section>
    </main>
  );

  return (
    <main className="pf-original-shell">
      <iframe className="pf-original-frame" src={`/pulsus-fractum-original.html${hash}`} title="Pulsus Fractum · Escuela de Metalkimia" />
    </main>
  );
}
