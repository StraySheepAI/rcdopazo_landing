"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Lang = "es" | "en";

const copy = {
  es: {
    back: "Volver al Ágora", label: "Ágora libre · taller abierto", title: "Introducción a los principios universales y su papel en la creación de tu realidad.",
    lead: "Una perspectiva metalkímica de MPA. No para aceptar siete verdades: para reconocerlas, interrogarlas y probar qué permiten observar.",
    begin: "Atravesar la experiencia", time: "7 minutos · sin clave · no requiere experiencia previa",
    mapLabel: "El mapa que vamos a atravesar", mapTitle: "Siete lentes. Un mismo movimiento visto desde lugares diferentes.",
    principles: ["Mentalismo", "Correspondencia", "Vibración", "Polaridad", "Ritmo", "Causa y efecto", "Generación"],
    demo: "Hoy abrimos una primera puerta: Correspondencia × Generación.",
    one: "Primera experiencia · El tercero que no estabas mirando", oneTitle: "Elegí una escena que hoy te resulte familiar.",
    scenes: ["Digo que sí, pero quiero decir que no.", "Dos personas quieren ayudar y todo se traba.", "Tengo una idea clara, pero no consigo empezarla."],
    two: "Lo visible", twoTitle: "Si sólo mirás las partes, ¿dónde parece estar el problema?",
    sides: ["En la primera parte", "En la segunda parte", "En una de las dos, pero no sé cuál"],
    reveal: "Abrir otra mirada", three: "Lo que faltaba mirar", threeTitle: "¿Qué sistema producen juntas?",
    sceneResults: [
      ["Tu deseo", "La respuesta esperada", "Un acuerdo donde conservar el vínculo exige ocultar tu posición"],
      ["La intención de una persona", "La intención de la otra", "Una coordinación donde la ayuda compite por conducir"],
      ["La idea", "Tu forma de comenzar", "Un umbral donde empezar exige que la idea deje de ser perfecta"],
    ],
    test: "Prueba de correspondencia", testText: "Una lectura no alcanza porque suene bien. Probala en los dos sentidos.",
    questions: ["¿Las partes producen este sistema?", "¿Este sistema modifica cómo actúan las partes?"], yes: "Sí", notYet: "Todavía no puedo verlo",
    finish: "Ver qué principio usaste", insight: "No encontraste un culpable. Distinguiste una configuración.",
    insightText: "Correspondencia permite comprobar la relación. Generación permite reconocer el tercer sistema que emerge de ella. En MPA no son respuestas para creer: son lentes para observar y volver a probar.",
    formula: "A + B no da una cosa. Abre un sistema C que también transforma A y B.",
    next: "¿Querés aprender a hacerlo con tus propias situaciones?", nextText: "Esto fue una experiencia abierta. En la Escuela, la mirada se convierte en práctica: Fundamentos ayuda a comprender; Lógica, a discernir; ATRS, a operar.",
    fundamentals: "Conocer Fundamentos", logic: "Explorar Lógica I", campus: "Volver al campus",
  },
  en: {
    back: "Back to the Agora", label: "Open Agora · free workshop", title: "Introduction to universal principles and their role in creating your reality.",
    lead: "An MPA metalkimical perspective. Not to accept seven truths, but to recognize, question and test what they allow us to observe.",
    begin: "Enter the experience", time: "7 minutes · no key · no previous experience required",
    mapLabel: "The map we will cross", mapTitle: "Seven lenses. One movement seen from different places.",
    principles: ["Mentalism", "Correspondence", "Vibration", "Polarity", "Rhythm", "Cause and effect", "Generation"],
    demo: "Today we open one first door: Correspondence × Generation.",
    one: "First experience · The third thing you were not seeing", oneTitle: "Choose a scene that feels familiar today.",
    scenes: ["I say yes, but I want to say no.", "Two people want to help and everything gets stuck.", "I have a clear idea, but I cannot begin."],
    two: "What is visible", twoTitle: "If you only look at the parts, where does the problem seem to be?",
    sides: ["In the first part", "In the second part", "In one of them, but I do not know which"],
    reveal: "Open another view", three: "What was missing", threeTitle: "What system do they produce together?",
    sceneResults: [
      ["Your desire", "The expected response", "An agreement where preserving the bond requires hiding your position"],
      ["One person's intention", "The other's intention", "A coordination where helping competes for control"],
      ["The idea", "Your way of beginning", "A threshold where starting requires the idea to stop being perfect"],
    ],
    test: "Correspondence test", testText: "A reading is not enough because it sounds good. Test it in both directions.",
    questions: ["Do the parts produce this system?", "Does this system change how the parts act?"], yes: "Yes", notYet: "I cannot see it yet",
    finish: "See which principle you used", insight: "You did not find a culprit. You distinguished a configuration.",
    insightText: "Correspondence tests the relationship. Generation recognizes the third system emerging from it. In MPA they are not answers to believe: they are lenses through which to observe and test again.",
    formula: "A + B does not produce a thing. It opens a system C that also transforms A and B.",
    next: "Would you like to learn how to do this with your own situations?", nextText: "This was an open experience. At the School, seeing becomes practice: Foundations helps you understand; Logic, discern; ATRS, operate.",
    fundamentals: "Discover Foundations", logic: "Explore Logic I", campus: "Return to campus",
  },
};

export default function ElTerceroWorkshop() {
  const [lang, setLang] = useState<Lang>("es");
  const [started, setStarted] = useState(false);
  const [scene, setScene] = useState<number | null>(null);
  const [side, setSide] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    if (window.localStorage.getItem("pulsus-agora-el-tercero") === "complete") setComplete(true);
  }, []);

  const resetAfterScene = (index: number) => { setScene(index); setSide(null); setRevealed(false); setAnswers([]); setComplete(false); };
  const answer = (index: number) => setAnswers((current) => current.includes(index) ? current : [...current, index]);
  const finish = () => { setComplete(true); window.localStorage.setItem("pulsus-agora-el-tercero", "complete"); };

  return <main className="agora-free-workshop">
    <div className="agora-free-stars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
    <header>
      <Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← {t.back}</Link>
      <Image src="/pulsus-fractum-shield-v6-warm.png" alt="Pulsus Fractum" width={72} height={72} />
      <div><button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")}>ES</button><span>/</span><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button></div>
    </header>

    {!started ? <section className="agora-free-threshold">
      <div className="agora-free-orbit" aria-hidden="true"><i>A</i><i>B</i><strong>C</strong></div>
      <p>{t.label}</p><h1>{t.title}</h1><blockquote>{t.lead}</blockquote>
      <button onClick={() => setStarted(true)}>{t.begin} <span>→</span></button><small>{t.time}</small>
    </section> : <section className="agora-free-experience">
      <div className="agora-free-progress"><i className="done" /><i className={scene !== null ? "done" : ""} /><i className={revealed ? "done" : ""} /><i className={complete ? "done" : ""} /></div>
      <article className="agora-free-map">
        <p>{t.mapLabel}</p><h2>{t.mapTitle}</h2>
        <div>{t.principles.map((principle, index) => <span className={index === 1 || index === 6 ? "active" : ""} key={principle}><i>{index + 1}</i>{principle}</span>)}</div>
        <blockquote>{t.demo}</blockquote>
      </article>
      <article>
        <p>{t.one}</p><h2>{t.oneTitle}</h2>
        <div className="agora-free-choices">{t.scenes.map((item, index) => <button className={scene === index ? "selected" : ""} key={item} onClick={() => resetAfterScene(index)}><i>{String(index + 1).padStart(2, "0")}</i><span>{item}</span></button>)}</div>
      </article>

      {scene !== null && <article className="agora-free-stage">
        <p>{t.two}</p><h2>{t.twoTitle}</h2>
        <div className="agora-free-pills">{t.sides.map((item, index) => <button className={side === index ? "selected" : ""} key={item} onClick={() => setSide(index)}>{item}</button>)}</div>
        {side !== null && !revealed && <button className="agora-free-primary" onClick={() => setRevealed(true)}>{t.reveal} →</button>}
      </article>}

      {revealed && scene !== null && <article className="agora-free-stage agora-free-third">
        <p>{t.three}</p><h2>{t.threeTitle}</h2>
        <div className="agora-free-system"><div><small>A</small><span>{t.sceneResults[scene][0]}</span></div><b>+</b><div><small>B</small><span>{t.sceneResults[scene][1]}</span></div><b>→</b><div className="is-third"><small>C · sistema emergente</small><span>{t.sceneResults[scene][2]}</span></div></div>
        <div className="agora-free-test"><p>{t.test}</p><h3>{t.testText}</h3>{t.questions.map((question, index) => <div key={question}><span>{question}</span><button className={answers.includes(index) ? "selected" : ""} onClick={() => answer(index)}>{t.yes}</button><button onClick={() => answer(index)}>{t.notYet}</button></div>)}</div>
        {answers.length === 2 && !complete && <button className="agora-free-primary" onClick={finish}>{t.finish} →</button>}
      </article>}

      {complete && <article className="agora-free-insight">
        <p>Correspondencia × Generación</p><h2>{t.insight}</h2><span>{t.insightText}</span><blockquote>{t.formula}</blockquote>
        <div><h3>{t.next}</h3><p>{t.nextText}</p><nav><Link href="/mpa/transmuta/pulsus-fractum/fundamentos/clase-1">{t.fundamentals} →</Link><Link href="/mpa/transmuta/pulsus-fractum/logica/clase-1">{t.logic} →</Link><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">{t.campus}</Link></nav></div>
      </article>}
    </section>}
  </main>;
}
