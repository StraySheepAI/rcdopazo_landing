"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Cosmos } from "./components/Cosmos";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ArchitectureField } from "./components/ArchitectureField";
import { ObraCard } from "./components/ObraCard";
import { useLanguage } from "./lib/i18n/LanguageContext";
import { getFeaturedObras } from "./lib/obras";
import { getVisibleContactChannels } from "./lib/contact";
import { EXPLORAR_UNIVERSO_CTA } from "./lib/site-config";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const featuredObras = getFeaturedObras();
  const contactChannels = getVisibleContactChannels();

  useEffect(() => {
    const targets = mainRef.current?.querySelectorAll(".reveal");
    if (!targets || targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Cosmos />
      <SiteHeader />

      <main id="top" ref={mainRef}>
        {/* HERO — ArchitectureField integrado como representación visual
            de "Hacer visible la configuración invisible." (id="universo"
            se mantiene porque el botón "Explorar el universo" ya apuntaba
            a esa ancla; el destino definitivo del CTA todavía no está
            confirmado, ver lib/site-config.ts). */}
        <section className="hero" id="universo">
          <div className="hero-photo">
            <Image
              src="/hero-bg.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow">{t.hero.eyebrow}</p>
                <h1>{t.hero.title}</h1>
                <p className="hero-tagline">{t.hero.tagline}</p>
                <p className="hero-body">{t.hero.body}</p>
                <div className="hero-actions">
                  {/* CTA "Explorar el universo": destino todavía sin
                      confirmar (ver lib/site-config.ts). Mientras no haya
                      un href definido, el botón no simula una navegación
                      real: queda deshabilitado visualmente en vez de
                      apuntar a un ancla que no lleva a ningún lado. */}
                  {EXPLORAR_UNIVERSO_CTA.href ? (
                    <a
                      className="button primary"
                      href={EXPLORAR_UNIVERSO_CTA.href}
                      target={EXPLORAR_UNIVERSO_CTA.external ? "_blank" : undefined}
                      rel={EXPLORAR_UNIVERSO_CTA.external ? "noreferrer" : undefined}
                    >
                      {t.hero.ctaExplorar} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="button primary" aria-disabled="true" style={{ cursor: "default" }}>
                      {t.hero.ctaExplorar} <span aria-hidden="true">↗</span>
                    </span>
                  )}
                  <a className="button secondary" href="#contacto">
                    {t.hero.ctaContacto}
                  </a>
                </div>
              </div>
              <div className="hero-field">
                <ArchitectureField />
              </div>
            </div>
          </div>
        </section>

        {/* OBRAS DESTACADAS — vidriera editorial (featured && published,
            orden por featuredOrder), consultada desde lib/obras.ts. Misma
            fuente que /obras: si una obra se desmarca como featured,
            desaparece de acá automáticamente (y de la vista Destacadas de
            /obras), sin dejar de existir en el catálogo general. */}
        <section className="novedades" id="libro">
          <div className="container">
            <p className="section-kicker">{t.obrasDestacadas.kicker}</p>
            {featuredObras.length > 0 && (
              <p className="novedades-tag">
                <span className="pulse-dot" /> {t.obrasDestacadas.tagRecien}
              </p>
            )}
            {featuredObras.map((obra) => (
              <ObraCard key={obra.id} obra={obra} variant="featured" />
            ))}
            <Link href="/obras" className="home-section-link">
              {t.obrasDestacadas.verTodas} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* PHRASE TICKER */}
        <div className="phrase-ticker">
          <div className="ticker-track">
            {[0, 1].map((set) => (
              <div className="ticker-set" key={set}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <span className="ticker-item" key={i}>
                    {i % 2 === 0 ? (
                      <>
                        <b>{t.ticker.algunasB}</b> {t.ticker.algunas}
                      </>
                    ) : (
                      <>
                        <b>{t.ticker.otrasB}</b> {t.ticker.otras}
                      </>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* SOBRE R.C. — ampliado: más protagonismo de la foto, espacio
            para varios párrafos y un bloque "Un mensaje para ti" preparado
            para recibir el contenido definitivo (no se inventa acá). */}
        <section className="section" id="sobre">
          <div className="container">
            <p className="section-kicker">{t.sobreRC.kicker}</p>
            <div className="about-layout">
              <div className="about-copy">
                <h2>{t.sobreRC.title}</h2>
                <p className="about-statement">{t.sobreRC.statement}</p>
                <p>{t.sobreRC.body}</p>

                <div className="about-mensaje">
                  <p className="section-kicker">{t.sobreRC.mensajeKicker}</p>
                  <p>{t.sobreRC.mensajeIntro}</p>
                  <Link href="/bitacora" className="home-section-link">
                    {t.sobreRC.mensajeCta} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="about-photo reveal">
                <Image src="/rc-bio-photo.jpg" alt="R.C. Dopazo" width={1000} height={1333} />
              </div>
            </div>
          </div>
        </section>

        {/* EXCEDIENDO CARACTERES — oculta de Home a pedido explícito de una
            ronda anterior (sigue "en construcción" solo en el perfil
            laboral/portfolio). No se borra: se comenta para conservar el
            contenido fuente.
        <section className="section" id="notas">
          <span className="section-index">01</span>
          <div className="container">
            <p className="section-kicker">Excediendo caracteres</p>
            <h2>Escribir para transformar experiencia en conocimiento compartido.</h2>
            <div className="gradient-rule" />
            <p className="section-body">
              Notas que nacen cuando una idea no entra en un post. Reflexiones
              sobre trabajo, identidad, sistemas, tecnología y las
              configuraciones que elegimos construir.
            </p>

            <div className="note-card reveal">
              <span className="dot-deco gold" style={{ top: 20, right: 64 }} />
              <span className="dot-deco fuchsia" style={{ top: 68, right: 26 }} />
              <span className="note-badge">Open to work</span>
              <p className="note-kicker">
                Reconfiguración en curso · Primera nota · Trabajo e identidad
              </p>
              <h3>Estrenando frame</h3>
              <p>
                Una reflexión sobre vulnerabilidad, trayectoria profesional y
                el acto de hacer visible una nueva configuración.
              </p>
              <a
                href="https://portfolio.rociodopazo.com/excediendo-caracteres/open-to-work"
                target="_blank"
                rel="noreferrer"
              >
                Leer la nota <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        */}

        {/* CONTACTO — canales centralizados en lib/contact.ts. Página
            personal, contacto propio: no se comparte con MPA Flow ni con
            el portfolio laboral. */}
        <section className="section" id="contacto">
          <div className="container">
            <p className="section-kicker">{t.contacto.kicker}</p>
            <h2>{t.contacto.title}</h2>
            <div className="gradient-rule" />
            <p className="contact-intro">{t.contacto.intro}</p>

            <div className="contact-cards">
              {contactChannels.map((channel) =>
                channel.href ? (
                  <a className="contact-card reveal" href={channel.href} key={channel.id}>
                    <span>{channel.label === "Email" ? t.contacto.email : channel.label}</span>
                    <strong>{channel.value}</strong>
                  </a>
                ) : (
                  <div className="contact-card reveal" style={{ opacity: 0.6 }} key={channel.id}>
                    <span>{channel.label === "Redes" ? t.contacto.redes : channel.label}</span>
                    <strong>{channel.value === "Próximamente" ? t.contacto.proximamente : channel.value}</strong>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
