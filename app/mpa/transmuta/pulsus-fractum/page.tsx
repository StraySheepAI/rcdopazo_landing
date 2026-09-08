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
  const [heldPlate, setHeldPlate] = useState<string | null>(null);
  const [vigiliaStarted, setVigiliaStarted] = useState(false);

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
          <p>Escuela de Metalkimia · Campus Pulsus Fractum</p>
          <h1>Conocé la Escuela<br />Pulsus Fractum.</h1>
          <span>Una escuela para aprender a distinguir configuraciones, ampliar agencia y transformar experiencia en práctica.</span>
          <div>
            <button type="button" onClick={() => setView("agora")}>Visitar el Ágora</button>
            {mpaEntry ? <button className="school-campus-access-button" type="button" onClick={requestCampusAccess}>Acceso de cursantes</button> : <a href="#vigilia-abierta">Conocer la primera experiencia ↓</a>}
          </div>
        </div>

        <div className="school-arrival-portrait">
          <button type="button" onClick={() => setView("agora")} aria-label="Entrar al Ágora">
            <Image src="/pulsus-agora-interior-v1.png" alt="Interior del Ágora de la Escuela de Metalkimia" width={1680} height={945} priority />
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
          <button className="school-hotspot school-hotspot-custos school-hotspot-house" type="button" onClick={() => setPlace("custos")}><Image className="school-house-medallion" src="/simbolos-casas/custos-medallon-v2.png" alt="Símbolo de la Casa de Custos" width={724} height={724} /><span className="school-house-copy"><b>Casa de Custos</b><span>Observar y delimitar</span></span></button>
          <button className="school-hotspot school-hotspot-center" type="button" onClick={() => setLudusOpen(!ludusOpen)}><small>Experiencia abierta</small><b>Vigilia I</b><span>Entrar al círculo</span></button>
          <button className="school-hotspot school-hotspot-reconfigura school-hotspot-house" type="button" onClick={() => setPlace("reconfigura")}><Image className="school-house-medallion" src="/simbolos-casas/reconfiguradores-medallon-v2.png" alt="Símbolo de la Casa de Reconfiguradores" width={724} height={724} /><span className="school-house-copy"><b>Reconfiguradores</b><span>Intervenir y transformar</span></span></button>
          <button className="school-hotspot school-hotspot-book" type="button" onClick={() => setPlace("fundamentos")}><b>Libro de Fundamentos</b><span>Abrir el índice</span></button>
          <button className="school-hotspot school-hotspot-architect school-hotspot-house" type="button" onClick={() => setPlace("arquitectos")}><Image className="school-house-medallion" src="/simbolos-casas/architectus-medallon-v2.png" alt="Símbolo de la especialización Architectus" width={724} height={724} /><span className="school-house-copy"><b>Especialización Architectus</b><span>Integración · acceso posterior</span></span></button>
        </div>

        {ludusOpen && (
          <article className="school-ludus-threshold">
            <div className="school-ludus-sparks" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <Image className="school-ludus-emblem" src="/pulsus-fractum-shield-v6-warm.png" alt="Emblema de la Escuela de Metalkimia Pulsus Fractum" width={512} height={512} />
            <p>Experiencia abierta · Vigilia I</p>
            <h2>Hay más platos de los que podés sostener.</h2>
            <span className="school-ludus-lead">Una práctica breve de discernimiento para observar qué estás sosteniendo, qué costo tiene y qué elegirías cuidar si no pudieras mantenerlo todo.</span>
            <div className="school-ludus-path" aria-label="Recorrido de la experiencia"><span><b>1</b> Reconocer</span><i /><span><b>2</b> Elegir</span><i /><span><b>3</b> Registrar</span></div>
            {!vigiliaStarted ? (
              <button className="school-ludus-start" type="button" onClick={() => setVigiliaStarted(true)}>Comenzar la experiencia →</button>
            ) : (
              <div className="school-ludus-practice">
                <p>Primera observación</p>
                <h3>Si hoy sólo pudieras sostener uno, ¿cuál cuidarías primero?</h3>
                <div className="school-plates">
                  {["Tiempo", "Certeza", "Ayuda", "Movimiento"].map((plate) => <button className={heldPlate === plate ? "is-held" : ""} type="button" key={plate} onClick={() => setHeldPlate(plate)}>{plate}</button>)}
                </div>
                {heldPlate && <p className="school-ludus-response">Elegiste <b>{heldPlate}</b>. Ahora mirá qué dejarías de sostener para poder cuidarlo de verdad.</p>}
              </div>
            )}
            <small>Acceso libre · 5 minutos · No requiere conocimientos previos</small>
          </article>
        )}

        {place && (
          <div className="school-place-overlay" role="dialog" aria-modal="true" aria-label="Información del espacio">
            <article>
              <button className="school-place-close" type="button" onClick={() => setPlace(null)} aria-label="Cerrar">×</button>
              {place === "orientation" && <><p>Cartelera viva · niveles de acceso</p><h2>Elegí cómo acercarte</h2><span className="school-place-lead">Cada puerta responde a un nivel diferente. Podés vivir una experiencia abierta, solicitar una clave gratuita para Fundamentos o conocer los Pasajes que requieren inscripción.</span><div className="school-course-grid"><button onClick={() => { setPlace(null); setLudusOpen(true); }}><small>Nivel 0 · abierto</small><b>Vigilia I</b><em>Experiencia pública</em><span>Comenzar ahora →</span></button><button onClick={() => setPlace("fundamentos")}><small>Nivel 1 · gratuito con clave</small><b>Fundamentos</b><em>Clase, práctica y material</em><span>Ver el índice →</span></button><button onClick={() => setPlace("custos")}><small>Nivel 2 · recorrido pago</small><b>Custos</b><em>Acceso por inscripción</em><span>Conocer su propósito →</span></button><button onClick={() => setPlace("reconfigura")}><small>Nivel 2 · recorrido pago</small><b>Reconfiguración</b><em>Acceso por inscripción</em><span>Conocer su propósito →</span></button></div><div className="school-student-entry"><div><b>¿Tenés una clave activa?</b><span>La clave abre únicamente el contenido correspondiente a tu inscripción.</span></div><button onClick={requestCampusAccess}>Ingresar clave →</button></div></>}
              {place === "fundamentos" && <><p>Nivel 1 · gratuito con clave</p><h2>Fundamentos de Metalkimia</h2><span>El taller inicial ofrece una entrada formativa a Vigilia, discernimiento, capacidad y agencia. El índice puede visitarse; la clase, la práctica y el material se abren con una clave gratuita.</span><div className="school-depth"><b>Visitante</b><i>Puede conocer el índice y la propuesta</i><b>Con clave</b><i>Clase 1, práctica, bitácora y cuaderno</i></div><Link className="school-place-primary" href="/mpa/transmuta/pulsus-fractum/fundamentos/clase-1">Ingresar a Fundamentos · Clase 1 →</Link></>}
              {place === "custos" && <><p>Nivel 2 · Pasaje con inscripción</p><h2>Casa de Custos</h2><span>El camino de quienes aprenden a sostener el marco, cuidar el encuadre y reconocer dónde comienza y termina cada dominio antes de intervenir.</span><details className="school-path-fold"><summary><i>◐</i><span><small>Explorá tu afinidad</small><b>Este camino puede ser para vos si…</b></span></summary><div className="school-path-preview"><ul><li>Sos quien cuida que algo valioso no pierda su forma.</li><li>Antes de actuar, necesitás observar qué corresponde y qué no.</li><li>Te interesa aprender a poner límites sin cerrar posibilidades.</li></ul><div><b>Se entrena</b><span>Marco metodológico · Encuadre · Aion</span></div><p>No es una identidad fija. Custos es una capacidad que también puede convivir con la intervención y el diseño.</p></div></details><div className="school-depth"><b>Visitante</b><i>Puede reconocerse y conocer el propósito del Pasaje</i><b>Inscripto</b><i>Recibe acceso privado a prácticas y aulas</i></div><div className="school-seal-lock">◐ <b>El acceso no se abre desde la página pública</b></div></>}
              {place === "reconfigura" && <><p>Nivel 2 · Pasaje con inscripción</p><h2>Casa de Reconfiguradores</h2><span>El camino de quienes quieren intervenir sobre lo que ya existe: discernir relaciones, mover piezas y construir otra configuración posible junto a otros.</span><details className="school-path-fold"><summary><i>↯</i><span><small>Explorá tu afinidad</small><b>Este camino puede ser para vos si…</b></span></summary><div className="school-path-preview"><ul><li>Detectás con rapidez dónde algo quedó trabado o se repite.</li><li>Te atrae relacionar, espejar y probar movimientos para observar qué cambia.</li><li>Buscás alternativas con mayor capacidad de acción y expresión.</li><li>Querés construir algo nuevo junto al Aude, sin imponerle tu respuesta.</li></ul><div><b>Se entrena</b><span>Redirección metacognitiva · Relación · Espejado · Reconfiguración sistémica</span></div><p>No reemplaza al Custos: interviene dentro de un marco que alguien también debe poder sostener. Tampoco diseña por sí solo el Ludus completo.</p></div></details><div className="school-depth"><b>Visitante</b><i>Puede reconocerse y conocer el propósito del Pasaje</i><b>Inscripto</b><i>Recibe acceso privado a laboratorios y materiales</i></div><div className="school-seal-lock">↯ <b>El acceso no se abre desde la página pública</b></div></>}
              {place === "arquitectos" && <><p>Pasaje de integración</p><h2>Casa de Arquitectos</h2><span>El camino de quienes diseñan el dispositivo completo y articulan observación e intervención para que el sistema conserve correspondencia.</span><details className="school-path-fold"><summary><i>△</i><span><small>Explorá tu afinidad</small><b>Este camino puede ser para vos si…</b></span></summary><div className="school-path-preview"><ul><li>Pensás en relaciones, recorridos y sistemas completos.</li><li>Te interesa diseñar Ludus, Pasajes y estructuras de práctica.</li><li>Podés reconocer qué función cumple cada parte sin confundirlas.</li><li>Te importa que Custos y Reconfigurador operen con ritmo, correspondencia y propósito.</li></ul><div><b>Se entrena</b><span>Diseño de Ludus · Diseño de Pasajes · Integración · Configuraciones de intervención</span></div><p>No es un rango superior ni quien interviene en tiempo real: es otra contribución. El camino se revela después de haber habitado Custos y Reconfiguración.</p></div></details><div className="school-seal-lock">△ <b>Profundidad requerida</b></div><button className="school-place-primary" onClick={() => setPlace("orientation")}>Volver a la orientación →</button></>}
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
