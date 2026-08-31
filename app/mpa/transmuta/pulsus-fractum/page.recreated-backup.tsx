"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";

const publicTerritories = [
  {
    mark: "01",
    title: "Principios",
    text: "El lema, la arquitectura triangular y la columna vertebral de la Escuela.",
  },
  {
    mark: "02",
    title: "Dominios",
    text: "Los territorios donde las configuraciones se manifiestan y pueden observarse.",
  },
  {
    mark: "03",
    title: "Pasajes",
    text: "Recorridos vivos que enlazan comprensión, experiencia y transformación.",
  },
  {
    mark: "04",
    title: "Formaciones",
    text: "Los caminos disponibles para aprender y habitar la Metalkimia.",
  },
];

const schoolDoors = [
  { number: "01", short: "Construye sobre", title: "Construye sobre lo que ya edificaste.", lead: "La transformación no parte de la nada: reconoce lo construido y lo convierte en materia prima." },
  { number: "02", short: "Pon tu juicio", title: "Pon tu juicio primero.", lead: "Antes de obedecer mapas ajenos, ejercés criterio propio." },
  { number: "03", short: "Aprende de lo que multiplica", title: "Aprende de lo que multiplica tu camino.", lead: "Observá qué expande la experiencia y qué vuelve fértil el recorrido." },
  { number: "04", short: "No estamos aquí para juzgar", title: "No estamos aquí para juzgar.", lead: "La observación abre alternativas allí donde el juicio clausura posibilidades." },
];

const passages = [
  ["I", "Pasaje de Vigilia", "Aprender a observar con distinción."],
  ["II", "Pasaje de Agencia", "Desarrollar agencia efectiva."],
  ["III", "Pasaje de Configuración", "Distinguir y comprender configuraciones sistémicas."],
  ["IV", "Pasaje de Ludus", "Entrenar en el diseño y práctica de Ludus."],
  ["V", "Pasaje de Pulsus", "Integrar las tres especializaciones."],
] as const;

function AtlasGlobe({ className, icon, label, description, onActivate, onFocusLine }: { className: string; icon: string; label: string; description: string; onActivate?: () => void; onFocusLine: (active: boolean) => void }) {
  const [travel, setTravel] = useState(0);
  const drag = useRef({ x: 0, y: 0, travel: 0, moved: false });
  const axis = className.includes('mpa') ? [0, 1] : className.includes('ludus') ? [0, -1] : className.includes('school') ? [-.72, .7] : className.includes('passages') ? [-.72, -.7] : className.includes('aude') ? [.72, .7] : [.72, -.7];
  return (
    <div
      className={`pf-atlas-node ${className}`}
      style={{ '--node-travel': `${travel}px` } as CSSProperties}
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onMouseEnter={() => onFocusLine(true)}
      onMouseLeave={() => onFocusLine(false)}
      onFocus={() => onFocusLine(true)}
      onBlur={() => onFocusLine(false)}
      onPointerDown={(event) => { drag.current = { x: event.clientX, y: event.clientY, travel, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); onFocusLine(true); }}
      onPointerMove={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; const delta = (event.clientX - drag.current.x) * axis[0] + (event.clientY - drag.current.y) * axis[1]; if (Math.abs(delta) > 3) drag.current.moved = true; setTravel(Math.max(0, Math.min(105, drag.current.travel + delta))); }}
      onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); onFocusLine(false); if (!drag.current.moved) onActivate?.(); }}
      onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onActivate) onActivate(); }}
    ><b>{icon}</b><span>{label}</span><small className="pf-globe-tooltip"><strong>{label}</strong>{description}{onActivate && <em>Presioná para entrar</em>}</small></div>
  );
}

export default function PulsusFractumPage() {
  const [atlasView, setAtlasView] = useState<'cosmogram' | 'school' | 'passages'>('cosmogram');
  const [activeGlobe, setActiveGlobe] = useState<string | null>(null);
  const [openDoor, setOpenDoor] = useState<(typeof schoolDoors)[number] | null>(null);
  const [campusLogin, setCampusLogin] = useState(false);
  const [agencyPassage, setAgencyPassage] = useState(false);
  return (
    <main className="pf-school">
      <div className="pf-school-stars" aria-hidden="true" />
      <header className="pf-school-header">
        <Link href="/mpa/portal">← Universo MPA</Link>
        <span>Transmuta · Escuela de Metalkimia</span>
        <Link href="/mpa/transmuta">Volver a Transmuta</Link>
      </header>

      <section className="pf-school-hero">
        <p className="pf-school-kicker">Has atravesado la puerta de Transmuta</p>
        <div className="pf-school-shield">
          <div className="pf-school-shield-aura" aria-hidden="true" />
          <Image
            src="/pulsus-fractum-shield.png"
            alt="Escudo de Pulsus Fractum · Evigila, Lude, Transmuta"
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 600px) 250px, 340px"
          />
        </div>
        <h1>Pulsus Fractum</h1>
        <p className="pf-school-subtitle">Escuela de Metalkimia · Atlas Vivo</p>
        <p className="pf-school-intro">
          Un territorio de formación donde la experiencia se vuelve campo de observación,
          juego y reconfiguración.
        </p>
      </section>

      <section className="pf-atlas" aria-labelledby="cosmogram-title">
        <aside className="pf-atlas-nav">
          <strong>Atlas Vivo</strong>
          {['Cosmograma','Escuela','Dominios','Pasajes','Ludus','Iteración','Pulsus','Campus','Aude','Laboratorio'].map((item, i) => (
            <button className={(atlasView === 'cosmogram' && i === 0) || (atlasView === 'school' && i === 1) || (atlasView === 'passages' && i === 3) ? 'active' : ''} key={item} onClick={() => i === 0 ? setAtlasView('cosmogram') : i === 1 ? setAtlasView('school') : i === 3 ? setAtlasView('passages') : undefined}><i>{i === 0 ? '◉' : '◇'}</i>{item}</button>
          ))}
        </aside>
        <div className="pf-atlas-stage">
          <div className="pf-atlas-orbits" aria-hidden="true" />
          <svg className={`pf-atlas-lines active-${activeGlobe ?? 'none'}`} viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
            <path className="perimeter" d="M600 30 L1056 137 L1056 623 L600 730 L144 623 L144 137 Z" />
            <path className="radial line-mpa" d="M600 30 L600 380" /><path className="radial line-school" d="M1056 137 L600 380" />
            <path className="radial line-passages" d="M1056 623 L600 380" /><path className="radial line-ludus" d="M600 730 L600 380" />
            <path className="radial line-pulsus" d="M144 623 L600 380" /><path className="radial line-aude" d="M144 137 L600 380" />
            <circle className="marker marker-mpa" cx="600" cy="30" r="7" /><circle className="marker marker-school" cx="1056" cy="137" r="7" />
            <circle className="marker marker-passages" cx="1056" cy="623" r="7" /><circle className="marker marker-ludus" cx="600" cy="730" r="7" />
            <circle className="marker marker-pulsus" cx="144" cy="623" r="7" /><circle className="marker marker-aude" cx="144" cy="137" r="7" />
          </svg>

          <AtlasGlobe className="node-mpa" icon="◈" label="MPA" description="Universo de correspondencias" onFocusLine={active => setActiveGlobe(active ? 'mpa' : null)} />
          <AtlasGlobe className="node-aude" icon="◉" label="Aude" description="Participante del Ludus" onFocusLine={active => setActiveGlobe(active ? 'aude' : null)} />
          <AtlasGlobe className="node-school" icon="◇" label="Escuela" description="Sistema triangular de correspondencia fractal" onActivate={() => setAtlasView('school')} onFocusLine={active => setActiveGlobe(active ? 'school' : null)} />
          <AtlasGlobe className="node-pulsus" icon="⌁" label="Pulsus" description="Unidad de intervención" onFocusLine={active => setActiveGlobe(active ? 'pulsus' : null)} />
          <AtlasGlobe className="node-ludus" icon="⚄" label="Ludus" description="Jugar para integrar" onFocusLine={active => setActiveGlobe(active ? 'ludus' : null)} />
          <AtlasGlobe className="node-passages" icon="⌂" label="Pasajes" description="Recorridos vivos" onActivate={() => setAtlasView('passages')} onFocusLine={active => setActiveGlobe(active ? 'passages' : null)} />

          <div className="pf-atlas-chamber chamber-left">
            <small>Cámaras</small>
            <button className={atlasView === 'school' ? 'active' : ''} onClick={() => setAtlasView('school')}><b>Escuela</b>Sistema triangular de correspondencia fractal</button>
            <span><b>Dominios</b>Dónde ocurre la práctica</span>
            <span><b>Pasajes</b>Recorridos vivos</span>
            <span><b>Ludoteca</b>Jugar para integrar</span>
          </div>

          <div className="pf-atlas-core">
            <p>Campus Pulsus</p><Image className="pf-atlas-mpa-logo" src="/mpa-atlas-logo.png" alt="MPA" width={1024} height={1024} /><small>Metalkimia</small>
            <h2 id="cosmogram-title">No observo problemas.<br />Observo configuraciones.</h2>
            <b>Evigila · Lude · Transmuta</b>
          </div>

          <div className="pf-atlas-chamber chamber-right">
            <small>Instrumentos</small>
            <span><b>Pulsus</b>Unidad de intervención</span>
            <span><b>Glosario</b>Lengua del sistema</span>
            <span><b>Iteración</b>Unidad mínima del sistema</span>
            <span><b>Campus</b>Casas de aprendizaje</span>
            <span><b>Módulos</b>Expansión del mapa</span>
          </div>
        </div>
      </section>

      {atlasView === 'school' && (
        <section className="pf-school-chamber" aria-labelledby="school-chamber-title">
          <header><span>②</span><h2 id="school-chamber-title">Escuela</h2><button onClick={() => setAtlasView('cosmogram')}>← Volver al Cosmograma</button></header>
          <div className="pf-four-doors">
            <div className="pf-four-orbits" aria-hidden="true" />
            <div className="pf-four-center"><small>Sello de Escuela</small><strong>Pulsus<br />Fractum</strong><em>Evigila · Lude · Transmuta</em><b>Las cuatro puertas</b></div>
            {schoolDoors.map((door, index) => (
              <button className={`pf-door door-${index + 1}`} key={door.number} onClick={() => setOpenDoor(door)}><span>{door.number}</span><b>{door.short}</b><em>{door.title.replace(door.short, '').trim()}</em></button>
            ))}
          </div>

          <div className="pf-school-foundations">
            <article><small>Principio de refinamiento</small><p>La transformación no parte de la nada. Parte de reconocer lo que ya está construido y refinarlo.</p></article>
            <article><small>Naturaleza fractal</small><p>Todo puede ser observado como sistema o subsistema dependiendo del nivel de observación.</p></article>
            <article className="pf-school-backbone"><small>Columna vertebral</small><div><span>Vigilia</span><i>→</i><span>Distinción</span><i>→</i><span>Correspondencia</span><i>→</i><span>Agencia efectiva</span><i>→</i><span>Configuración</span><i>→</i><span>Transmutación</span><i>→</i><span>Potentia</span><i>→</i><span>Iteración</span></div></article>
            <article className="pf-mini-campus"><small>Campus</small><p>El Campus es el territorio de recorrido. En Escuela aparece como mapa reducido; al entrar se vuelve espacio explorable.</p><div><span>Architectus</span><span>Custos</span><b>Pulsus</b><span>Reconfigura</span></div><button onClick={() => setCampusLogin(true)}>Entrar al Campus</button></article>
          </div>
        </section>
      )}

      {atlasView === 'passages' && (
        <section className="pf-passages-overlay" aria-labelledby="passages-title">
          <header><span>④</span><h2 id="passages-title">Pasajes del Sistema</h2><button onClick={() => setAtlasView('cosmogram')}>× Cerrar</button></header>
          <p>Recorridos progresivos que profundizan la comprensión y la práctica de la Metalkimia.</p>
          <div className="pf-passages-grid">{passages.map((passage, index) => <button className={`pf-passage-card ${index === 1 ? 'available' : 'locked'}`} key={passage[1]} onClick={() => index === 1 && setAgencyPassage(true)} disabled={index !== 1}><i>{passage[0]}</i><b>⌂</b><strong>{passage[1]}</strong><span>{passage[2]}</span>{index !== 1 && <em>Acceso desde el Campus</em>}</button>)}</div>
        </section>
      )}

      {agencyPassage && (
        <div className="pf-door-modal" role="dialog" aria-modal="true" onClick={() => setAgencyPassage(false)}><article onClick={event => event.stopPropagation()}><button className="pf-modal-close" onClick={() => setAgencyPassage(false)}>×</button><small>Cámara del Atlas</small><h2>Pasaje de Agencia</h2><p>Desarrollar agencia efectiva.</p><div className="pf-agency-public"><article><b>Contenido revelado</b><span>Tipos de agencia · Juicios funcionales · Eficacia · Eficiencia · Toma de decisión</span></article><article><b>Correspondencias</b><span>Vigilia · Pulsus</span></article><article><b>Uso metalkímico</b><span>Reconocer alternativas, elegir y actuar sobre la configuración observable.</span></article><article><b>Movimiento sugerido</b><span>Primero distinguí. Después elegí. Recién ahí transmutá.</span></article></div></article></div>
      )}

      {openDoor && (
        <div className="pf-door-modal" role="dialog" aria-modal="true" aria-labelledby="door-modal-title" onClick={() => setOpenDoor(null)}>
          <article onClick={(event) => event.stopPropagation()}><button className="pf-modal-close" onClick={() => setOpenDoor(null)}>×</button><small>Cámara del Atlas</small><h2 id="door-modal-title">{openDoor.title}</h2><p>{openDoor.lead}</p><div className="pf-locked-revelation"><span>Contenido revelado</span><span>Correspondencias</span><span>Uso metalkímico</span><span>Movimiento sugerido</span><b>Contenido reservado al Campus</b></div></article>
        </div>
      )}

      {campusLogin && (
        <div className="pf-door-modal" role="dialog" aria-modal="true" aria-labelledby="campus-login-title" onClick={() => setCampusLogin(false)}>
          <article className="pf-login-modal" onClick={(event) => event.stopPropagation()}><button className="pf-modal-close" onClick={() => setCampusLogin(false)}>×</button><small>Umbral reservado</small><h2 id="campus-login-title">Acceso al Campus</h2><p>Para habitar las casas, prácticas y materiales necesitás una llave.</p><input type="password" placeholder="Tu llave de acceso" disabled /><button disabled>Abrir el Campus</button><em>La llave será definida antes de abrir el Campus.</em></article>
        </div>
      )}

      <section className="pf-school-map">
        <p className="pf-school-section-kicker">Territorios abiertos</p>
        <h2>La Escuela se conoce antes de ingresar al Campus.</h2>
        <p className="pf-school-map-intro">
          Estos contenidos forman parte pública de Pulsus Fractum. La llave no los oculta:
          permite pasar de observar el sistema a habitar su formación.
        </p>
        <div className="pf-school-map-grid">
          {publicTerritories.map((territory) => (
            <article key={territory.title}>
              <span>{territory.mark}</span><h3>{territory.title}</h3><p>{territory.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pf-campus-gate" aria-labelledby="campus-title">
        <div className="pf-campus-gate-symbol" aria-hidden="true"><span>PF</span></div>
        <p className="pf-school-section-kicker">Umbral reservado</p>
        <h2 id="campus-title">Campus Pulsus Fractum</h2>
        <p className="pf-campus-gate-copy">
          La llave abre las herramientas y experiencias internas de formación. El Atlas permanece
          visible; el Campus guarda la práctica completa y el recorrido de cada estudiante.
        </p>
        <div className="pf-campus-protected">
          <span>Ludoteca y Ludus</span><span>Loop de intervención</span><span>Glosario técnico</span>
          <span>Módulos y clases</span><span>Prácticas</span><span>Registros personales</span>
        </div>
        <div className="pf-campus-access" aria-label="Acceso al Campus en preparación">
          <input type="password" placeholder="Tu llave de acceso" disabled />
          <button type="button" disabled>Abrir el Campus</button>
        </div>
        <small>La llave será definida antes de abrir el Campus.</small>
      </section>

      <footer className="pf-school-footer">
        <span>Evigila</span><i>·</i><span>Lude</span><i>·</i><span>Transmuta</span>
      </footer>
    </main>
  );
}
