"use client";

import Link from "next/link";
import Image from "next/image";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function MpaTransmutaPage() {
  const { t, locale } = useLanguage();
  const mantra = locale === "es" ? {
    source: "DIMA · Fragmento estructural · Isaías 41:10", translation: "Contigo, yo.",
    premise: "Una traducción aprendida puede volver invisible una arquitectura.",
    question: "¿Y si la frase con la que te nombrás también fuera una traducción aprendida?",
    cta: "Entrar a Ego SUM · Laboratorio del Yo",
    foundations: ["Vigilia", "Correspondencia", "Agencia", "Configuración", "Potencia", "Transmutación"],
    passages: ["Pasajes", "Ludus", "Pulsus", "Vigilia"],
  } : {
    source: "DIMA · Structural fragment · Isaiah 41:10", translation: "With you, I.",
    premise: "A learned translation can render an architecture invisible.",
    question: "What if the phrase you use to name yourself were also a learned translation?",
    cta: "Enter Ego SUM · Laboratory of the Self",
    foundations: ["Vigilia", "Correspondence", "Agency", "Configuration", "Potency", "Transmutation"],
    passages: ["Passages", "Ludus", "Pulsus", "Vigilia"],
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
              <Link href="/mpa">{t.nav.mpa}</Link>
              <span className="sep">/</span>
              <span className="current">{t.nav.mpaTransmuta}</span>
            </nav>
            <h1>{t.nav.mpaTransmuta}</h1>
          </div>
        </section>

        <section className="page-body transmuta-body">
          <div className="container">
            <div className="transmuta-intro">
              <div>
                <p className="section-kicker">{t.mpa.transmutaKicker}</p>
                <p className="transmuta-lead">{t.mpa.transmutaBody1}</p>
                <p>{t.mpa.transmutaBody2}</p>
                <p>{t.mpa.transmutaBody3}</p>
              </div>
              <Image src="/mpa-coin-transmuta.png" alt="Sello MPA Transmuta" width={1024} height={1024} priority />
            </div>

            <section className="transmuta-mantra" aria-labelledby="transmuta-mantra-title">
              <p className="transmuta-mantra-source">{mantra.source}</p>
              <h2 id="transmuta-mantra-title" lang="he" dir="rtl">עִמְּךָ־אָנִי</h2>
              <p className="transmuta-mantra-translation">{mantra.translation}</p>
              <div className="transmuta-mantra-turn">
                <p>{mantra.premise}</p>
                <strong>{mantra.question}</strong>
                <Link href="/mpa/ego-sum">{mantra.cta} <span aria-hidden="true">→</span></Link>
              </div>
            </section>

            <section className="transmuta-branches" aria-label={t.mpa.transmutaPathsTitle}>
              <p className="section-kicker">{t.mpa.transmutaPathsTitle}</p>
              <div className="transmuta-branch-grid">
                <article className="transmuta-branch transmuta-foundations">
                  <span>01 · {t.mpa.foundationsKicker}</span>
                  <h2>{t.mpa.foundationsTitle}</h2>
                  <p>{t.mpa.foundationsBody}</p>
                  <div className="transmuta-foundation-map">
                    {mantra.foundations.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <p className="transmuta-branch-note">{t.mpa.foundationsNote}</p>
                </article>

                <article className="transmuta-branch transmuta-services">
                  <span>02 · {t.mpa.servicesKicker}</span>
                  <h2>{t.mpa.servicesTitle}</h2>
                  <p>{t.mpa.servicesBody}</p>
                  <div className="transmuta-service-list">
                    <div><b>{t.mpa.interventionTitle}</b><p>{t.mpa.interventionBody}</p></div>
                    <div><b>{t.mpa.redirectionTitle}</b><p>{t.mpa.redirectionBody}</p></div>
                  </div>
                  <div className="atrs-cycle">
                    <article><span>ATS</span><h3>{t.mpa.atsTitle}</h3><p>{t.mpa.atsBody}</p></article>
                    <b aria-hidden="true">⇄</b>
                    <article><span>ARS</span><h3>{t.mpa.arsTitle}</h3><p>{t.mpa.arsBody}</p></article>
                  </div>
                </article>

                <article className="transmuta-branch transmuta-formation">
                  <span>03 · {t.mpa.formationKicker}</span>
                  <h2>{t.mpa.schoolTitle}</h2>
                  <p>{t.mpa.schoolBody}</p>
                  <div className="transmuta-school-path">{mantra.passages.map((item, index) => <span key={item}>{index > 0 && <i>→</i>}{item}</span>)}</div>
                  <div className="transmuta-formation-entry">
                    <Image src="/pulsus-fractum-shield.png" alt="" width={280} height={420} />
                    <div><b>{t.mpa.pulsusTitle}</b><p>{t.mpa.pulsusBody}</p><Link href="/mpa/transmuta/pulsus-fractum">{t.mpa.pulsusCta} <span aria-hidden="true">→</span></Link></div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
