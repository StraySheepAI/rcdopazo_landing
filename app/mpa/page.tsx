"use client";

import Link from "next/link";
import Image from "next/image";
import { Cosmos } from "../components/Cosmos";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function MpaPage() {
  const { t } = useLanguage();

  const DOORS = [
    { href: "/mpa/universe", label: "Evigila", body: t.mpa.evigilaBody, symbol: "/mpa-coin-evigila.png" },
    { href: "/mpa/portal", label: "Lude", body: t.mpa.ludeBody, symbol: "/mpa-coin-lude.png" },
    { href: "/mpa/transmuta", label: "Transmuta", body: t.mpa.transmutaDoorBody, symbol: "/mpa-coin-transmuta.png" },
  ];

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
              <span className="current">{t.nav.mpa}</span>
            </nav>
            <h1>{t.mpa.titleIndex}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <p className="mpa-index-mantra">{t.mpa.mantra}</p>
            <p>{t.mpa.introIndex}</p>
            <Link className="home-section-link" href="/mpa/que-es-mpa">{t.mpa.introCta} <span aria-hidden="true">→</span></Link>

            <p className="mpa-capabilities-label">Evigila · Lude · Transmuta</p>
            <div className="pillar-links mpa-door-grid">
              {DOORS.map((child, i) => (
                <Link className="pillar-link-card mpa-door-card" href={child.href} key={child.href}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <Image className="pillar-link-symbol" src={child.symbol} alt="" width={240} height={240} sizes="(max-width: 700px) 100px, 130px" />
                  <div className="pillar-link-copy"><h3>{child.label}</h3><p>{child.body}</p><small>Entrar al territorio</small></div>
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>

            <section className="mpa-related-territories">
              <p className="section-kicker">{t.mpa.relatedTitle}</p>
              <div>
                <Link href="/mpa/publishing-house"><Image src="/mpa-publishing-house-logo.png" alt="" width={90} height={90} /><span><b>{t.nav.mpaPublishingHouse}</b><small>{t.mpa.publishingShort}</small></span></Link>
                <a href="https://mpaflow.com"><Image src="/mpa-flow-logo.png" alt="" width={90} height={90} /><span><b>{t.nav.mpaFlow}</b><small>{t.mpa.flowShort}</small></span></a>
              </div>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
