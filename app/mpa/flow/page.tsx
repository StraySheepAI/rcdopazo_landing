"use client";

import Image from "next/image";
import Link from "next/link";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function MpaFlowPage() {
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
              <span className="current">{t.nav.mpaFlow}</span>
            </nav>
            <h1>{t.nav.mpaFlow}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <div className="obra-card" style={{ maxWidth: 420 }}>
              <div className="obra-visual">
                <Image
                  src="/mpa-flow-logo.png"
                  alt="MPA Flow"
                  width={512}
                  height={512}
                  className="obra-logo"
                />
              </div>
              <div className="obra-body">
                <p>{t.mpa.flowBody}</p>
                <a href="https://mpaflow.com" target="_blank" rel="noreferrer">
                  {t.mpa.flowCta} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
