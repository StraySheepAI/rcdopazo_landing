"use client";

import Link from "next/link";
import Image from "next/image";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function QueEsMpaPage() {
  const { t } = useLanguage();
  const territories = [
    { href: "/mpa/universe", label: "Evigila", symbol: "/mpa-coin-evigila.png" },
    { href: "/mpa/portal", label: "Lude", symbol: "/mpa-coin-lude.png" },
    { href: "/mpa/transmuta", label: "Transmuta", symbol: "/mpa-coin-transmuta.png" },
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
              <Link href="/mpa">{t.nav.mpa}</Link>
              <span className="sep">/</span>
              <span className="current">{t.nav.queEsMpa}</span>
            </nav>
            <div className="mpa-about-heading">
              <Image src="/mpa-general-logo.png" alt="Símbolo MPA" width={320} height={320} priority />
              <h1>{t.nav.queEsMpa}</h1>
            </div>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <blockquote className="mpa-manifesto-line">{t.mpa.mantra}</blockquote>
            <p>{t.mpa.queEsMpaBody1}</p>
            <p>{t.mpa.queEsMpaBody2}</p>
            <p>{t.mpa.queEsMpaBody3}</p>
            <nav className="mpa-symbol-gateway" aria-label="Territorios MPA">
              {territories.map((territory) => (
                <Link href={territory.href} key={territory.href} aria-label={territory.label}>
                  <Image src={territory.symbol} alt="" width={240} height={240} />
                  <span>{territory.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mpa-related-out">
              <span>{t.mpa.relatedTitle}</span>
              <Link href="/mpa/publishing-house">{t.nav.mpaPublishingHouse} <b>→</b></Link>
              <a href="https://mpaflow.com">{t.nav.mpaFlow} <b>↗</b></a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
