"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const seals = [
  { src: "/mpa-coin-evigila.png", label: "Evigila" },
  { src: "/mpa-coin-lude.png", label: "Lude" },
  { src: "/mpa-coin-transmuta.png", label: "Transmuta", href: "/mpa/transmuta" },
  { src: "/mpa-coin-ego-sum-v3-antique.png", label: "Ego SUM" },
  { src: "/mpa-coin-stray-sheep-v1.png", label: "Stray Sheep" },
];

export default function MpaPortalPage() {
  const [arrival, setArrival] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initiatedNow = params.get("initiation")?.toLowerCase() === "potentia";
    const alreadyInitiated = window.localStorage.getItem("mpa-initiation-key") === "potentia";

    if (initiatedNow) {
      window.localStorage.setItem("mpa-initiation-key", "potentia");
      window.history.replaceState({}, "", window.location.pathname);
      window.setTimeout(() => setArrival(true), 100);
    } else if (alreadyInitiated) {
      setArrival(true);
    } else {
      window.setTimeout(() => setArrival(true), 250);
    }
  }, []);

  return (
    <main className={`mpa-portal${arrival ? " mpa-portal-recognized" : ""}`}>
      <div className="mpa-arrival-flash" aria-hidden="true" />
      <header className="mpa-portal-header">
        <Link className="mpa-portal-brand" href="/mpa/universe" aria-label="Volver a la puerta de MPA">
          <Image src="/mpa-universe-logo.png" alt="" width={74} height={74} priority />
          <span>Magia para Atrevidos</span>
        </Link>

        <nav className="mpa-portal-seals" aria-label="Territorios de MPA">
          {seals.map((seal) => (
            seal.href ? (
              <Link className="mpa-seal" href={seal.href} key={seal.label} title={`${seal.label} · Entrar al territorio`}>
                <Image src={seal.src} alt="" width={84} height={84} />
                <small>{seal.label}</small>
              </Link>
            ) : (
              <button type="button" className="mpa-seal" key={seal.label} title={`${seal.label} · Próximamente`}>
                <Image src={seal.src} alt="" width={84} height={84} />
                <small>{seal.label}</small>
              </button>
            )
          ))}
        </nav>

        <div className="mpa-portal-tools">
          <button type="button" title="Próximamente">Buscar</button>
          <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="mpa-universe-menu">Menú</button>
        </div>
      </header>

      <div className={`mpa-universe-menu-scrim${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside id="mpa-universe-menu" className={`mpa-universe-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <button className="mpa-universe-menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
        <p className="mpa-universe-menu-kicker">Territorios del Universo</p>
        <h2>Transmuta</h2>
        <Link className="mpa-universe-school-entry" href="/mpa/transmuta/pulsus-fractum" onClick={() => setMenuOpen(false)}>
          <Image src="/pulsus-fractum-shield.png" alt="" width={180} height={220} />
          <span>
            <small>Escuela de Metalkimia</small>
            <strong>Pulsus Fractum</strong>
            <em>Explorar la Escuela</em>
          </span>
        </Link>
        <nav aria-label="Navegación del Universo">
          <Link href="/mpa/transmuta" onClick={() => setMenuOpen(false)}>Territorio Transmuta <b>→</b></Link>
          <Link href="/mpa/universe" onClick={() => setMenuOpen(false)}>Volver al umbral <b>→</b></Link>
          <Link href="/" onClick={() => setMenuOpen(false)}>R.C. Dopazo <b>→</b></Link>
        </nav>
      </aside>

      <section className="mpa-portal-hero">
        <div className="mpa-portal-nebula" aria-hidden="true" />
        <div className="mpa-portal-stars" aria-hidden="true" />
        <div className="mpa-portal-stars mpa-portal-stars-far" aria-hidden="true" />
        <div className="mpa-portal-vignette" aria-hidden="true" />

        <div className="mpa-portal-art">
          <Image
            src="/mpa-universe-hero.png"
            alt="Una escritora abre el Universo de Magia para Atrevidos"
            fill
            priority
            sizes="(max-width: 900px) 96vw, 82vw"
            className="mpa-portal-hero-image"
          />
          <div className="mpa-portal-emblem">
            <Image src="/mpa-universe-logo.png" alt="MPA · Evigila · Lude · Transmuta" width={512} height={512} priority />
          </div>
        </div>

        <Link className="mpa-return-rc" href="/" aria-label="Volver al inicio de R.C. Dopazo">
          <Image src="/rc-dopazo-emblem.png" alt="R.C. Dopazo" width={72} height={72} />
          <span>Volver a R.C. Dopazo</span>
        </Link>

        <div className="mpa-portal-welcome">
          <p>Has atravesado el umbral</p>
          <h1>Bienvenido al Universo MPA</h1>
          <span>Evigila · Lude · Transmuta</span>
        </div>
      </section>

      <section className="mpa-potentia" aria-labelledby="potentia-title">
        <div className="mpa-potentia-orbit" aria-hidden="true" />
        <p className="mpa-potentia-overline">Has atravesado el umbral</p>
        <p className="mpa-potentia-intro">Observaste lo que permanecía oculto. Aceptaste entrar en juego. Permitiste que algo cambiara de forma.</p>

        <div className="mpa-three-marks" aria-label="Las tres marcas del reto">
          <span>Evigila</span><i aria-hidden="true">✦</i><span>Lude</span><i aria-hidden="true">✦</i><span>Transmuta</span>
        </div>

        <div className="mpa-potentia-seal" aria-hidden="true">
          <Image
            src="/mpa-coin-potentia-v2-transparent.png"
            alt=""
            width={1254}
            height={1254}
            sizes="(max-width: 560px) 240px, 320px"
          />
          <span className="mpa-potentia-correct-label">Evigila · Lude · Transmuta</span>
        </div>

        <p className="mpa-potentia-recognition">El Universo reconoce tus tres marcas.</p>
        <h2 id="potentia-title">Tu primera llave de iniciado</h2>
        <p className="mpa-potentia-copy">Este sello no contiene un poder que te haya sido concedido. Reconoce la potencia que despertaste al atravesar el reto.</p>
        <p className="mpa-potentia-return">Guardalo. Cuando regreses, la puerta sabrá desde dónde llamás.</p>
      </section>

      <section className="mpa-portal-threshold">
        <p>El mundo que comienza detrás de esta puerta todavía está tomando forma.</p>
        <h2>Todo sello posee dos caras.</h2>
        <span>Próximamente abriremos el primer territorio.</span>
      </section>
    </main>
  );
}
