"use client";

import Link from "next/link";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function MpaPublishingHousePage() {
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
              <span className="current">{t.nav.mpaPublishingHouse}</span>
            </nav>
            <h1>{t.nav.mpaPublishingHouse}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <span className="draft-badge">{t.mpa.publishingBadge}</span>
            <p>{t.mpa.publishingBody}</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
