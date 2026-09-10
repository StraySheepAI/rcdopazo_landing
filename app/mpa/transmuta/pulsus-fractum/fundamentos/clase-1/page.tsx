"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sections = ["Umbral", "Método", "Semiverdad", "La realidad", "El observador", "Laboratorio I", "Bitácora"];
const STORAGE_KEY = "pulsus-fundamentos-clase-1-state-v1";

type ClassState = {
  active: number;
  visited: number[];
  note: string;
  sample: string;
  observation: string;
  assumption: string;
  inference: string;
  alternative: string;
  completed: boolean;
};

const emptyClassState: ClassState = {
  active: 0,
  visited: [0],
  note: "",
  sample: "",
  observation: "",
  assumption: "",
  inference: "",
  alternative: "",
  completed: false,
};

export default function FundamentosClaseUnoPage() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState("");
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessError, setAccessError] = useState("");
  const [visited, setVisited] = useState<number[]>([0]);
  const [sample, setSample] = useState("");
  const [observation, setObservation] = useState("");
  const [assumption, setAssumption] = useState("");
  const [inference, setInference] = useState("");
  const [alternative, setAlternative] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = { ...emptyClassState, ...JSON.parse(saved) } as ClassState;
        setActive(Math.min(Math.max(state.active, 0), sections.length - 1));
        setVisited(state.visited);
        setNote(state.note);
        setSample(state.sample);
        setObservation(state.observation);
        setAssumption(state.assumption);
        setInference(state.inference);
        setAlternative(state.alternative);
        setCompleted(state.completed);
      } catch { /* Conserva la entrada aunque un guardado anterior esté dañado. */ }
    } else {
      setCompleted(window.localStorage.getItem("pulsus-fundamentos-clase-1") === "complete");
      setNote(window.localStorage.getItem("pulsus-fundamentos-clase-1-note") || "");
    }
    setHasAccess(window.sessionStorage.getItem("pulsus-campus-access") === "open");
    setAccessChecked(true);
  }, []);

  const unlockClass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bytes = new TextEncoder().encode(accessCode.trim().toUpperCase());
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const hashValue = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    if (hashValue === "53a262023ec1056f291cf2b332ffacbb2b790b9306ff9869e72c0d419d95e6eb") {
      window.sessionStorage.setItem("pulsus-campus-access", "open");
      setAccessError("");
      setHasAccess(true);
    } else setAccessError("La Escuela todavía no reconoce esa palabra.");
  };

  const persist = (changes: Partial<ClassState>) => {
    const state: ClassState = { active, visited, note, sample, observation, assumption, inference, alternative, completed, ...changes };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const goTo = (index: number) => {
    const nextVisited = Array.from(new Set([...visited, index])).sort((a, b) => a - b);
    setActive(index);
    setVisited(nextVisited);
    persist({ active: index, visited: nextVisited });
  };

  const saveField = (field: keyof Pick<ClassState, "note" | "sample" | "observation" | "assumption" | "inference" | "alternative">, value: string) => {
    if (field === "note") setNote(value);
    if (field === "sample") setSample(value);
    if (field === "observation") setObservation(value);
    if (field === "assumption") setAssumption(value);
    if (field === "inference") setInference(value);
    if (field === "alternative") setAlternative(value);
    persist({ [field]: value });
  };

  const finish = () => {
    const next = !completed;
    setCompleted(next);
    persist({ completed: next });
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
          <p>Grado I · Fundamentos</p>
          <h2>Fundamento I</h2>
          <div className="pf-classroom-progress"><i style={{ width: `${completed ? 100 : Math.max(12, ((active + 1) / sections.length) * 100)}%` }} /></div>
          <small>{completed ? "100% completada" : `${visited.length} de ${sections.length} tramos recorridos`}</small>
          <nav aria-label="Índice de la clase">
            {sections.map((section, index) => <button key={section} type="button" className={active === index ? "is-active" : ""} onClick={() => goTo(index)}><em>{String(index + 1).padStart(2, "0")}</em><span>{section}</span>{completed || visited.includes(index) ? <b>✓</b> : null}</button>)}
          </nav>
          <div className="pf-degree-mini" aria-label="Recorrido del Grado I"><p>Tu recorrido en el Grado I</p><div><b className="is-open">F1</b><i /><b>L1</b><i /><b>A1</b><i /><b>F2</b><i /><b>L2</b><i /><b>A2</b><i /><b>F3</b><i /><b>L3</b><i /><b>A3</b></div><small>Primera de nueve piezas · ciclo I</small></div>
          <div className="pf-classroom-resource"><span>Material de cursada</span><b>Cuaderno Vigilia I · para descargar, imprimir y subrayar</b><a href="/materiales/cuaderno-vigilia-1.pdf" download>Descargar cuaderno PDF ↓</a><Link href="/dima">Abrir el portal DIMA ↗</Link></div>
        </aside>

        <section className="pf-classroom-content">
          <div className="pf-classroom-eyebrow">Fundamento I · Vigilia</div>
          <h1>Antes de transformar,<br />hay que aprender a mirar.</h1>
          <blockquote>“Todo juicio es una semiverdad.”</blockquote>

          <section className="pf-classroom-media" aria-label="Recursos audiovisuales de la clase">
            <div><i aria-hidden="true">▶</i><span><small>Video de iniciación</small><b>El umbral de la clase</b><em>En preparación · aparecerá antes del primer tramo</em></span></div>
            <div><i aria-hidden="true">◎</i><span><small>Correspondencia audiovisual</small><b>Vigilia, juicio y observador</b><em>En preparación · material complementario</em></span></div>
          </section>

          <div className="pf-classroom-panel">
            {active === 0 && <article><p className="pf-lesson-label">Umbral de entrada</p><h2>El auto gris</h2><p>Un auto se cruza delante tuyo. Frenás. En cuestión de segundos, una maniobra se convierte en una persona: imprudente, egoísta, irresponsable. Quizás pelotudo.</p><p>Después aparece un dato nuevo: lleva a su hija al hospital. La maniobra no cambió. Tu realidad, probablemente, sí.</p><div className="pf-lesson-callout"><b>Pregunta inaugural</b><span>Si los hechos no cambiaron pero la realidad que experimentaste sí, ¿qué era exactamente aquello que estabas llamando realidad?</span></div><p>Este libro —y esta clase— empiezan ahí. La Metalkimia llama <b>Vigilia</b> a la capacidad de reconocer la forma desde la que estamos operando sin confundirla con aquello que observamos. Discernir es la operación. Vigilia es la capacidad.</p></article>}
            {active === 1 && <article><p className="pf-lesson-label">Método de investigación</p><h2>Cinco operaciones, no una respuesta</h2><p>No vemos la realidad de manera directa y terminada. La observamos desde una configuración y completamos permanentemente aquello que no sabemos. A lo largo de esta clase vamos a repetir cinco operaciones.</p><div className="pf-distinction-grid"><div><b>Observamos</b><span>¿Qué información tenemos efectivamente?</span></div><div><b>Asumimos</b><span>¿Qué tuvo que dar nuestro sistema por cierto para completar lo que faltaba?</span></div><div><b>Inferimos</b><span>¿Qué concluimos a partir de esa información?</span></div><div><b>Contrastamos</b><span>¿Qué sucede con nuestra conclusión cuando cambia una variable?</span></div><div><b>Discernimos</b><span>¿Qué pertenece a lo observado y qué apareció durante nuestra lectura?</span></div></div><div className="pf-lesson-callout"><b>Nota metalquímica</b><span>Conciencia sabe. Vigilia discierne. Se puede tener conciencia de que un juicio no es un hecho, y aun así no reconocerlo mientras está ocurriendo. Eso es tener información sin tener vigilia.</span></div></article>}
            {active === 2 && <article><p className="pf-lesson-label">Capítulo 1</p><h2>Todo juicio es una semiverdad</h2><p>Una persona no responde un mensaje. Dato disponible: fue enviado a las 18:07. A las 22:36 sigue sin respuesta. Eso es poco. Nuestro sistema puede producir bastante más: “No le interesa.” “Está enojada.” “Me está ignorando.” “Siempre hace lo mismo.” En cuatro horas y media pasamos de registrar una ausencia a disponer de una teoría completa sobre otro ser humano.</p><div className="pf-distinction-grid"><div><b>Observación</b><span>No recibí respuesta.</span></div><div><b>Supuesto</b><span>Vio el mensaje, tenía tiempo y decidió no responder.</span></div><div><b>Inferencia</b><span>No quiere responderme.</span></div><div><b>Juicio</b><span>No le importo.</span></div></div><p>Ahora incorporamos una variable: se quedó sin batería. Estaba conduciendo. O vio el mensaje y necesitaba distancia. Mismo dato inicial, realidades completamente distintas. No buscamos una explicación más correcta: buscamos comprobar que la primera tampoco era la realidad completa.</p><div className="pf-lesson-callout"><b>Semiverdad</b><span>No significa mitad verdad y mitad mentira. Es una configuración parcial que contiene información de aquello que observamos y de la forma desde la que lo observamos. El problema no es su parcialidad: es olvidar que es parcial.</span></div></article>}
            {active === 3 && <article><p className="pf-lesson-label">Capítulo 2</p><h2>La realidad no viene terminada</h2><p>Dos personas salen de la misma reunión. Una dice “salió excelente”. La otra: “fue un desastre”. Misma reunión, dos realidades. La conclusión fácil sería decir que cada uno tiene su verdad. No vamos a hacer eso: es demasiado cómodo.</p><p>¿Qué parte de ambas afirmaciones pertenece a la reunión y qué parte pertenece a quienes la observaron? Que nuestra experiencia esté mediada no significa que la realidad sea inventada. Hay una diferencia entre “no accedo a la totalidad de lo ocurrido” y “lo ocurrido es cualquier cosa que yo quiera creer”. La primera exige discernimiento. La segunda lo vuelve innecesario.</p><div className="pf-lesson-callout"><b>Forma</b><span>La forma no reemplaza aquello que existe. Es la configuración desde la que aquello que existe se vuelve disponible para un observador. Por eso dos observadores pueden encontrarse frente al mismo acontecimiento sin producir exactamente la misma lectura.</span></div><p>No necesitamos negar la realidad para admitir que nunca llegamos a ella sin nosotros.</p></article>}
            {active === 4 && <article><p className="pf-lesson-label">Capítulo 3</p><h2>El observador desaparecido</h2><p>“Es arrogante.” “Es manipuladora.” “Le encanta llamar la atención.” Prestá atención a la gramática: no parece haber ningún observador. Parece que describimos propiedades del objeto, como “la mesa mide ochenta centímetros”. Solo que no medimos nada.</p><p>Cuando decimos “me pareció arrogante”, el observador vuelve a aparecer. El acontecimiento no cambió. La persona tampoco. Cambió la arquitectura de la afirmación: ahora existe algo observado, alguien observando y una interpretación.</p><div className="pf-lesson-callout"><b>Fragmentación</b><span>Hay fragmentación cuando elementos de una configuración dejan de reconocerse en la relación que los produce y empiezan a funcionar como si pertenecieran enteramente a una de sus partes.</span></div><p>Cuando el observador desaparece del juicio, su interpretación puede empezar a parecer una propiedad del mundo. ¿Podemos volver a vernos dentro de aquello que estamos viendo? A esa capacidad la llamamos Vigilia.</p></article>}
            {active === 5 && <article><p className="pf-lesson-label">Laboratorio I</p><h2>No me creas todavía</h2><p>No es un examen. No hay respuestas correctas al final. La propuesta es verificar si podés encontrar el mecanismo fuera de estas páginas, en tu propia vida, durante las próximas veinticuatro horas.</p><ol><li><b>Capturá un juicio.</b> Elegí uno espontáneo, no intelectual: de esos que aparecen solos.</li><li><b>Conservá la muestra.</b> Escribilo exactamente como apareció, sin mejorarlo.</li><li><b>Separá.</b> ¿Qué observaste? ¿Qué asumiste? ¿Qué inferiste? ¿Qué juzgaste finalmente?</li><li><b>Alterá una variable.</b> Inventá un dato nuevo y posible. ¿Cambia tu juicio? No busques reemplazarlo por uno más lindo: comprobá cuánto dependía de información que no tenías.</li></ol><div className="pf-lab-fields"><label>La muestra<textarea value={sample} onChange={(event) => saveField("sample", event.target.value)} placeholder="El juicio, tal como apareció…" /></label><label>Lo que observé<textarea value={observation} onChange={(event) => saveField("observation", event.target.value)} placeholder="Solo información disponible…" /></label><label>Lo que asumí<textarea value={assumption} onChange={(event) => saveField("assumption", event.target.value)} placeholder="Lo que tuve que dar por cierto…" /></label><label>Lo que inferí<textarea value={inference} onChange={(event) => saveField("inference", event.target.value)} placeholder="La conclusión que apareció…" /></label><label className="wide">Una variable alternativa<textarea value={alternative} onChange={(event) => saveField("alternative", event.target.value)} placeholder="Un dato nuevo y posible que altere la lectura…" /></label></div><div className="pf-lesson-callout"><b>Resultado</b><span>Tu laboratorio se guarda automáticamente en este dispositivo. No concluyas nada todavía: vamos a necesitar esta muestra cuando empecemos a triangular.</span></div></article>}
            {active === 6 && <article><p className="pf-lesson-label">Integración I</p><h2>Lo que sabemos hasta ahora</h2><ol><li>Interpretar es inevitable.</li><li>Una interpretación puede ser correcta sin haber sido conocimiento cuando fue producida.</li><li>Nuestros juicios contienen información tanto de lo observado como del observador.</li><li>Podemos perder registro de esa composición.</li><li>Cuando eso ocurre, una semiverdad puede funcionar para nosotros como una verdad completa.</li></ol><p>Todo juicio es una semiverdad. No porque sea mitad verdadero y mitad falso, sino porque contiene una configuración que todavía no sabemos leer. Hasta acá aprendimos a reconocer que esa configuración existe. Discernirla es el paso siguiente.</p><label htmlFor="lesson-note">Mi fragmento</label><textarea id="lesson-note" value={note} onChange={(event) => saveField("note", event.target.value)} placeholder="Hoy pude distinguir que…"/><small>{note ? "Fragmento guardado automáticamente." : "Todavía no escribiste tu fragmento."}</small><div className="pf-correspondences"><p>Correspondencias de esta clase</p><div><span><b>Capacidad</b>Vigilia</span><span><b>Operación</b>Discernir</span><span><b>Materia</b>Juicio</span><span><b>Próxima apertura</b>Triangulación</span></div></div></article>}
          </div>

          <div className="pf-classroom-controls">
            <button type="button" disabled={active === 0} onClick={() => goTo(active - 1)}>← Anterior</button>
            {active < sections.length - 1 ? <button className="primary" type="button" onClick={() => goTo(active + 1)}>Guardar y continuar →</button> : <button className="primary" type="button" onClick={finish}>{completed ? "Reabrir la clase" : "Completar la clase ✓"}</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
