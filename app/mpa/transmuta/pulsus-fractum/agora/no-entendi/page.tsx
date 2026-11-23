"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const ACCESS_HASH = "b6c06f8cda124de6de5c7969f49e1c572392a772b2f1b8a6c7fca63df54b6ca4";
const STORAGE_KEY = "pulsus-no-entendi-nivel-1-v1";
const ANCHOR = "Hablé lo del espacio. En realidad no era como pensábamos, pero ya quedó. Igual después vemos con Juan porque capaz conviene hacerlo distinto.";
const EXIT_CASE = "Ya está lo de mañana. Fijate si podés dejar eso listo, así no volvemos con lo mismo.";

const units = [
  ["Primera lectura", "Cuánto trabajo hiciste vos"],
  ["Comprender", "El trabajo que no se ve"],
  ["Distinguir", "Lo que agrego al mensaje"],
  ["Intervenir", "Hacer un pedido que sirva"],
  ["Recalibrar", "Mirar otra vez"],
  ["Practicar", "Llevarlo a una conversación"],
] as const;

type AnswerMap = Record<string, string>;
type WorkshopState = { active: number; visited: number[]; answers: AnswerMap; completed: boolean };
const initialState: WorkshopState = { active: 0, visited: [0], answers: {}, completed: false };

const promptsA = [
  ["a_know", "¿Qué sé?", "Escribí solamente lo que está efectivamente dicho u observado."],
  ["a_understand", "¿Qué entendí?", "Registrá tu lectura actual, sin buscar la respuesta correcta."],
  ["a_complete", "¿Qué estoy completando yo?", "Señalá lo que agregaste para que el mensaje funcione."],
  ["a_need", "¿Qué necesito que el otro aporte?", "Anotá qué dato, decisión o reformulación te permitiría continuar."],
] as const;

const promptsB = [
  ["b_know", "¿Qué sé?", "¿Qué está efectivamente dicho u observado? ¿Qué información no tengo?"],
  ["b_understand", "¿Qué entendí?", "¿Qué entendiste realmente y qué alcance tiene esa lectura?"],
  ["b_complete", "¿Qué estoy completando yo?", "¿Qué parte agregaste desde tu historia, expectativa o hipótesis?"],
  ["b_need", "¿Qué necesito que el otro aporte?", "¿Qué dato, decisión o reformulación necesitás para continuar?"],
  ["b_intervention", "¿Cuál es la intervención mínima suficiente que puedo hacer ahora?", "Escribí una frase que puedas decir o enviar."],
] as const;

const cases = {
  pedido: {
    title: "El pedido que falta",
    message: "Te mandé lo del taller. Miralo cuando puedas, así avanzamos.",
    context: "El receptor revisa el programa, cambia los textos y propone otra fecha. El emisor responde: “Solo quería que me confirmaras si podías venir”.",
  },
  explicacion: {
    title: "La explicación que traslada el trabajo",
    message: "¿El encuentro es presencial o por videollamada? — Cuando empezamos a diseñar el programa pensamos varias alternativas…",
    context: "La explicación continúa, pero la pregunta por la modalidad sigue pendiente.",
  },
  tono: {
    title: "La lectura de un tono",
    message: "Le mandé la propuesta y respondió ‘ok’. Como ya sé que cuando está así se enoja, voy a mandarle otro audio explicando por qué la hice de esa manera.",
    context: "Separá el mensaje recibido, la interpretación y la decisión que apareció después.",
  },
} as const;

const interventions = [
  "No entendí. ¿Podés decirlo de otra manera?",
  "Entendí cómo llegamos hasta acá. No entendí qué hacemos ahora.",
  "Entendí lo que pasó. ¿Qué necesitás que haga yo?",
  "¿Querés que te dé mi mirada o que confirme una opción?",
  "¿Para cuándo necesitás mi respuesta?",
  "Estoy interpretando que preferís postergarlo. ¿Es eso o entendí otra cosa?",
  "Con lo que tengo todavía no puedo elegir. Me falta saber el costo final.",
];

export default function NoEntendiPage() {
  const [state, setState] = useState<WorkshopState>(initialState);
  const [ready, setReady] = useState(false);
  const [access, setAccess] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) try { setState({ ...initialState, ...JSON.parse(saved) }); } catch { /* Empieza con una ficha limpia. */ }
    setAccess(window.sessionStorage.getItem("pulsus-campus-access") === "open");
    setReady(true);
  }, []);

  const save = (next: WorkshopState) => { setState(next); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const answer = (key: string, value: string) => save({ ...state, answers: { ...state.answers, [key]: value } });
  const go = (active: number) => {
    const visited = Array.from(new Set([...state.visited, active])).sort((a, b) => a - b);
    save({ ...state, active, visited });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code.trim().toUpperCase()));
    const hash = Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    if (hash === ACCESS_HASH) { window.sessionStorage.setItem("pulsus-campus-access", "open"); setAccess(true); setError(""); }
    else setError("La Escuela todavía no reconoce esa palabra.");
  };
  const progress = state.completed ? 100 : Math.round(((state.active + 1) / units.length) * 100);
  const answered = useMemo(() => Object.values(state.answers).filter(value => value.trim()).length, [state.answers]);

  const download = () => {
    const lines = ["NO ENTENDÍ · NIVEL 1", "Entre explicar demasiado y hacer adivinar", "", `Fecha: ${new Date().toLocaleDateString("es-AR")}`, ""];
    const add = (title: string, keys: readonly (readonly [string, string, string])[]) => {
      lines.push(title.toUpperCase(), "");
      keys.forEach(([key, prompt]) => lines.push(prompt, state.answers[key] || "—", ""));
    };
    add("Ficha A · Primera lectura", promptsA);
    add("Ficha B · Segunda lectura y recalibración", promptsB);
    lines.push("COMPARACIÓN", "¿Qué cambió sin que cambiara el mensaje?", state.answers.comparison || "—", "");
    lines.push("MAPA DE CALIBRACIÓN", `Objetivo: ${state.answers.map_goal || "—"}`, `Dato: ${state.answers.map_data || "—"}`, `Inferencia: ${state.answers.map_inference || "—"}`, `Hueco relevante: ${state.answers.map_gap || "—"}`, `Intervención: ${state.answers.map_move || "—"}`, "");
    lines.push("DESAFÍO DE SALIDA", `Dato: ${state.answers.exit_data || "—"}`, `Inferencia: ${state.answers.exit_inference || "—"}`, `Hueco: ${state.answers.exit_gap || "—"}`, `Intervención: ${state.answers.exit_move || "—"}`, "", `Mi señal de sobreprocesamiento es: ${state.answers.signal || "—"}`, `Mi próximo movimiento a probar es: ${state.answers.next_move || "—"}`);
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "no-entendi-mi-recorrido.txt"; anchor.click(); URL.revokeObjectURL(url);
  };

  if (!ready) return <main className={styles.loading} />;
  if (!access) return <main className={styles.gate}><div className={styles.stars}/><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← Volver al Ágora</Link><section><div className={styles.seal}>PF</div><p>Taller de comunicación · Nivel 1</p><h1>No entendí</h1><span>El recorrido presencial y sus fichas de práctica pertenecen al espacio de cursantes.</span><form onSubmit={unlock}><label htmlFor="no-entendi-code">Palabra de acceso</label><div><input id="no-entendi-code" type="password" value={code} onChange={event => { setCode(event.target.value); setError(""); }} autoFocus/><button type="submit">Abrir el taller</button></div><small className={error ? styles.error : ""}>{error || <>Clave de revisión: <b>NOENTENDI</b></>}</small></form></section></main>;

  return <main className={styles.workshop}>
    <header className={styles.header}><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">Volver al Ágora</Link><span>Escuela de Metalkimia · Pulsus Fractum</span><b>{state.completed ? "Taller completado" : "Progreso guardado"}</b></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <p>Comunicación · Nivel 1</p><h2>No entendí</h2><span>Entre explicar demasiado y hacer adivinar</span>
        <div className={styles.progress}><i style={{ width: `${progress}%` }}/></div><small>{progress}% · {answered} respuestas guardadas</small>
        <nav aria-label="Unidades del taller">{units.map(([short, title], index) => <button type="button" key={short} className={state.active === index ? styles.active : ""} onClick={() => go(index)}><em>{String(index + 1).padStart(2, "0")}</em><span><b>{short}</b><small>{title}</small></span>{state.visited.includes(index) && <i>✓</i>}</button>)}</nav>
        <div className={styles.hybrid}><b>Taller presencial + campus</b><span>Traé una conversación que te haya dejado trabajando de más. Compartirla es optativo.</span></div>
      </aside>

      <section className={styles.content}>
        <div className={styles.hero}><div><p>Clase práctica MPA · Nivel 1</p><h1>No entendí</h1><strong>Entre explicar demasiado<br/>y hacer adivinar</strong></div><div><span>Objetivo de la experiencia</span><blockquote>Aprendé a calibrar tus conversaciones sin cargar con más procesamiento del que te corresponde.</blockquote><small>90–120 minutos en campus · 120 minutos en taller</small></div></div>

        <div className={styles.unitHeading}><span>Unidad {state.active + 1} de {units.length}</span><h2>{units[state.active][1]}</h2></div>

        {state.active === 0 && <UnitOne answers={state.answers} answer={answer}/>} 
        {state.active === 1 && <UnitTwo answers={state.answers} answer={answer}/>} 
        {state.active === 2 && <UnitThree answers={state.answers} answer={answer}/>} 
        {state.active === 3 && <UnitFour answers={state.answers} answer={answer}/>} 
        {state.active === 4 && <UnitFive answers={state.answers} answer={answer}/>} 
        {state.active === 5 && <UnitSix answers={state.answers} answer={answer}/>} 

        <footer className={styles.controls}><button type="button" disabled={state.active === 0} onClick={() => go(state.active - 1)}>Anterior</button>{state.active < units.length - 1 ? <button type="button" className={styles.primary} onClick={() => go(state.active + 1)}>Guardar y continuar</button> : <div className={styles.finalActions}><button type="button" onClick={download}>Descargar mis respuestas</button><button type="button" onClick={() => window.print()}>Imprimir</button><button type="button" className={styles.primary} onClick={() => save({ ...state, completed: !state.completed })}>{state.completed ? "Reabrir práctica" : "Completar taller"}</button></div>}</footer>
      </section>
    </div>
  </main>;
}

function UnitOne({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <section className={styles.intro}><p>¿Terminás una conversación y seguís trabajando después? Repasás lo que te dijeron, completás lo que falta o mandás otra explicación por las dudas.</p><p>En esta clase vas a observar ese trabajo y practicar cómo distribuirlo mejor.</p></section>
  <Field label="Registro breve de apertura" hint="Pensá en una conversación que terminó, pero vos seguiste procesando. ¿Qué hiciste: releer, explicar, completar, anticipar o preguntar?" value={answers.opening} onChange={value => answer("opening", value)}/>
  <Anchor/>
  <div className={styles.promptGrid}>{promptsA.map(([key, label, hint]) => <Field key={key} label={label} hint={hint} value={answers[key]} onChange={value => answer(key, value)}/>)}</div>
  <Note title="Antes de seguir">Conservamos esta primera lectura sin corregirla. Las herramientas aparecen después para que al final puedas observar qué cambió en tu proceso.</Note>
  </div>; }

function UnitTwo({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <section><p>Para comprender hacemos trabajo: retenemos información, conectamos ideas, buscamos contexto y decidimos qué responder. Si tengo que reconstruir a qué te referís, adivinar qué necesitás y recordar tres acuerdos a la vez, el trabajo crece.</p><Note title="Distribuir el trabajo de comprensión">Compartida no significa mitad y mitad. La pregunta es si el reparto permite comprender y actuar en estas condiciones.</Note></section>
  <Exercise title="Microejercicio" message="Después vemos si hacemos la reunión."><Field label="Dato" hint="¿Qué está efectivamente dicho?" value={answers.micro_data} onChange={value => answer("micro_data", value)}/><Field label="Inferencia" hint="¿Qué lectura aparece?" value={answers.micro_inference} onChange={value => answer("micro_inference", value)}/><Field label="Hueco y pregunta" hint="¿Qué falta y cómo podrías pedirlo?" value={answers.micro_gap} onChange={value => answer("micro_gap", value)}/></Exercise>
  <section><h3>Elegir el grado que sirve ahora</h3><p>El punto útil puede estar lejos del medio. Para acordar una hora puede alcanzar una línea; para enseñar una tarea nueva puede hacer falta una demostración y una comprobación.</p><blockquote className={styles.question}>¿Qué grado de procesamiento necesita esta conversación, en este vínculo, con este objetivo y en este momento?</blockquote></section>
  <div className={styles.promptGrid}><Field label="Cuando temo no ser entendida o entendido, tiendo a…" value={answers.when_explain} onChange={value => answer("when_explain", value)}/><Field label="Cuando no entiendo, tiendo a…" value={answers.when_receive} onChange={value => answer("when_receive", value)}/><Field label="Un grado alternativo que podría servir" hint="Elegí un cambio pequeño para una situación real." value={answers.alternative_degree} onChange={value => answer("alternative_degree", value)}/></div>
  </div>; }

function UnitThree({ answers, answer }: UnitProps) { const biases = [["Te conozco","La familiaridad se toma como acceso directo al significado actual."],["Completado","Agregamos referentes, plazos o acuerdos que el mensaje no incluye."],["Intención","Pasamos de una conducta a una explicación de su motivo."],["Historial","Un antecedente domina la lectura del presente."],["Anticipación","Respondemos a una dificultad todavía no planteada."],["Responsabilidad","Nos atribuimos la tarea de resolver todo el intercambio."]] as const; return <div className={styles.flow}>
  <section><p>A veces entramos a una conversación con una respuesta que el otro todavía no dio. Esa información puede orientar. El problema aparece cuando ya no distinguimos lo que observamos de lo que esperamos encontrar.</p><Note title="Una precisión importante">Estos nombres son recursos pedagógicos de la clase, no diagnósticos. Pueden superponerse. No se trata de detectar todas las etiquetas, sino de reconocer la operación que más está influyendo.</Note></section>
  <div className={styles.cards}>{biases.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
  <Exercise title="Revisar una inferencia" message="Vos ya sabés cómo es. Si puso ‘ok’, está enojada. Mejor le explico todo otra vez antes de que me reclame."><Field label="¿Qué está observado?" value={answers.bias_observed} onChange={value => answer("bias_observed", value)}/><Field label="¿Qué fue agregado?" value={answers.bias_added} onChange={value => answer("bias_added", value)}/><Field label="Otra hipótesis posible" value={answers.bias_alternative} onChange={value => answer("bias_alternative", value)}/><Field label="¿Qué dato podría hacerte revisar tu lectura?" value={answers.bias_data} onChange={value => answer("bias_data", value)}/></Exercise>
  </div>; }

function UnitFour({ answers, answer }: UnitProps) { const selected = (answers.case || "pedido") as keyof typeof cases; const item = cases[selected]; return <div className={styles.flow}>
  <section><p>Elegí un caso. Un hueco relevante es uno cuya aclaración permite decidir o actuar. No hace falta pedir todos los detalles posibles.</p><div className={styles.caseTabs}>{Object.entries(cases).map(([key, value]) => <button type="button" key={key} className={selected === key ? styles.activeCase : ""} onClick={() => answer("case", key)}>{value.title}</button>)}</div></section>
  <Exercise title={item.title} message={item.message}><p>{item.context}</p><div className={styles.promptGrid}><Field label="Objetivo" hint="¿Para qué necesitás comprender este intercambio?" value={answers.map_goal} onChange={value => answer("map_goal", value)}/><Field label="Dato" hint="¿Qué se dijo o qué observaste?" value={answers.map_data} onChange={value => answer("map_data", value)}/><Field label="Inferencia" hint="Tu hipótesis y otra lectura posible." value={answers.map_inference} onChange={value => answer("map_inference", value)}/><Field label="Hueco relevante" hint="¿Qué falta para seguir?" value={answers.map_gap} onChange={value => answer("map_gap", value)}/><Field label="Distribución" hint="¿Qué puede aportar quien emite y quien recibe?" value={answers.map_distribution} onChange={value => answer("map_distribution", value)}/><Field label="Intervención mínima suficiente" hint="Una frase de hasta dos oraciones para la práctica." value={answers.map_move} onChange={value => answer("map_move", value)}/></div></Exercise>
  <section><h3>Banco de intervenciones</h3><p>Usá estas frases como puntos de partida. Elegí una que responda al hueco real y adaptala a tu vínculo.</p><div className={styles.phraseBank}>{interventions.map(phrase => <button type="button" key={phrase} onClick={() => answer("map_move", phrase)}>{phrase}</button>)}</div></section>
  <Note title="Criterio de práctica">Mínima significa que despeja el punto necesario sin cargar el intercambio con trabajo que no aporta. A veces serán tres palabras; otras, un pedido con contexto.</Note>
  </div>; }

function UnitFive({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <p>Volvé al caso ancla. El mensaje no cambió. La variable que vamos a observar es tu lectura después de practicar.</p><Anchor/>
  <div className={styles.promptGrid}>{promptsB.map(([key, label, hint]) => <Field key={key} label={label} hint={hint} value={answers[key]} onChange={value => answer(key, value)}/>)}</div>
  <section className={styles.compare}><div><small>Primera lectura</small><p>{answers.a_complete || "Todavía no escribiste qué estabas completando."}</p></div><div><small>Segunda lectura</small><p>{answers.b_complete || "Completá la segunda lectura para verla acá."}</p></div></section>
  <Field label="¿Qué cambió en tu lectura sin que haya cambiado el mensaje?" hint="Marcá una inferencia que ahora reconocés y un hueco que ahora podés nombrar." value={answers.comparison} onChange={value => answer("comparison", value)}/>
  <Note title="La propuesta">La clase no te exige desconfiar de todo. Te propone reconocer dónde termina lo que tenés y empieza lo que estás construyendo.</Note>
  </div>; }

function UnitSix({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <Exercise title="Desafío final de salida" message={EXIT_CASE}><p>Tu objetivo es saber si tenés una tarea a cargo. No resuelvas el trabajo antes de saber qué te están pidiendo.</p><div className={styles.promptGrid}><Field label="Dato explícito" value={answers.exit_data} onChange={value => answer("exit_data", value)}/><Field label="Inferencia" value={answers.exit_inference} onChange={value => answer("exit_inference", value)}/><Field label="Hueco relevante" value={answers.exit_gap} onChange={value => answer("exit_gap", value)}/><Field label="Intervención y grado elegido" value={answers.exit_move} onChange={value => answer("exit_move", value)}/></div></Exercise>
  <section><h3>Siete conversaciones para practicar</h3><p>En tus próximas siete conversaciones, detectá una ocasión en la que estés por completar información o explicar por las dudas. No es necesario buscar siete conflictos ni terminar en una semana.</p><div className={styles.conversationList}>{Array.from({ length: 7 }, (_, index) => <details key={index}><summary>Conversación {index + 1}<span>{answers[`conversation_${index}`] ? "Registrada" : "Pendiente"}</span></summary><Field label="D · dato / H · hipótesis / F · información que falta / M · movimiento / R · resultado" value={answers[`conversation_${index}`]} onChange={value => answer(`conversation_${index}`, value)}/></details>)}</div></section>
  <div className={styles.promptGrid}><Field label="Mi señal de sobreprocesamiento es…" value={answers.signal} onChange={value => answer("signal", value)}/><Field label="Mi próximo movimiento a probar es…" value={answers.next_move} onChange={value => answer("next_move", value)}/></div>
  <Note title="Cierre">No hace falta resolver toda la conversación en una respuesta. Podés reconocer lo que entendiste, mostrar lo que falta y pedir el aporte necesario.</Note>
  </div>; }

type UnitProps = { answers: AnswerMap; answer: (key: string, value: string) => void };
function Field({ label, hint, value = "", onChange }: { label: string; hint?: string; value?: string; onChange: (value: string) => void }) { return <label className={styles.field}><b>{label}</b>{hint && <span>{hint}</span>}<textarea value={value} onChange={event => onChange(event.target.value)} rows={4}/><small>{value ? "Guardado en este dispositivo" : "Tu respuesta queda privada en este dispositivo"}</small></label>; }
function Anchor() { return <blockquote className={styles.anchor}><small>Caso ancla · conservá el texto exacto</small>“{ANCHOR}”</blockquote>; }
function Note({ title, children }: { title: string; children: React.ReactNode }) { return <aside className={styles.note}><b>{title}</b><span>{children}</span></aside>; }
function Exercise({ title, message, children }: { title: string; message: string; children: React.ReactNode }) { return <section className={styles.exercise}><p>Práctica</p><h3>{title}</h3><blockquote>“{message}”</blockquote>{children}</section>; }
