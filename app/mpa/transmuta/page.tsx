"use client";

import Link from "next/link";
import Image from "next/image";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function MpaTransmutaPage() {
  const { t } = useLanguage();
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

            <section className="transmuta-school">
              <span className="section-kicker">Territorio de formación</span>
              <h2>{t.mpa.schoolTitle}</h2>
              <p>{t.mpa.schoolBody}</p>
              <div className="transmuta-school-path"><span>Vigilia</span><i>→</i><span>Distinción</span><i>→</i><span>Agencia</span><i>→</i><span>Transmutación</span></div>
            </section>

            <section className="atrs-section">
              <div className="atrs-heading"><span className="section-kicker">Arquitectura metodológica</span><h2>{t.mpa.atrsTitle}</h2><p>{t.mpa.atrsBody}</p></div>
              <div className="atrs-cycle">
                <article><span>01</span><h3>{t.mpa.atsTitle}</h3><p>{t.mpa.atsBody}</p></article>
                <b aria-hidden="true">⇄</b>
                <article><span>02</span><h3>{t.mpa.arsTitle}</h3><p>{t.mpa.arsBody}</p></article>
              </div>
            </section>

            <div className="transmuta-school-gate">
              <div className="transmuta-school-gate-copy">
                <span>Cámara avanzada de la Escuela</span>
                <h2>{t.mpa.pulsusTitle}</h2>
                <p>{t.mpa.pulsusBody}</p>
                <Link href="/mpa/transmuta/pulsus-fractum">{t.mpa.pulsusCta} <b aria-hidden="true">→</b></Link>
              </div>
              <Image className="transmuta-school-gate-shield" src="/pulsus-fractum-shield.png" alt="Escudo de Pulsus Fractum" width={1024} height={1536} sizes="(max-width: 760px) 180px, 240px" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
