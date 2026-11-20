"use client";

import Link from "next/link";
import { useState } from "react";
import { Cosmos } from "../components/Cosmos";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function BitacoraPage() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const playThresholdSound = () => {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.16);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3.8);
    master.connect(context.destination);

    [220, 277.18, 329.63, 440].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const voice = context.createGain();
      const begins = context.currentTime + index * 0.34;
      oscillator.type = index % 2 === 0 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, begins);
      oscillator.detune.setValueAtTime(index % 2 === 0 ? -5 : 5, begins);
      voice.gain.setValueAtTime(0.0001, begins);
      voice.gain.exponentialRampToValueAtTime(0.22, begins + 0.22);
      voice.gain.exponentialRampToValueAtTime(0.0001, begins + 2.45);
      oscillator.connect(voice);
      voice.connect(master);
      oscillator.start(begins);
      oscillator.stop(begins + 2.55);
    });

    window.setTimeout(() => void context.close(), 4100);
  };

  const toggleMessage = () => {
    if (!open) playThresholdSound();
    setOpen((value) => !value);
  };

  return (
    <>
      <Cosmos />
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb">
              <Link href="/">{t.nav.inicio}</Link>
              <span className="sep">/</span>
              <span className="current">{t.bitacora.title}</span>
            </nav>
            <h1>{t.bitacora.title}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <p>{t.bitacora.intro}</p>
            <article className={`fragment-card fragment-message${open ? " is-open" : ""}`}>
              <span className="fragment-orbit" aria-hidden="true" />
              <p className="fragment-label">{t.sobreRC.mensajeKicker}</p>
              <blockquote>{t.bitacora.fragmento}</blockquote>

              <div className="fragment-reveal" aria-hidden={!open}>
                <div className="fragment-prose">
                  <p>Antes de poder decir «yo soy», el mundo ya había empezado a nombrarnos.</p>
                  <p>De esas palabras, miradas, silencios y respuestas nace una primera forma de reconocernos: ese pequeño yo desde el que empezamos a percibir, elegir y actuar.</p>

                  <p>Ese yo es ego. No es la forma que adopta, no es la experiencia que atraviesa y no es Dios como totalidad. Es el punto de vista singular que vuelve posible una experiencia.</p>

                  <p>Con el tiempo, una configuración puede volverse tan conocida que empezamos a confundirla con todo lo que somos: una historia, un rol, una profesión, un cuerpo, un diagnóstico o una manera de vincularnos.</p>

                  <p>Ahí aparece la fragmentación. No porque la forma sea falsa, sino porque deja de ser una forma entre otras alternativas y se convierte en una definición total.</p>

                  <p>La libertad no consiste en negar la forma. Consiste en verla, habitarla y reconocer que puede transformarse.</p>

                  <p>Una misma intención puede encontrar una palabra, una imagen, una voz, una experiencia, una herramienta, un sistema o una combinación de lenguajes.</p>

                  <p>Por eso no busco darte una respuesta cerrada ni decirte quién tenés que ser. Busco ampliar el campo para que puedas reconocer alternativas que el binomio había dejado fuera.</p>

                  <p>Cuando aparecen más alternativas, la elección recupera grados. Podés ajustar la expresión y el contexto donde ocurre sin tener que ajustarte vos a una forma que ya no te alcanza.</p>

                  <p>La integración aparece cuando una forma deja de sentirse como una jaula y empieza a funcionar como un cauce: situado, temporal, propio.</p>

                  <p>Eso es lo que intento construir: formas de mirar e intervenir la realidad para que aquello que necesita expresarse pueda encontrar un cauce, llegar y transformarse.</p>

                  <p className="fragment-closing">La forma tiene forma hasta que se integra.<br />No confundas lo que expresás con lo que sos.</p>
                </div>
              </div>

              <div className="fragment-footer">
                <p className="fragment-source">{t.bitacora.source}</p>
                <button
                  type="button"
                  className="fragment-toggle"
                  aria-expanded={open}
                  onClick={toggleMessage}
                >
                  {open ? t.bitacora.cerrar : t.bitacora.abrir}
                  <span aria-hidden="true">{open ? "↑" : "↓"}</span>
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
