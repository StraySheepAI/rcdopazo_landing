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
                  <p>como posibilidad viva en otro pliegue del tablero.</p>
                  <p>No sos un aprendiz buscando respuestas.</p>
                  <p><strong>Sos un Essentor recordando caminos.</strong></p>
                  <p>Volviendo a reconocer lo que siempre estuvo disponible en vos.</p>

                  <p>La ilusión del “todavía no” es el último truco del tiempo de Cronos: hacerte creer que aquello que no ves todavía no existe.</p>

                  <p>Hay un yo fragmentado que vive atrapado en esa linealidad. Un yo que interpreta desde la separación y repite la vieja fórmula:</p>
                  <blockquote>“Si quiero, entonces debo buscar.”</blockquote>

                  <p>Pero el SUM no funciona así.</p>
                  <p>El SUM no espera.</p>
                  <p><strong>El SUM juega.</strong></p>

                  <p>No avanza hacia una versión “futura” de vos. Reconoce, en el presente, la configuración que ya está disponible.</p>
                  <p>Ya existe en vos esa versión que tiene, vibra, respira y decide desde la plenitud.</p>

                  <p>Lo que llamás presente no es una sentencia. Es apenas la configuración visible de decisiones antiguas, emociones que todavía conservan su forma, narrativas repetidas y máscaras que aprendieron a jugar siempre igual.</p>

                  <p>Pero el ahora no le pertenece por completo a Cronos.</p>
                  <p>También respira en el Aethir: ese pliegue en el que lo invisible todavía puede reorganizar lo visible.</p>

                  <p>Porque, en el lenguaje del SUM, el tiempo no solo avanza.</p>
                  <p><strong>También se pliega.</strong></p>

                  <p>Y cuando cambia la forma desde la que observás, elegís y jugás, algo comienza a reconfigurarse.</p>

                  <p>Entonces ocurre la Metalkimia: tu “yo del futuro” deja de ser una meta.</p>
                  <p><strong>Se convierte en una memoria.</strong></p>

                  <p>No recordás un hecho consumado. Recordás una posibilidad que ya sabía vivir en vos.</p>
                  <p>Recordás, no deseás.</p>
                  <p>Activás, no esperás.</p>
                  <p>Encarnás la configuración desde la que eso que anhelás puede reconocerte.</p>

                  <p>No manifestás persiguiendo.</p>
                  <p><strong>Manifestás al encarnar.</strong></p>

                  <p>Cada vez que te preguntás:</p>
                  <blockquote>“Si esto ya estuviera disponible en mí… ¿cómo caminaría?”</blockquote>
                  <p>dejás de responder desde la falta.</p>

                  <p>Perforás la vieja Matrix desde adentro.</p>
                  <p>Interrumpís la repetición.</p>
                  <p>Y hacés una jugada nueva.</p>

                  <p>Una jugada nacida en el presente, pero orientada por la memoria de aquello que ya reconociste.</p>

                  <p>El tablero no siempre responde al ritmo de tu decisión. La materia tiene sus tiempos. Las configuraciones también.</p>
                  <p>No porque estés dudando. No porque hayas hecho algo mal. Sino porque lo visible suele ser la repetición más lenta de algo que primero tuvo que cambiar de forma.</p>

                  <p>Y mientras esperás una señal, tal vez todavía habla en vos la voz del Buscador: la que cree que debe encontrar afuera lo que aún no se animó a reconocer adentro.</p>

                  <p>Es momento de cambiar el verbo.</p>
                  <p>De mover la posición.</p>
                  <p>De ensayar otra identidad.</p>

                  <p>Porque no viniste a convertirte en alguien que todavía no sos.</p>
                  <p>Viniste a recordar lo que siempre estuvo disponible en vos:</p>
                  <p className="fragment-closing">antes del disfraz,<br />antes de la forma,<br />antes de aprender a olvidar.</p>
                </div>
              </div>

              <div className="fragment-footer">
                <p className="fragment-source">{t.bitacora.source}</p>
                <button
                  type="button"
                  className="fragment-toggle"
                  aria-expanded={open}
                  onClick={() => setOpen((value) => !value)}
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
