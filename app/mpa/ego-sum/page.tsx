"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { LanguageToggle } from "../../components/LanguageToggle";

type Answers = {
  identity: string;
  observable: string;
  interpretation: string;
  gesture: string;
};

const emptyAnswers: Answers = {
  identity: "",
  observable: "",
  interpretation: "",
  gesture: "",
};

export default function PrimerDestelloPage() {
  const { locale } = useLanguage();
  const tx = (es: string, en: string) => locale === "es" ? es : en;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);

  const update = (field: keyof Answers, value: string) => {
    setAnswers((current) => ({ ...current, [field]: value }));
  };

  const restart = () => {
    setAnswers(emptyAnswers);
    setStep(0);
  };

  const saveDestello = () => window.print();

  return (
    <main className="destello-page">
      <div className="destello-stars" aria-hidden="true" />
      <header className="destello-header">
        <Link href="/mpa/transmuta">← Transmuta</Link>
        <span>Ego SUM · {tx("Laboratorio del Yo", "Laboratory of the Self")}</span>
        <LanguageToggle />
      </header>

      {step === 0 ? (
        <div className="ego-sum-world">
          <section className="ego-sum-hero">
            <div className="ego-sum-hero-copy">
              <p className="destello-kicker">Ego SUM · {tx("Laboratorio del Yo", "Laboratory of the Self")}</p>
              <span className="destello-medal">
                <Image src="/mpa-coin-ego-sum-v3-antique.png" alt="Medalla Ego SUM" width={150} height={150} priority />
              </span>
              <p className="destello-welcome">{tx("Bienvenido al laboratorio", "Welcome to the laboratory")}</p>
              <h1>{tx("La forma que llamás “yo”", "The form you call “I”")}</h1>
              <p className="ego-sum-hero-lead">{tx("Antes de que pudieras decir “yo soy”, el mundo ya había empezado a nombrarte.", "Before you could say “I am,” the world had already begun to name you.")}</p>
              <p>{tx("Ego SUM es un espacio para observar la persona que estás siendo sin confundirla con todo lo que sos.", "Ego SUM is a space for observing the person you are being without confusing it with all that you are.")}</p>
              <p>{tx("No partimos de que haya algo roto en vos. Partimos de que una configuración puede haberse vuelto tan habitual que hoy parece identidad.", "We do not begin from the idea that something in you is broken. We begin with a configuration that may have become so habitual it now appears to be identity.")}</p>
              <button type="button" onClick={() => setStep(1)}>{tx("Vivir el Primer Destello", "Experience the First Flash")} <b>→</b></button>
              <small>{tx("Nada de lo que escribas sale de este dispositivo.", "Nothing you write leaves this device.")}</small>
            </div>
            <figure className="ego-sum-hero-image">
              <Image src="/ego-sum/integratuum-human.webp" alt="Figura humana iluminada en el centro del pecho" width={500} height={500} priority />
              <figcaption>{tx("Observar la forma. Recuperar la posibilidad.", "Observe the form. Recover possibility.")}</figcaption>
            </figure>
          </section>

          <section className="ego-sum-principle">
            <figure>
              <Image src="/ego-sum/fragmentum-human.png" alt="Fragmentum, figura humana dentro de una esfera" width={1024} height={1536} />
            </figure>
            <div>
              <p className="ego-sum-overline">{tx("Una distinción de Metalkimia", "A Metalkimia distinction")}</p>
              <h2>{tx("No estás roto.", "You are not broken.")}<br />{tx("Estás fragmentado.", "You are fragmented.")}</h2>
              <p>{tx("Un fragmento no es un defecto ni una parte que haya que expulsar. Es una forma organizada de percibir, proteger, desear o responder.", "A fragment is neither a flaw nor a part to be cast out. It is an organized way of perceiving, protecting, desiring or responding.")}</p>
              <p>{tx("Cuando la atención queda capturada por una de esas formas, decimos “yo soy así”. Cuando aparece la vigilia, podemos reconocer:", "When attention is captured by one of these forms, we say “this is who I am.” When Vigilia appears, we can recognize:")} <em>{tx("estoy habitando esta forma ahora", "I am inhabiting this form now")}</em>.</p>
              <blockquote>{tx("La configuración cambia. La presencia observa.", "Configuration changes. Presence observes.")}</blockquote>
            </div>
          </section>

          <section className="ego-sum-sequence">
            <p className="ego-sum-overline">{tx("El movimiento del laboratorio", "The laboratory movement")}</p>
            <h2>Fragmentum · Amatur · Integratuum</h2>
            <div className="ego-sum-sequence-grid">
              <article><span>01</span><h3>Fragmentum</h3><p>{tx("Reconocer la configuración que hoy ocupa el centro de la escena.", "Recognize the configuration currently occupying center stage.")}</p></article>
              <article><span>02</span><h3>Amatur</h3><p>{tx("Escuchar su función sin combatirla, juzgarla ni convertirla en enemiga.", "Listen to its function without fighting, judging or turning it into an enemy.")}</p></article>
              <article><span>03</span><h3>Integratuum</h3><p>{tx("Recuperar margen de elección: integrar la forma sin quedar reducido a ella.", "Recover room for choice: integrate the form without being reduced to it.")}</p></article>
            </div>
          </section>

          <section className="ego-sum-fragments">
            <div className="ego-sum-fragments-copy">
              <p className="ego-sum-overline">{tx("La otra cara del laboratorio", "The other face of the laboratory")}</p>
              <h2>{tx("El mundo del pequeño yo.", "The world of the little self.")}</h2>
              <p>{tx("Hay formas que se revelan mejor cuando encuentran voz, gesto y relato. Del otro lado del umbral, el pequeño yo deja ver su mundo.", "Some forms reveal themselves more clearly when they find voice, gesture and story. Beyond the threshold, the little self reveals its world.")}</p>
              <p>{tx("Los fragmentos no son identidades fijas: cambian de lugar, de función y de intensidad. La experiencia permite verlos sin confundirlos con quien observa.", "Fragments are not fixed identities: they shift in place, function and intensity. The experience lets us see them without confusing them with the one who observes.")}</p>
            </div>
            <div className="ego-sum-fragment-cast" aria-label="Fragmentos del universo Ego SUM">
              <Image src="/ego-sum/fragment-quiet.png" alt="Fragmento sereno" width={260} height={260} />
              <Image src="/ego-sum/fragment-observer.png" alt="Fragmento observador" width={260} height={260} />
              <Image src="/ego-sum/fragment-seated.png" alt="Fragmento sentado" width={260} height={260} />
              <Image src="/ego-sum/fragment-running.png" alt="Fragmento en movimiento" width={260} height={260} />
            </div>
          </section>

          <section className="ego-sum-threshold">
            <p className="ego-sum-overline">{tx("Una experiencia, dos caminos", "One experience, two paths")}</p>
            <h2>{tx("Podés comprobarlo antes de creerlo.", "You can test it before believing it.")}</h2>
            <p>{tx("El Primer Destello te permite vivir una pequeña redirección metacognitiva. Si querés entrar al universo narrativo, el umbral continúa en Magia para Atrevidos. Si querés profundizar el sistema, la Escuela reúne teoría, práctica, narrativa e integración.", "The First Flash lets you experience a small metacognitive redirection. To enter the narrative universe, the threshold continues in Magia para Atrevidos. To deepen the system, the School brings together theory, practice, narrative and integration.")}</p>
            <div>
              <button type="button" onClick={() => setStep(1)}>{tx("Iniciar el Destello", "Begin the Flash")} <b>→</b></button>
              <Link href="/reto">{tx("Cruzar el umbral", "Cross the threshold")} <b>✦</b></Link>
              <Link className="secondary" href="/mpa/transmuta/pulsus-fractum">{tx("Conocer Pulsus Fractum", "Discover Pulsus Fractum")}</Link>
            </div>
          </section>
        </div>
      ) : (
      <section className="destello-shell">
        <div className="destello-orbit" aria-hidden="true"><i /><i /><i /></div>
        <p className="destello-kicker">{tx("Laboratorio del Yo · Primer Destello", "Laboratory of the Self · First Flash")}</p>

        {step === 1 && (
          <article className="destello-card">
            <div className="destello-progress"><span>01</span><i /><i /><small>{tx("La frase", "The phrase")}</small></div>
            <h2>{tx("Elegí una forma con la que hoy te nombrás.", "Choose a form you use to name yourself today.")}</h2>
            <p>{tx("Puede ser una certeza, una limitación o una frase que repetís sin pensar demasiado.", "It may be a certainty, a limitation or a phrase you repeat without much thought.")}</p>
            <label htmlFor="identity">{tx("Completá la frase: “Yo soy…”", "Complete the phrase: “I am…”")}</label>
            <textarea id="identity" value={answers.identity} onChange={(event) => update("identity", event.target.value)} placeholder={tx("Yo soy…", "I am…")} rows={4} autoFocus />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(0)}>{tx("Volver", "Back")}</button>
              <button type="button" disabled={!answers.identity.trim()} onClick={() => setStep(2)}>{tx("Distinguir", "Distinguish")} <b>→</b></button>
            </div>
          </article>
        )}

        {step === 2 && (
          <article className="destello-card">
            <div className="destello-progress"><i /><span>02</span><i /><small>Separatio</small></div>
            <h2>{tx("Separá lo ocurrido de la forma que tomó.", "Separate what happened from the form it took.")}</h2>
            <blockquote>“{answers.identity.trim()}”</blockquote>
            <label htmlFor="observable">{tx("¿Qué ocurrió o se repite, sin explicarlo?", "What happened or keeps recurring, without explaining it?")}</label>
            <textarea id="observable" value={answers.observable} onChange={(event) => update("observable", event.target.value)} placeholder={tx("Lo que podría observar una cámara…", "What a camera might observe…")} rows={3} autoFocus />
            <label htmlFor="interpretation">{tx("¿Qué conclusión sobre vos construiste a partir de eso?", "What conclusion about yourself did you build from it?")}</label>
            <textarea id="interpretation" value={answers.interpretation} onChange={(event) => update("interpretation", event.target.value)} placeholder={tx("La interpretación que se volvió identidad…", "The interpretation that became identity…")} rows={3} />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(1)}>{tx("Volver", "Back")}</button>
              <button type="button" disabled={!answers.observable.trim() || !answers.interpretation.trim()} onClick={() => setStep(3)}>{tx("Reconocer mi margen", "Recognize my room to act")} <b>→</b></button>
            </div>
          </article>
        )}

        {step === 3 && (
          <article className="destello-card">
            <div className="destello-progress"><i /><i /><span>03</span><small>{tx("Agencia", "Agency")}</small></div>
            <h2>{tx("No todo depende de vos. Pero algo sí.", "Not everything depends on you. But something does.")}</h2>
            <p>{tx("La agencia empieza al distinguir qué pertenece a tu campo de acción. No exige resolverlo todo: alcanza con ensayar otra relación.", "Agency begins by distinguishing what belongs to your field of action. It does not require solving everything: trying a different relationship is enough.")}</p>
            <label htmlFor="gesture">{tx("¿Qué gesto pequeño depende de vos y permitiría probar otra configuración?", "What small gesture depends on you and would let you test another configuration?")}</label>
            <textarea id="gesture" value={answers.gesture} onChange={(event) => update("gesture", event.target.value)} placeholder={tx("Un gesto concreto, posible y pequeño…", "A concrete, possible and small gesture…")} rows={4} autoFocus />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(2)}>{tx("Volver", "Back")}</button>
              <button type="button" disabled={!answers.gesture.trim()} onClick={() => setStep(4)}>{tx("Revelar mi Destello", "Reveal my Flash")} <b>✦</b></button>
            </div>
          </article>
        )}

        {step === 4 && (
          <article className="destello-card destello-result">
            <div className="destello-flare" aria-hidden="true">✦</div>
            <p className="destello-result-overline">{tx("Primer Destello de Vigilia", "First Flash of Vigilia")}</p>
            <h2>{tx("No sos una forma fija.", "You are not a fixed form.")}</h2>
            <p className="destello-revelation">{tx("Lo que llamaste identidad puede observarse como una configuración. Y lo que puede distinguirse, puede empezar a reconfigurarse.", "What you called identity can be observed as a configuration. And what can be distinguished can begin to be reconfigured.")}</p>
            <div className="destello-map">
              <div><small>{tx("La forma aprendida", "The learned form")}</small><strong>{answers.identity.trim()}</strong></div>
              <div><small>{tx("La interpretación", "The interpretation")}</small><strong>{answers.interpretation.trim()}</strong></div>
              <div><small>{tx("Tu primer movimiento", "Your first movement")}</small><strong>{answers.gesture.trim()}</strong></div>
            </div>
            <div className="destello-context">
              <h3>{tx("¿Qué acabás de hacer?", "What did you just do?")}</h3>
              <p>{tx("Para MPA, una forma es el modo en que algo se organiza y se expresa ahora. No define lo que sos en sentido absoluto: describe una configuración presente.", "For MPA, a form is the way something is organized and expressed now. It does not define what you are in absolute terms: it describes a present configuration.")}</p>
              <p>{tx("Al separar lo observable de la interpretación, dejaste de mirar únicamente desde la frase y empezaste a mirar también la frase. Ese cambio del punto de observación es un primer movimiento de redirección metacognitiva.", "By separating what is observable from its interpretation, you stopped looking only from within the phrase and began to look at the phrase itself. That shift in the point of observation is a first movement of metacognitive redirection.")}</p>
              <p>{tx("Después reconociste una zona de agencia: no una solución total, sino aquello sobre lo que sí podés actuar.", "Then you recognized a zone of agency: not a total solution, but what you can actually act upon.")}</p>
            </div>
            <p className="destello-closing">{tx("No obtuviste una respuesta. Obtuviste una diferencia que antes no podías ver. Ese es tu Destello de Vigilia.", "You did not obtain an answer. You obtained a distinction you could not see before. That is your Flash of Vigilia.")}</p>
            <div className="destello-actions destello-result-actions">
              <button className="secondary" type="button" onClick={restart}>{tx("Volver a atravesarla", "Go through it again")}</button>
              <button type="button" onClick={saveDestello}>{tx("Guardar mi Destello", "Save my Flash")} <b>↓</b></button>
              <Link href="/reto">{tx("Cruzar al Universo", "Cross into the Universe")} <b>→</b></Link>
            </div>
            <small className="destello-save-note">{tx("Elegí “Guardar como PDF” en la pantalla de impresión para conservarlo en tu dispositivo.", "Choose “Save as PDF” in the print dialog to keep it on your device.")}</small>
          </article>
        )}
      </section>
      )}
    </main>
  );
}
