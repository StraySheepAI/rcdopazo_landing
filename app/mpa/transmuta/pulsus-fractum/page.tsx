"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PulsusFractumPage() {
  const [hash, setHash] = useState("");
  const [view, setView] = useState<"arrival" | "agora" | "atlas">("arrival");
  const [ludusOpen, setLudusOpen] = useState(false);
  const [place, setPlace] = useState<"orientation" | "fundamentos" | "custos" | "reconfigura" | "arquitectos" | null>(null);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  if (view === "arrival") return (
    <main className="school-visitor">
      <div className="school-visitor-stars" aria-hidden="true" />
      <header className="school-visitor-header">
        <Link href="/">← R.C. Dopazo</Link>
        <span>Escuela de Metalkimia</span>
        <button type="button" onClick={() => setView("atlas")}>Ya estoy cursando</button>
      </header>

      <section className="school-campus-arrival">
        <div className="school-campus-copy">
          <p>Campus MPA · Visita abierta</p>
          <h1>No hace falta saber<br />qué camino elegir.</h1>
          <span>Entrá, recorré el Ágora y descubrí qué forma de aprender multiplica tu camino.</span>
          <div>
            <button type="button" onClick={() => setView("agora")}>Recorrer el Ágora</button>
            <a href="#vigilia-abierta">Vivir una experiencia abierta ↓</a>
          </div>
        </div>

        <div className="school-campus-scene" aria-label="Mapa vivo del Campus MPA">
          <i className="school-campus-path path-one" aria-hidden="true" />
          <i className="school-campus-path path-two" aria-hidden="true" />
          <i className="school-campus-path path-three" aria-hidden="true" />
          <button className="school-building school-building-agora" type="button" onClick={() => setView("agora")}>
            <Image src="/pulsus-fractum-shield-v6-warm.png" alt="" width={260} height={320} />
            <small>Todos comienzan aquí</small><strong>Ágora Pulsus</strong><em>Entrar</em>
          </button>
          <button className="school-building school-building-custos" type="button" onClick={() => setView("agora")}><b>◐</b><strong>Casa de Custos</strong><small>Observar · delimitar</small></button>
          <button className="school-building school-building-reconfigura" type="button" onClick={() => setView("agora")}><b>↯</b><strong>Casa de Reconfiguradores</strong><small>Intervenir · transformar</small></button>
          <button className="school-building school-building-architectus" type="button" onClick={() => setView("agora")}><b>△</b><strong>Casa de Arquitectos</strong><small>Diseñar · integrar</small></button>
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
        <button type="button" onClick={() => { setHash("#campus"); setView("atlas"); }}>Abrir mapa</button>
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
              {place === "orientation" && <><p>Cartelera viva · acceso académico</p><h2>Elegí cómo entrar</h2><span className="school-place-lead">La magia del campus y la estructura de una escuela, juntas. Acá podés descubrir la propuesta, comenzar gratis o continuar tu recorrido.</span><div className="school-course-grid"><button onClick={() => { setPlace(null); setLudusOpen(true); }}><small>Abierto · gratuito</small><b>Vigilia I</b><em>1 experiencia</em><span>Comenzar ahora →</span></button><button onClick={() => setPlace("fundamentos")}><small>Programa inicial</small><b>Fundamentos</b><em>10 fundamentos</em><span>Ver programa →</span></button><button onClick={() => setPlace("custos")}><small>Pasaje formativo</small><b>Custos</b><em>Acceso por inscripción</em><span>Conocer recorrido →</span></button><button onClick={() => setPlace("reconfigura")}><small>Pasaje formativo</small><b>Reconfiguración</b><em>Acceso por inscripción</em><span>Conocer recorrido →</span></button></div><div className="school-student-entry"><div><b>¿Ya estás cursando?</b><span>Entrá a tus clases, materiales y bitácora.</span></div><button onClick={() => setView("atlas")}>Abrir mi espacio →</button></div></>}
              {place === "fundamentos" && <><p>Biblioteca común · orientación</p><h2>Fundamentos de Metalquimia</h2><span>Diez fundamentos para distinguir cambio, función, vigilia, agencia y reconfiguración. Podés conocer el índice antes de iniciar un Pasaje.</span><div className="school-depth"><b>Visitante</b><i>Vista general disponible</i><b>Iniciado</b><i>Clases, prácticas y bitácora</i></div><button className="school-place-primary" onClick={() => setLudusOpen(true)}>Comenzar por Vigilia I →</button></>}
              {place === "custos" && <><p>Casa · Pasaje de observación</p><h2>Custos</h2><span>Aprender a distinguir qué ocurre, qué corresponde y dónde termina cada dominio antes de intervenir.</span><div className="school-depth"><b>Visitante</b><i>Podés conocer su propósito</i><b>En Pasaje</b><i>Prácticas y aulas disponibles</i></div><button className="school-place-primary" onClick={() => setView("atlas")}>Ya curso: abrir mi acceso →</button></>}
              {place === "reconfigura" && <><p>Casa · Pasaje de intervención</p><h2>Reconfiguradores</h2><span>Explorar configuraciones, alternativas y movimientos capaces de producir otra forma posible.</span><div className="school-depth"><b>Visitante</b><i>El umbral puede recorrerse</i><b>En Pasaje</b><i>Laboratorios y materiales</i></div><button className="school-place-primary" onClick={() => setView("atlas")}>Ya curso: abrir mi acceso →</button></>}
              {place === "arquitectos" && <><p>Pasaje de integración</p><h2>Casa de Arquitectos</h2><span>No está cerrada por jerarquía: se revela cuando la experiencia en Custos y Reconfiguración permite integrar sistemas completos.</span><div className="school-seal-lock">△ <b>Profundidad requerida</b></div><button className="school-place-primary" onClick={() => setPlace("orientation")}>Volver a la orientación →</button></>}
            </article>
          </div>
        )}
      </section>
    </main>
  );

  return (
    <main className="pf-original-shell">
      <iframe className="pf-original-frame" src={`/pulsus-fractum-original.html${hash}`} title="Pulsus Fractum · Escuela de Metalkimia" />
    </main>
  );
}
