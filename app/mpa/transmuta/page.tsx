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

        <section className="page-body">
          <div className="container">
            <p className="section-kicker">{t.mpa.transmutaKicker}</p>
            <p>{t.mpa.transmutaBody1}</p>
            <p>{t.mpa.transmutaBody2}</p>
            <p>{t.mpa.transmutaBody3}</p>
            <div className="transmuta-school-gate">
              <div className="transmuta-school-gate-copy">
                <span>Territorio de formación</span>
                <h2>Pulsus Fractum</h2>
                <p>La Escuela de Metalkimia: un atlas vivo para observar, practicar y reconfigurar.</p>
                <Link href="/mpa/transmuta/pulsus-fractum">Atravesar el umbral de la Escuela <b aria-hidden="true">→</b></Link>
              </div>
              <Image
                className="transmuta-school-gate-shield"
                src="/pulsus-fractum-shield.png"
                alt="Escudo de Pulsus Fractum"
                width={1024}
                height={1536}
                sizes="(max-width: 760px) 180px, 240px"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
