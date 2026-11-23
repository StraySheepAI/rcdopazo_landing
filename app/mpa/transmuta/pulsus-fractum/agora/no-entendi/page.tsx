"use client";

import Link from "next/link";
import Image from "next/image";
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
  const [pdfBusy, setPdfBusy] = useState(false);
  const [roomMode, setRoomMode] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) try { setState({ ...initialState, ...JSON.parse(saved) }); } catch { /* Empieza con una ficha limpia. */ }
    setAccess(window.sessionStorage.getItem("pulsus-campus-access") === "open" || window.sessionStorage.getItem("pulsus-no-entendi-access") === "open");
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
    if (hash === ACCESS_HASH) { window.sessionStorage.setItem("pulsus-no-entendi-access", "open"); setAccess(true); setError(""); }
    else setError("La Escuela todavía no reconoce esa palabra.");
  };
  const progress = state.completed ? 100 : Math.round(((state.active + 1) / units.length) * 100);
  const answered = useMemo(() => Object.values(state.answers).filter(value => value.trim()).length, [state.answers]);

  const download = async () => {
    setPdfBusy(true);
    try {
      const bytes = await createWorkbookPdf(state.answers);
      const url = URL.createObjectURL(new Blob([Uint8Array.from(bytes).buffer], { type: "application/pdf" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = "no-entendi-mi-cuaderno.pdf"; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    } finally { setPdfBusy(false); }
  };

  if (!ready) return <main className={styles.loading} />;
  if (!access) return <main className={styles.gate}><div className={styles.stars}/><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← Volver al Ágora</Link><section><div className={styles.seal}>PF</div><p>Taller de comunicación · Nivel 1</p><h1>No entendí</h1><span>El recorrido presencial y sus fichas de práctica pertenecen al espacio de cursantes.</span><form onSubmit={unlock}><label htmlFor="no-entendi-code">Palabra de acceso</label><div><input id="no-entendi-code" type="password" value={code} onChange={event => { setCode(event.target.value); setError(""); }} autoFocus/><button type="submit">Abrir el taller</button></div><small className={error ? styles.error : ""}>{error || <>Clave de revisión: <b>NOENTENDI</b></>}</small></form></section></main>;

  return <main className={`${styles.workshop} ${roomMode ? styles.roomMode : ""}`}>
    <header className={styles.header}><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">Volver al Ágora</Link><span>Escuela de Metalkimia · Pulsus Fractum</span><div className={styles.headerActions}><b>{state.completed ? "Taller completado" : "Progreso guardado"}</b><button type="button" aria-pressed={roomMode} onClick={() => setRoomMode(!roomMode)}>{roomMode ? "Modo personal" : "Modo sala"}</button></div></header>
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <p>Comunicación · Nivel 1</p><h2>No entendí</h2><span>Entre explicar demasiado y hacer adivinar</span>
        <div className={styles.progress}><i style={{ width: `${progress}%` }}/></div><small>{progress}% · {answered} respuestas guardadas</small>
        <nav aria-label="Unidades del taller">{units.map(([short, title], index) => <button type="button" key={short} className={state.active === index ? styles.active : ""} onClick={() => go(index)}><em>{String(index + 1).padStart(2, "0")}</em><span><b>{short}</b><small>{title}</small></span>{state.visited.includes(index) && <i>✓</i>}</button>)}</nav>
        <div className={styles.hybrid}><b>Taller presencial + campus</b><span>Traé una conversación que te haya dejado trabajando de más. Compartirla es optativo.</span></div>
      </aside>

      <section className={styles.content}>
        <div className={styles.hero}><Image className={styles.heroSphere} src="/imported-assets/embole-element.png" alt="Una persona trabajando dentro de una esfera, imagen del universo Kembole" width={1024} height={1024} priority/><div><p>Clase práctica MPA · Nivel 1</p><h1>No entendí</h1><strong>Entre explicar demasiado<br/>y hacer adivinar</strong></div><div><span>Objetivo de la experiencia</span><blockquote>Aprendé a calibrar tus conversaciones sin cargar con más procesamiento del que te corresponde.</blockquote><small>90–120 minutos en campus · 120 minutos en taller</small></div></div>

        <div className={styles.unitHeading}><span>Unidad {state.active + 1} de {units.length}</span><h2>{units[state.active][1]}</h2></div>

        {state.active === 0 && <UnitOne answers={state.answers} answer={answer}/>} 
        {state.active === 1 && <UnitTwo answers={state.answers} answer={answer}/>} 
        {state.active === 2 && <UnitThree answers={state.answers} answer={answer}/>} 
        {state.active === 3 && <UnitFour answers={state.answers} answer={answer}/>} 
        {state.active === 4 && <UnitFive answers={state.answers} answer={answer}/>} 
        {state.active === 5 && <UnitSix answers={state.answers} answer={answer} go={go}/>} 

        <footer className={styles.controls}><button type="button" disabled={state.active === 0} onClick={() => go(state.active - 1)}>Anterior</button>{state.active < units.length - 1 ? <button type="button" className={styles.primary} onClick={() => go(state.active + 1)}>Guardar y continuar</button> : <div className={styles.finalActions}><button type="button" disabled={pdfBusy} onClick={download}>{pdfBusy ? "Preparando PDF…" : "Descargar mi cuaderno PDF"}</button><button type="button" className={styles.primary} onClick={() => save({ ...state, completed: !state.completed })}>{state.completed ? "Reabrir práctica" : "Completar taller"}</button></div>}</footer>
      </section>
    </div>
  </main>;
}

function UnitOne({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <VideoMoment number="01" title="Bienvenida a la experiencia" duration="45–60 segundos" image="/imported-assets/embole-element.png" alt="Persona trabajando dentro de una esfera" prompt="Presentá el propósito de la clase y aclarales que no vienen a encontrar una lectura correcta: vienen a observar cuánto trabajo hacen para completar una conversación." live="Abrí con esta pregunta: ¿cuánto tiempo seguís trabajando después de que una conversación terminó?"/>
  <section className={styles.intro}><p>¿Terminás una conversación y seguís trabajando después? Repasás lo que te dijeron, completás lo que falta o mandás otra explicación por las dudas.</p><p>En esta clase vas a observar ese trabajo y practicar cómo distribuirlo mejor.</p></section>
  <Field label="Registro breve de apertura" hint="Pensá en una conversación que terminó, pero vos seguiste procesando. ¿Qué hiciste: releer, explicar, completar, anticipar o preguntar?" value={answers.opening} onChange={value => answer("opening", value)}/>
  <Anchor/>
  <div className={styles.promptGrid}>{promptsA.map(([key, label, hint]) => <Field key={key} label={label} hint={hint} value={answers[key]} onChange={value => answer(key, value)}/>)}</div>
  <Note title="Antes de seguir">Conservamos esta primera lectura sin corregirla. Las herramientas aparecen después para que al final puedas observar qué cambió en tu proceso.</Note>
  </div>; }

function UnitTwo({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <VideoMoment number="02" title="El trabajo que no se ve" duration="60–90 segundos" image="/stray-bola-triste-44.png" alt="Bola del universo Kembole acumulando peso" prompt="Mostrá que comprender también es trabajar: retener, relacionar, recordar acuerdos, completar referentes y decidir qué respuesta sería pertinente." live="Pediles que nombren en voz alta una conversación breve que, sin embargo, les dejó mucho trabajo después."/>
  <section><p>Para comprender hacemos trabajo: retenemos información, conectamos ideas, buscamos contexto y decidimos qué responder. Si tengo que reconstruir a qué te referís, adivinar qué necesitás y recordar tres acuerdos a la vez, el trabajo crece.</p><Note title="Distribuir el trabajo de comprensión">Compartida no significa mitad y mitad. La pregunta es si el reparto permite comprender y actuar en estas condiciones.</Note></section>
  <Exercise title="Microejercicio" message="Después vemos si hacemos la reunión."><Field label="Dato" hint="¿Qué está efectivamente dicho?" value={answers.micro_data} onChange={value => answer("micro_data", value)}/><Field label="Inferencia" hint="¿Qué lectura aparece?" value={answers.micro_inference} onChange={value => answer("micro_inference", value)}/><Field label="Hueco y pregunta" hint="¿Qué falta y cómo podrías pedirlo?" value={answers.micro_gap} onChange={value => answer("micro_gap", value)}/></Exercise>
  <section><h3>Elegir el grado que sirve ahora</h3><p>El punto útil puede estar lejos del medio. Para acordar una hora puede alcanzar una línea; para enseñar una tarea nueva puede hacer falta una demostración y una comprobación.</p><blockquote className={styles.question}>¿Qué grado de procesamiento necesita esta conversación, en este vínculo, con este objetivo y en este momento?</blockquote></section>
  <div className={styles.promptGrid}><Field label="Cuando temo no ser entendida o entendido, tiendo a…" value={answers.when_explain} onChange={value => answer("when_explain", value)}/><Field label="Cuando no entiendo, tiendo a…" value={answers.when_receive} onChange={value => answer("when_receive", value)}/><Field label="Un grado alternativo que podría servir" hint="Elegí un cambio pequeño para una situación real." value={answers.alternative_degree} onChange={value => answer("alternative_degree", value)}/></div>
  </div>; }

function UnitThree({ answers, answer }: UnitProps) { const biases = [["Te conozco","La familiaridad se toma como acceso directo al significado actual."],["Completado","Agregamos referentes, plazos o acuerdos que el mensaje no incluye."],["Intención","Pasamos de una conducta a una explicación de su motivo."],["Historial","Un antecedente domina la lectura del presente."],["Anticipación","Respondemos a una dificultad todavía no planteada."],["Responsabilidad","Nos atribuimos la tarea de resolver todo el intercambio."]] as const; return <div className={styles.flow}>
  <section><p>A veces entramos a una conversación con una respuesta que el otro todavía no dio. Esa información puede orientar. El problema aparece cuando ya no distinguimos lo que observamos de lo que esperamos encontrar.</p><Note title="Una precisión importante">Estos nombres son recursos pedagógicos de la clase, no diagnósticos. Pueden superponerse. No se trata de detectar todas las etiquetas, sino de reconocer la operación que más está influyendo.</Note></section>
  <section className={styles.kemboleSequence}><div><p>Una imagen para distinguir</p><h3>Cómo una lectura se vuelve bola</h3><span>La bola no representa a la persona. Vuelve visible la carga que se forma cuando lo agregado empieza a pesar como si hubiera sido dicho.</span></div><div className={styles.kemboleSteps}><article><Image src="/stray-bola-triste-43.png" alt="Bola pequeña del universo Kembole" width={500} height={500}/><small>Lo dicho</small><b>Hay un mensaje parcial.</b></article><article><Image src="/stray-bola-triste-45.png" alt="Bola que parece conocer algo" width={500} height={500}/><small>Lo que completo</small><b>Una hipótesis ocupa el hueco.</b></article><article><Image src="/stray-bola-triste-44.png" alt="Bola cargada del universo Kembole" width={500} height={500}/><small>Lo que termina pesando</small><b>La lectura funciona como un hecho.</b></article></div></section>
  <div className={styles.cards}>{biases.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div>
  <Exercise title="Revisar una inferencia" message="Vos ya sabés cómo es. Si puso ‘ok’, está enojada. Mejor le explico todo otra vez antes de que me reclame."><Field label="¿Qué está observado?" value={answers.bias_observed} onChange={value => answer("bias_observed", value)}/><Field label="¿Qué fue agregado?" value={answers.bias_added} onChange={value => answer("bias_added", value)}/><Field label="Otra hipótesis posible" value={answers.bias_alternative} onChange={value => answer("bias_alternative", value)}/><Field label="¿Qué dato podría hacerte revisar tu lectura?" value={answers.bias_data} onChange={value => answer("bias_data", value)}/></Exercise>
  </div>; }

function UnitFour({ answers, answer }: UnitProps) { const selected = (answers.case || "pedido") as keyof typeof cases; const item = cases[selected]; return <div className={styles.flow}>
  <VideoMoment number="03" title="Demostración: del mensaje a la pregunta" duration="60–90 segundos" image="/imported-assets/stray-detective.png" alt="Stray observando detrás de una puerta" prompt="Tomá un mensaje breve y pensá en voz alta: qué está dicho, qué estás agregando, qué información falta y cuál sería la intervención mínima suficiente." live="Hacé la demostración con una conversación del grupo sin resolverla por la persona. Mostrá el procedimiento, no la respuesta correcta."/>
  <section><p>Elegí un caso. Un hueco relevante es uno cuya aclaración permite decidir o actuar. No hace falta pedir todos los detalles posibles.</p><div className={styles.caseTabs}>{Object.entries(cases).map(([key, value]) => <button type="button" key={key} className={selected === key ? styles.activeCase : ""} onClick={() => answer("case", key)}>{value.title}</button>)}</div></section>
  <Exercise title={item.title} message={item.message}><p>{item.context}</p><div className={styles.promptGrid}><Field label="Objetivo" hint="¿Para qué necesitás comprender este intercambio?" value={answers.map_goal} onChange={value => answer("map_goal", value)}/><Field label="Dato" hint="¿Qué se dijo o qué observaste?" value={answers.map_data} onChange={value => answer("map_data", value)}/><Field label="Inferencia" hint="Tu hipótesis y otra lectura posible." value={answers.map_inference} onChange={value => answer("map_inference", value)}/><Field label="Hueco relevante" hint="¿Qué falta para seguir?" value={answers.map_gap} onChange={value => answer("map_gap", value)}/><Field label="Distribución" hint="¿Qué puede aportar quien emite y quien recibe?" value={answers.map_distribution} onChange={value => answer("map_distribution", value)}/><Field label="Intervención mínima suficiente" hint="Una frase de hasta dos oraciones para la práctica." value={answers.map_move} onChange={value => answer("map_move", value)}/></div></Exercise>
  <section><h3>Banco de intervenciones</h3><p>Usá estas frases como puntos de partida. Elegí una que responda al hueco real y adaptala a tu vínculo.</p><div className={styles.phraseBank}>{interventions.map(phrase => <button type="button" key={phrase} onClick={() => answer("map_move", phrase)}>{phrase}</button>)}</div></section>
  <Note title="Criterio de práctica">Mínima significa que despeja el punto necesario sin cargar el intercambio con trabajo que no aporta. A veces serán tres palabras; otras, un pedido con contexto.</Note>
  </div>; }

function UnitFive({ answers, answer }: UnitProps) { return <div className={styles.flow}>
  <VideoMoment number="04" title="Antes de la segunda lectura" duration="45–60 segundos" image="/stray-bola-triste-45.png" alt="Bola del universo Kembole mirando nuevamente" prompt="Invitá a releer sin buscar corregirse. El mensaje será exactamente el mismo; la observación está puesta en la forma desde la que ahora se lo lee." live="Leé el mensaje en voz alta exactamente igual que al comienzo. Dejá unos segundos de silencio antes de mostrar las preguntas."/>
  <p>Volvé al caso ancla. El mensaje no cambió. La variable que vamos a observar es tu lectura después de practicar.</p><Anchor/>
  <div className={styles.promptGrid}>{promptsB.map(([key, label, hint]) => <Field key={key} label={label} hint={hint} value={answers[key]} onChange={value => answer(key, value)}/>)}</div>
  <section className={styles.compare}><div><small>Primera lectura</small><p>{answers.a_complete || "Todavía no escribiste qué estabas completando."}</p></div><div><small>Segunda lectura</small><p>{answers.b_complete || "Completá la segunda lectura para verla acá."}</p></div></section>
  <Field label="¿Qué cambió en tu lectura sin que haya cambiado el mensaje?" hint="Marcá una inferencia que ahora reconocés y un hueco que ahora podés nombrar." value={answers.comparison} onChange={value => answer("comparison", value)}/>
  <Note title="La propuesta">La clase no te exige desconfiar de todo. Te propone reconocer dónde termina lo que tenés y empieza lo que estás construyendo.</Note>
  </div>; }

function UnitSix({ answers, answer, go }: UnitProps & { go: (index: number) => void }) { const criteria = [["eval_data","Dato e inferencia están separados"],["eval_gap","Identifiqué el hueco relevante"],["eval_degree","Puedo explicar por qué elegí ese grado"],["eval_move","Mi intervención se puede responder"]] as const; return <div className={styles.flow}>
  <Exercise title="Desafío final de salida" message={EXIT_CASE}><p>Tu objetivo es saber si tenés una tarea a cargo. No resuelvas el trabajo antes de saber qué te están pidiendo.</p><div className={styles.promptGrid}><Field label="Dato explícito" value={answers.exit_data} onChange={value => answer("exit_data", value)}/><Field label="Inferencia" value={answers.exit_inference} onChange={value => answer("exit_inference", value)}/><Field label="Hueco relevante" value={answers.exit_gap} onChange={value => answer("exit_gap", value)}/><Field label="Intervención y grado elegido" value={answers.exit_move} onChange={value => answer("exit_move", value)}/></div></Exercise>
  <section><h3>Siete conversaciones para practicar</h3><p>En tus próximas siete conversaciones, detectá una ocasión en la que estés por completar información o explicar por las dudas. No es necesario buscar siete conflictos ni terminar en una semana.</p><div className={styles.conversationList}>{Array.from({ length: 7 }, (_, index) => <details key={index}><summary>Conversación {index + 1}<span>{answers[`conversation_${index}`] ? "Registrada" : "Pendiente"}</span></summary><Field label="D · dato / H · hipótesis / F · información que falta / M · movimiento / R · resultado" value={answers[`conversation_${index}`]} onChange={value => answer(`conversation_${index}`, value)}/></details>)}</div></section>
  <div className={styles.promptGrid}><Field label="Mi señal de sobreprocesamiento es…" value={answers.signal} onChange={value => answer("signal", value)}/><Field label="Mi próximo movimiento a probar es…" value={answers.next_move} onChange={value => answer("next_move", value)}/></div>
  <section className={styles.evaluation}><p>Cierre de la experiencia</p><h3>Antes de descargar, revisá tu recorrido</h3><span>No es un examen. Esta evaluación te ayuda a decidir si tu cuaderno ya representa lo que aprendiste o si querés volver a editar algo.</span><div>{criteria.map(([key, label]) => <button type="button" key={key} aria-pressed={answers[key] === "logrado"} className={answers[key] === "logrado" ? styles.achieved : ""} onClick={() => answer(key, answers[key] === "logrado" ? "" : "logrado")}><i>{answers[key] === "logrado" ? "✓" : "○"}</i>{label}</button>)}</div><Field label="Mi aprendizaje principal" hint="Esta frase abre tu cuaderno final." value={answers.final_learning} onChange={value => answer("final_learning", value)}/></section>
  <section className={styles.preview}><header><div><p>Vista previa del PDF</p><h3>Mi cuaderno · No entendí</h3></div><span>{Object.values(answers).filter(Boolean).length} registros</span></header><PreviewRow label="Primera lectura" value={answers.a_understand}/><PreviewRow label="Lo que reconocí que completaba" value={answers.b_complete}/><PreviewRow label="El cambio que observé" value={answers.comparison}/><PreviewRow label="Mi intervención" value={answers.map_move}/><PreviewRow label="Mi aprendizaje principal" value={answers.final_learning}/><nav><button type="button" onClick={() => go(0)}>Editar primera lectura</button><button type="button" onClick={() => go(3)}>Editar mi mapa</button><button type="button" onClick={() => go(4)}>Editar comparación</button></nav></section>
  <Note title="Cierre">No hace falta resolver toda la conversación en una respuesta. Podés reconocer lo que entendiste, mostrar lo que falta y pedir el aporte necesario.</Note>
  </div>; }

type UnitProps = { answers: AnswerMap; answer: (key: string, value: string) => void };
function Field({ label, hint, value = "", onChange }: { label: string; hint?: string; value?: string; onChange: (value: string) => void }) { return <label className={styles.field}><b>{label}</b>{hint && <span>{hint}</span>}<textarea value={value} onChange={event => onChange(event.target.value)} rows={4}/><small>{value ? "Guardado en este dispositivo" : "Tu respuesta queda privada en este dispositivo"}</small></label>; }
function Anchor() { return <blockquote className={styles.anchor}><small>Caso ancla · conservá el texto exacto</small>“{ANCHOR}”</blockquote>; }
function Note({ title, children }: { title: string; children: React.ReactNode }) { return <aside className={styles.note}><b>{title}</b><span>{children}</span></aside>; }
function Exercise({ title, message, children }: { title: string; message: string; children: React.ReactNode }) { return <section className={styles.exercise}><p>Práctica</p><h3>{title}</h3><blockquote>“{message}”</blockquote>{children}</section>; }
function PreviewRow({ label, value }: { label: string; value?: string }) { return <div className={styles.previewRow}><b>{label}</b><span>{value?.trim() || "Todavía no completado"}</span></div>; }
function VideoMoment({ number, title, duration, image, alt, prompt, live }: { number: string; title: string; duration: string; image: string; alt: string; prompt: string; live: string }) { return <section className={styles.videoMoment}><div className={styles.videoPoster}><Image src={image} alt={alt} fill sizes="(max-width: 900px) 100vw, 48vw"/><span className={styles.playMark}>▶</span><small>Video {number} · por grabar</small></div><div className={styles.videoCopy}><p>Intervención audiovisual</p><h3>{title}</h3><span>{duration}</span><p>{prompt}</p><details><summary>Usarlo hoy en la clase presencial</summary><div>{live}</div></details></div></section>; }

async function createWorkbookPdf(answers: AnswerMap) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 52;
  const ink = rgb(.12,.07,.12), gold = rgb(.44,.35,.19), pink = rgb(.72,.24,.52), paper = rgb(.98,.96,.94), muted = rgb(.42,.37,.41);
  let page = pdf.addPage(pageSize), y = pageSize[1] - margin;
  const safe = (value: string) => (value || "—").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[–—]/g,"-").replace(/[^\x20-\x7E\xA0-\xFF\n]/g,"");
  const addPage = () => { page = pdf.addPage(pageSize); page.drawRectangle({ x:0,y:0,width:pageSize[0],height:pageSize[1],color:paper }); page.drawText("ESCUELA DE METALKIMIA · PULSUS FRACTUM",{x:margin,y:pageSize[1]-30,size:7,font:bold,color:gold}); y=pageSize[1]-58; };
  const ensure = (height: number) => { if (y-height < 48) addPage(); };
  const wrap = (text: string, maxWidth: number, size: number, font = regular) => { const words=safe(text).replace(/\s+/g," ").trim().split(" "); const lines:string[]=[]; let line=""; for(const word of words){ const next=line?`${line} ${word}`:word; if(font.widthOfTextAtSize(next,size)>maxWidth&&line){lines.push(line);line=word}else line=next} if(line) lines.push(line); return lines; };
  const text = (value:string,size=10,color=ink,font=regular,maxWidth=pageSize[0]-margin*2,leading=size*1.45) => { const lines=wrap(value,maxWidth,size,font); ensure(lines.length*leading+4); lines.forEach(line=>{page.drawText(line,{x:margin,y,size,font,color});y-=leading}); y-=4; };
  const section = (title:string) => { ensure(42); y-=9; page.drawText(title.toUpperCase(),{x:margin,y,size:8,font:bold,color:pink}); y-=16; page.drawLine({start:{x:margin,y:y+7},end:{x:pageSize[0]-margin,y:y+7},thickness:.5,color:gold}); };
  const response = (label:string,value?:string) => { ensure(55); page.drawText(label,{x:margin,y,size:9,font:bold,color:gold}); y-=15; text(value?.trim()||"No completado",10,ink,regular); y-=7; };
  page.drawRectangle({x:0,y:0,width:pageSize[0],height:pageSize[1],color:paper});
  page.drawText("NO ENTENDÍ",{x:margin,y,size:34,font:bold,color:gold}); y-=34;
  page.drawText("Entre explicar demasiado y hacer adivinar",{x:margin,y,size:15,font:italic,color:ink}); y-=28;
  text(answers.final_learning?.trim() || "Mi recorrido de comunicación · Nivel 1",13,pink,bold);
  text(`Cuaderno generado el ${new Date().toLocaleDateString("es-AR")}`,8,muted,regular); y-=16;
  section("Ficha A · Primera lectura"); promptsA.forEach(([key,label])=>response(label,answers[key]));
  section("Ficha B · Segunda lectura y recalibración"); promptsB.forEach(([key,label])=>response(label,answers[key]));
  section("Comparación"); response("¿Qué cambió sin que cambiara el mensaje?",answers.comparison);
  section("Mapa de calibración"); [["Objetivo","map_goal"],["Dato","map_data"],["Inferencia","map_inference"],["Hueco relevante","map_gap"],["Distribución del trabajo","map_distribution"],["Intervención mínima suficiente","map_move"]].forEach(([label,key])=>response(label,answers[key]));
  section("Desafío de salida"); [["Dato explícito","exit_data"],["Inferencia","exit_inference"],["Hueco relevante","exit_gap"],["Intervención y grado elegido","exit_move"]].forEach(([label,key])=>response(label,answers[key]));
  section("Mi autoevaluación"); [["Dato e inferencia separados","eval_data"],["Hueco relevante identificado","eval_gap"],["Grado elegido con criterio","eval_degree"],["Intervención respondible","eval_move"]].forEach(([label,key])=>response(label,answers[key]==="logrado"?"Logrado":"A revisar")); response("Mi señal de sobreprocesamiento",answers.signal); response("Mi próximo movimiento a probar",answers.next_move);
  section("Siete conversaciones para practicar"); Array.from({length:7},(_,index)=>response(`Conversación ${index+1}`,answers[`conversation_${index}`]));
  const pages=pdf.getPages(); pages.forEach((item,index)=>{item.drawText(`${index+1} / ${pages.length}`,{x:pageSize[0]-margin-24,y:26,size:7,font:regular,color:muted}); item.drawLine({start:{x:margin,y:38},end:{x:pageSize[0]-margin,y:38},thickness:.4,color:gold});});
  return pdf.save();
}
