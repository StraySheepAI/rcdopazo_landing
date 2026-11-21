"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cosmos } from "./components/Cosmos";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { ArchitectureField } from "./components/ArchitectureField";
import { ObraCard } from "./components/ObraCard";
import { ContactForm } from "./components/ContactForm";
import { CosmicMotion } from "./components/CosmicMotion";
import { useLanguage } from "./lib/i18n/LanguageContext";
import { OBRA_CATEGORIES, getFeaturedObras, getObrasByCategory, getPublishedObras } from "./lib/obras";
import { getVisibleContactChannels } from "./lib/contact";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const contactChannels = getVisibleContactChannels();
  const [openPanel, setOpenPanel] = useState<"revelation" | "polaris" | "about" | null>(null);
  const [obraFilter, setObraFilter] = useState<"destacadas" | "todas" | string>("destacadas");

  const togglePanel = (panel: "revelation" | "polaris" | "about", id: string) => {
    if (openPanel === panel) {
      setOpenPanel(null);
      return;
    }
    setOpenPanel(panel);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const obraFilters = useMemo(
    () => [
      { id: "destacadas", label: t.obrasPage.filtroDestacadas, glyph: "★" },
      { id: "todas", label: t.obrasPage.filtroTodas, glyph: "◆" },
      ...OBRA_CATEGORIES.map((category) => ({ id: category.id, label: category.label, glyph: category.glyph, description: category.description })),
    ],
    [t]
  );

  const visibleObras = useMemo(() => {
    if (obraFilter === "destacadas") return getFeaturedObras();
    if (obraFilter === "todas") return getPublishedObras();
    return getObrasByCategory(obraFilter);
  }, [obraFilter]);

  const activeObraFilter = obraFilters.find((filter) => filter.id === obraFilter);

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
  }, [openPanel]);

  return (
    <>
      <Cosmos />
      <CosmicMotion />
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
              src="/hero-cosmic-bg.jpg"
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
                  <button className="button primary" type="button" onClick={() => togglePanel("polaris", "polaris")}>
                    {t.hero.ctaExplorar} <span aria-hidden="true">↗</span>
                  </button>
                  <button className="button secondary" type="button" onClick={() => togglePanel("revelation", "distincion")}>
                    {t.hero.ctaRevelacion}
                  </button>
                </div>
              </div>
              <div className="hero-portrait" aria-label="R.C. Dopazo">
                <Image
                  src="/rc-bio-photo.jpg"
                  alt="R.C. Dopazo"
                  fill
                  priority
                  sizes="(max-width: 1000px) 80vw, 38vw"
                />
                <Image
                  className="hero-signature"
                  src="/rc-dopazo-signature.png"
                  alt="Firma de R.C. Dopazo"
                  width={688}
                  height={688}
                />
                <div className="hero-portrait-caption">
                  <small>Una configuración situada</small>
                </div>
              </div>
              <div className="hero-field">
                <ArchitectureField />
              </div>
            </div>
          </div>
        </section>

        {/* OBRAS DESTACADAS — queda inmediatamente después del hero para que
            la página muestre primero la producción viva, antes de los bloques
            conceptuales plegables. */}
        <section className="novedades" id="libro">
          <div className="container">
            <p className="section-kicker">Novedades</p>
            <p className="novedades-tag"><span className="pulse-dot" /> {t.obrasDestacadas.kicker}</p>

            <div className="obras-filters home-obras-filters" role="tablist" aria-label={t.nav.obras}>
              {obraFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  role="tab"
                  aria-selected={obraFilter === filter.id}
                  className={`filter-chip${obraFilter === filter.id ? " active" : ""}`}
                  onClick={() => setObraFilter(filter.id)}
                >
                  <span className="filter-glyph" aria-hidden="true">{filter.glyph}</span>
                  <span className="filter-label">{filter.label}</span>
                </button>
              ))}
            </div>
            {activeObraFilter && "description" in activeObraFilter && <p className="filter-description">{activeObraFilter.description}</p>}
            {visibleObras.map((obra) => (
              <ObraCard key={obra.id} obra={obra} variant={obraFilter === "destacadas" ? "featured" : "catalog"} />
            ))}
            <Link href="/obras" className="home-section-link">
              {t.obrasDestacadas.verTodas} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="home-panel-nav" aria-label="Recorridos de la página">
          <div className="container home-panel-grid">
            <button
              className={`home-panel-trigger ${openPanel === "revelation" ? "is-active" : ""}`}
              type="button"
              onClick={() => togglePanel("revelation", "distincion")}
            >
              <strong>{t.revelacion.kicker}</strong>
              <small>Ego SUM · la forma no es el ser</small>
            </button>
            <button
              className={`home-panel-trigger ${openPanel === "polaris" ? "is-active" : ""}`}
              type="button"
              onClick={() => togglePanel("polaris", "polaris")}
            >
              <strong>{t.revelacion.threeTitle}</strong>
              <small>{t.hero.eyebrow}</small>
            </button>
            <button
              className={`home-panel-trigger ${openPanel === "about" ? "is-active" : ""}`}
              type="button"
              onClick={() => togglePanel("about", "sobre")}
            >
              <strong>{t.sobreRC.kicker}</strong>
              <small>{t.sobreRC.title}</small>
            </button>
          </div>
        </section>

        {/* REVELACIÓN FUNDACIONAL — se abre desde el botón correspondiente. */}
        {openPanel === "revelation" && <section className="section home-panel-content" id="distincion">
          <div className="container">
            <p className="section-kicker">{t.revelacion.kicker}</p>
            <div className="section-split">
              <div>
                <h2 className="revelation-title">{t.revelacion.title}</h2>
                <p className="about-statement">{t.revelacion.intro}</p>
                <p className="section-body">{t.revelacion.fragmentationBody}</p>
              </div>
              <div className="note-card" id="ego-sum">
                <p className="note-kicker">Ego SUM</p>
                <Image className="ego-sum-emblem" src="/ego-sum-seal.png" alt="Ego SUM" width={220} height={220} />
                <h3>{t.revelacion.correspondencesTitle}</h3>
                <p>{t.revelacion.correspondencesBody}</p>
                <p className="fragment-closing">{t.revelacion.integrationQuote}</p>
                <div className="ego-sum-entry">
                  <a
                    className="ego-sum-motto"
                    href="#ego-sum"
                    aria-disabled="true"
                    onClick={(event) => event.preventDefault()}
                  >
                    <span>Fragmentum · Amatur · Integratum</span>
                    <small>Ego SUM · próximamente</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>}

        {/* POLARIS — el recorrido de problema, alternativas y solución. */}
        {openPanel === "polaris" && <section className="section home-panel-content" id="polaris">
          <div className="container">
            <p className="section-kicker">Polos · Grados · Configuración · Presente</p>
            <h2 className="polaris-title">{t.revelacion.threeTitle}</h2>
            <p className="section-body">{t.revelacion.threeBody}</p>
            <p className="polaris-note">{t.revelacion.polarisNote}</p>
            <div className="revelation-triad">
              <article className="revelation-triad-card">
                <p className="triad-label">{t.revelacion.problemLabel}</p>
                <h4>{t.revelacion.problemTitle}</h4>
                <p>{t.revelacion.problemBody}</p>
              </article>
              <article className="revelation-triad-card">
                <p className="triad-label">{t.revelacion.alternativeLabel}</p>
                <h4>{t.revelacion.alternativeTitle}</h4>
                <p>{t.revelacion.alternativeBody}</p>
              </article>
              <article className="revelation-triad-card">
                <p className="triad-label">{t.revelacion.solutionLabel}</p>
                <h4>{t.revelacion.solutionTitle}</h4>
                <p>{t.revelacion.solutionBody}</p>
              </article>
            </div>
            <div className="polaris-diagram" aria-label="Diagrama animado de polos, grados y configuración">
              <ArchitectureField />
            </div>
            <blockquote className="revelation-balance-quote">{t.revelacion.balanceQuote}</blockquote>
            <p className="integration-highlight">{t.revelacion.integrationBody}</p>
          </div>
        </section>}

        {/* SOBRE R.C. — la persona y la foto aparecen después de la distinción,
            para que la nueva esencia se entienda antes de entrar en la obra. */}
        {openPanel === "about" && <section className="section home-panel-content" id="sobre">
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
              <div className="about-photo">
                <Image src="/rc-bio-photo.jpg" alt="R.C. Dopazo" width={1000} height={1333} />
                <Image
                  className="about-signature"
                  src="/rc-dopazo-signature.png"
                  alt="Firma de R.C. Dopazo"
                  width={688}
                  height={688}
                />
              </div>
            </div>
          </div>
        </section>}

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

        {/* DIMENSIONES — dos expresiones de una misma mirada. */}
        <section className="section" id="dimensiones">
          <div className="container">
            <p className="section-kicker">{t.dimensiones.kicker}</p>
            <h2>{t.dimensiones.title}</h2>
            <div className="gradient-rule" />
            <div className="nodes-grid">
              <article className="node-card reveal">
                <span>MPA</span>
                <h3>{t.dimensiones.mpaLabel}</h3>
                <p>{t.dimensiones.mpaBody}</p>
              </article>
              <article className="node-card reveal">
                <span>FLOW</span>
                <h3>{t.dimensiones.flowLabel}</h3>
                <p>{t.dimensiones.flowBody}</p>
              </article>
            </div>
          </div>
        </section>

        {/* CONTACTO — canales centralizados en lib/contact.ts. Página
            personal, contacto propio: no se comparte con MPA Flow ni con
            el portfolio laboral. */}
        <section className="section" id="contacto">
          <div className="container">
            <p className="section-kicker">{t.contacto.kicker}</p>
            <h2>{t.contacto.title}</h2>
            <div className="gradient-rule" />
            <p className="contact-intro">{t.contacto.intro}</p>

            <div className="contact-layout">
              <ContactForm copy={t.contacto.form} />
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
