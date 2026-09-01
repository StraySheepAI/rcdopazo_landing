"use client";

import Link from "next/link";
import { Cosmos } from "../components/Cosmos";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function DimaPage() {
  const { locale } = useLanguage();
  const copy = locale === "es"
    ? {
        signal: "Una señal desde el Cosmarium",
        title: "Mundo Dima",
        text: "Este mundo todavía está tomando forma. Dima ya vive aquí; pronto comenzará a revelar su historia.",
        status: "En construcción",
        back: "Volver a Magia para Atrevidos",
      }
    : {
        signal: "A signal from the Cosmarium",
        title: "Dima's World",
        text: "This world is still taking shape. Dima already lives here; soon, the story will begin to reveal itself.",
        status: "Under construction",
        back: "Return to Magia para Atrevidos",
      };

  return (
    <>
      <Cosmos />
      <SiteHeader />
      <main className="dima-coming-soon">
        <section className="dima-coming-soon-card">
          <p>{copy.signal}</p>
          <div className="dima-coming-soon-mark" aria-hidden="true">D</div>
          <h1>{copy.title}</h1>
          <blockquote>{copy.text}</blockquote>
          <span>{copy.status}</span>
          <Link href="/mpa">{copy.back} <b aria-hidden="true">→</b></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
