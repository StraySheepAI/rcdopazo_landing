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

            <section className="transmuta-branches" aria-label={t.mpa.transmutaPathsTitle}>
              <p className="section-kicker">{t.mpa.transmutaPathsTitle}</p>
              <div className="transmuta-branch-grid">
                <article className="transmuta-branch transmuta-services">
                  <span>01 · {t.mpa.servicesKicker}</span>
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
                  <span>02 · {t.mpa.formationKicker}</span>
                  <h2>{t.mpa.schoolTitle}</h2>
                  <p>{t.mpa.schoolBody}</p>
                  <div className="transmuta-school-path"><span>Pasajes</span><i>→</i><span>Ludus</span><i>→</i><span>Pulsus</span><i>→</i><span>Vigilia</span></div>
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
