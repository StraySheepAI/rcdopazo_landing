"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
        <span>Ego SUM · Laboratorio del Yo</span>
      </header>

      {step === 0 ? (
        <div className="ego-sum-world">
          <section className="ego-sum-hero">
            <div className="ego-sum-hero-copy">
              <p className="destello-kicker">Ego SUM · Laboratorio del Yo</p>
              <span className="destello-medal">
                <Image src="/mpa-coin-ego-sum-v3-antique.png" alt="Medalla Ego SUM" width={150} height={150} priority />
              </span>
              <p className="destello-welcome">Bienvenido al laboratorio</p>
              <h1>La forma que llamás “yo”</h1>
              <p className="ego-sum-hero-lead">Antes de que pudieras decir “yo soy”, el mundo ya había empezado a nombrarte.</p>
              <p>Ego SUM es un espacio para observar la persona que estás siendo sin confundirla con todo lo que sos.</p>
              <p>No partimos de que haya algo roto en vos. Partimos de que una configuración puede haberse vuelto tan habitual que hoy parece identidad.</p>
              <button type="button" onClick={() => setStep(1)}>Vivir el Primer Destello <b>→</b></button>
              <small>Nada de lo que escribas sale de este dispositivo.</small>
            </div>
            <figure className="ego-sum-hero-image">
              <Image src="/ego-sum/integratuum-human.webp" alt="Figura humana iluminada en el centro del pecho" width={500} height={500} priority />
              <figcaption>Observar la forma. Recuperar la posibilidad.</figcaption>
            </figure>
          </section>

          <section className="ego-sum-principle">
            <figure>
              <Image src="/ego-sum/fragmentum-human.png" alt="Fragmentum, figura humana dentro de una esfera" width={1024} height={1536} />
            </figure>
            <div>
              <p className="ego-sum-overline">Una distinción de Metalkimia</p>
              <h2>No estás roto.<br />Estás fragmentado.</h2>
              <p>Un fragmento no es un defecto ni una parte que haya que expulsar. Es una forma organizada de percibir, proteger, desear o responder.</p>
              <p>Cuando la atención queda capturada por una de esas formas, decimos “yo soy así”. Cuando aparece la vigilia, podemos reconocer: <em>estoy habitando esta forma ahora</em>.</p>
              <blockquote>La configuración cambia. La presencia observa.</blockquote>
            </div>
          </section>

          <section className="ego-sum-sequence">
            <p className="ego-sum-overline">El movimiento del laboratorio</p>
            <h2>Fragmentum · Amatur · Integratuum</h2>
            <div className="ego-sum-sequence-grid">
              <article><span>01</span><h3>Fragmentum</h3><p>Reconocer la configuración que hoy ocupa el centro de la escena.</p></article>
              <article><span>02</span><h3>Amatur</h3><p>Escuchar su función sin combatirla, juzgarla ni convertirla en enemiga.</p></article>
              <article><span>03</span><h3>Integratuum</h3><p>Recuperar margen de elección: integrar la forma sin quedar reducido a ella.</p></article>
            </div>
          </section>

          <section className="ego-sum-fragments">
            <div className="ego-sum-fragments-copy">
              <p className="ego-sum-overline">La otra cara del laboratorio</p>
              <h2>Cuando una función toma voz.</h2>
              <p>En este lado del umbral hablamos con precisión. Del otro, las configuraciones se vuelven personajes, relato y juego.</p>
              <p>Los fragmentos no son identidades fijas: cambian de lugar, de función y de intensidad. La experiencia permite verlos sin confundirlos con quien observa.</p>
            </div>
            <div className="ego-sum-fragment-cast" aria-label="Fragmentos del universo Ego SUM">
              <Image src="/ego-sum/fragment-quiet.png" alt="Fragmento sereno" width={260} height={260} />
              <Image src="/ego-sum/fragment-observer.png" alt="Fragmento observador" width={260} height={260} />
              <Image src="/ego-sum/fragment-seated.png" alt="Fragmento sentado" width={260} height={260} />
              <Image src="/ego-sum/fragment-running.png" alt="Fragmento en movimiento" width={260} height={260} />
            </div>
          </section>

          <section className="ego-sum-threshold">
            <p className="ego-sum-overline">Una experiencia, dos caminos</p>
            <h2>Podés comprobarlo antes de creerlo.</h2>
            <p>El Primer Destello te permite vivir una pequeña redirección metacognitiva. Si querés entrar al universo narrativo, el umbral continúa en Magia para Atrevidos. Si querés profundizar el sistema, la Escuela reúne teoría, práctica, narrativa e integración.</p>
            <div>
              <button type="button" onClick={() => setStep(1)}>Iniciar el Destello <b>→</b></button>
              <Link href="/reto">Cruzar el umbral <b>✦</b></Link>
              <Link className="secondary" href="/mpa/transmuta">Conocer Transmuta</Link>
            </div>
          </section>
        </div>
      ) : (
      <section className="destello-shell">
        <div className="destello-orbit" aria-hidden="true"><i /><i /><i /></div>
        <p className="destello-kicker">Laboratorio del Yo · Primer Destello</p>

        {step === 1 && (
          <article className="destello-card">
            <div className="destello-progress"><span>01</span><i /><i /><small>La frase</small></div>
            <h2>Elegí una forma con la que hoy te nombrás.</h2>
            <p>Puede ser una certeza, una limitación o una frase que repetís sin pensar demasiado.</p>
            <label htmlFor="identity">Completá la frase: “Yo soy…”</label>
            <textarea id="identity" value={answers.identity} onChange={(event) => update("identity", event.target.value)} placeholder="Yo soy…" rows={4} autoFocus />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(0)}>Volver</button>
              <button type="button" disabled={!answers.identity.trim()} onClick={() => setStep(2)}>Distinguir <b>→</b></button>
            </div>
          </article>
        )}

        {step === 2 && (
          <article className="destello-card">
            <div className="destello-progress"><i /><span>02</span><i /><small>Separatio</small></div>
            <h2>Separá lo ocurrido de la forma que tomó.</h2>
            <blockquote>“{answers.identity.trim()}”</blockquote>
            <label htmlFor="observable">¿Qué ocurrió o se repite, sin explicarlo?</label>
            <textarea id="observable" value={answers.observable} onChange={(event) => update("observable", event.target.value)} placeholder="Lo que podría observar una cámara…" rows={3} autoFocus />
            <label htmlFor="interpretation">¿Qué conclusión sobre vos construiste a partir de eso?</label>
            <textarea id="interpretation" value={answers.interpretation} onChange={(event) => update("interpretation", event.target.value)} placeholder="La interpretación que se volvió identidad…" rows={3} />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(1)}>Volver</button>
              <button type="button" disabled={!answers.observable.trim() || !answers.interpretation.trim()} onClick={() => setStep(3)}>Reconocer mi margen <b>→</b></button>
            </div>
          </article>
        )}

        {step === 3 && (
          <article className="destello-card">
            <div className="destello-progress"><i /><i /><span>03</span><small>Agencia</small></div>
            <h2>No todo depende de vos. Pero algo sí.</h2>
            <p>La agencia empieza al distinguir qué pertenece a tu campo de acción. No exige resolverlo todo: alcanza con ensayar otra relación.</p>
            <label htmlFor="gesture">¿Qué gesto pequeño depende de vos y permitiría probar otra configuración?</label>
            <textarea id="gesture" value={answers.gesture} onChange={(event) => update("gesture", event.target.value)} placeholder="Un gesto concreto, posible y pequeño…" rows={4} autoFocus />
            <div className="destello-actions">
              <button className="secondary" type="button" onClick={() => setStep(2)}>Volver</button>
              <button type="button" disabled={!answers.gesture.trim()} onClick={() => setStep(4)}>Revelar mi Destello <b>✦</b></button>
            </div>
          </article>
        )}

        {step === 4 && (
          <article className="destello-card destello-result">
            <div className="destello-flare" aria-hidden="true">✦</div>
            <p className="destello-result-overline">Primer Destello de Vigilia</p>
            <h2>No sos una forma fija.</h2>
            <p className="destello-revelation">Lo que llamaste identidad puede observarse como una configuración. Y lo que puede distinguirse, puede empezar a reconfigurarse.</p>
            <div className="destello-map">
              <div><small>La forma aprendida</small><strong>{answers.identity.trim()}</strong></div>
              <div><small>La interpretación</small><strong>{answers.interpretation.trim()}</strong></div>
              <div><small>Tu primer movimiento</small><strong>{answers.gesture.trim()}</strong></div>
            </div>
            <div className="destello-context">
              <h3>¿Qué acabás de hacer?</h3>
              <p>Para MPA, una <strong>forma</strong> es el modo en que algo se organiza y se expresa ahora. No define lo que sos en sentido absoluto: describe una configuración presente.</p>
              <p>Al separar lo observable de la interpretación, dejaste de mirar únicamente desde la frase y empezaste a mirar también la frase. Ese cambio del punto de observación es un primer movimiento de <strong>redirección metacognitiva</strong>.</p>
              <p>Después reconociste una zona de agencia: no una solución total, sino aquello sobre lo que sí podés actuar.</p>
            </div>
            <p className="destello-closing">No obtuviste una respuesta. Obtuviste una diferencia que antes no podías ver. Ese es tu Destello de Vigilia.</p>
            <div className="destello-actions destello-result-actions">
              <button className="secondary" type="button" onClick={restart}>Volver a atravesarla</button>
              <button type="button" onClick={saveDestello}>Guardar mi Destello <b>↓</b></button>
              <Link href="/mpa/portal">Regresar al Universo <b>→</b></Link>
            </div>
            <small className="destello-save-note">Elegí “Guardar como PDF” en la pantalla de impresión para conservarlo en tu dispositivo.</small>
          </article>
        )}
      </section>
      )}
    </main>
  );
}
