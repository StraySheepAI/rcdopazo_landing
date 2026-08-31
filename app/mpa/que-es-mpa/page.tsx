"use client";

import Link from "next/link";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

export default function QueEsMpaPage() {
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
              <span className="current">{t.nav.queEsMpa}</span>
            </nav>
            <h1>{t.nav.queEsMpa}</h1>
          </div>
        </section>

        <section className="page-body">
          <div className="container">
            <p>{t.mpa.queEsMpaBody1}</p>
            <p>{t.mpa.queEsMpaBody2}</p>
            <p>{t.mpa.queEsMpaBody3}</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
