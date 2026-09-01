"use client";

import Link from "next/link";
import Image from "next/image";
import { Cosmos } from "../components/Cosmos";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function MpaPage() {
  const { t } = useLanguage();

  const CHILDREN = [
    { href: "/mpa/que-es-mpa", label: t.nav.queEsMpa, symbol: "/mpa-general-logo.png" },
    { href: "/mpa/universe", label: t.nav.mpaUniverse, symbol: "/mpa-universe-logo.png" },
    { href: "/mpa/transmuta", label: t.nav.mpaTransmuta, symbol: "/mpa-coin-transmuta.png" },
    { href: "https://mpaflow.com", label: t.nav.mpaFlow, symbol: "/mpa-flow-logo.png" },
    { href: "/mpa/publishing-house", label: t.nav.mpaPublishingHouse, symbol: "/mpa-publishing-house-logo.png" },
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
            <p>{t.mpa.introIndex}</p>

            <div className="pillar-links">
              {CHILDREN.map((child, i) => (
                <Link className="pillar-link-card" href={child.href} key={child.href}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <Image className="pillar-link-symbol" src={child.symbol} alt="" width={240} height={240} sizes="(max-width: 700px) 100px, 130px" />
                  <div className="pillar-link-copy"><h3>{child.label}</h3><small>Entrar al territorio</small></div>
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
