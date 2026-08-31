"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Cosmos } from "../../components/Cosmos";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const UNIVERSE_DESTINATION = "/mpa/portal";
const INITIATION_CHALLENGE = "https://reto.magiaparaatrevidos.com/";

export default function MpaUniversePage() {
  const { t } = useLanguage();
  const [key, setKey] = useState("");
  const [territoryKey, setTerritoryKey] = useState("");
  const [ordoKey, setOrdoKey] = useState("");
  const [message, setMessage] = useState<"accepted" | "rejected" | null>(null);
  const [messageText, setMessageText] = useState("");
  const [recognized, setRecognized] = useState({ key: false, territory: false, ordo: false });

  useEffect(() => {
    const initiation = window.localStorage.getItem("mpa-initiation-key");
    const level = window.localStorage.getItem("mpa-campus-level") || "";
    const next = { key: initiation === "potentia", territory: false, ordo: false };

    if (next.key) setKey("potentia");
    if (level === "general") {
      setTerritoryKey("metalkimia");
      next.territory = true;
    } else if (level.startsWith("ordo:")) {
      setTerritoryKey(level.split(":")[1] || "");
      next.territory = true;
    } else if (level.startsWith("course:")) {
      const [, territory, id] = level.split(":");
      setTerritoryKey(territory || "");
      setOrdoKey(id || "");
      next.territory = true;
      next.ordo = true;
    }
    setRecognized(next);
  }, []);

  function enterUniverse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = key.trim().toLowerCase();
    const second = territoryKey.trim().toLowerCase();
    const third = ordoKey.trim().toLowerCase();

    if (first !== "potentia") {
      setMessage("rejected");
      setMessageText("La primera palabra no ha sido reconocida.");
      return;
    }

    window.localStorage.setItem("mpa-initiation-key", "potentia");

    if (!second && !third) {
      setMessage("accepted");
      setMessageText("Primera marca reconocida. El Universo se abre.");
      window.setTimeout(() => window.location.assign(`${UNIVERSE_DESTINATION}?initiation=potentia`), 900);
      return;
    }

    const validTerritories = ["metalkimia", "custos", "architectus", "reconfigura"];
    if (!validTerritories.includes(second)) {
      setMessage("rejected");
      setMessageText("La segunda palabra todavía no corresponde a este territorio.");
      return;
    }

    window.sessionStorage.setItem("mpa-campus-unlocked", "1");

    if (second === "metalkimia" && !third) {
      window.localStorage.setItem("mpa-campus-level", "general");
      setMessage("accepted");
      setMessageText("Territorio reconocido. El Campus común se abre.");
      window.setTimeout(() => window.location.assign("/mpa/transmuta/pulsus-fractum#campus"), 900);
      return;
    }

    if (second === "metalkimia" && third) {
      setMessage("rejected");
      setMessageText("Para una cursada específica, la segunda palabra debe nombrar un Ordo.");
      return;
    }

    if (!third) {
      window.localStorage.setItem("mpa-campus-level", `ordo:${second}`);
      setMessage("accepted");
      setMessageText(`Ordo ${second.toUpperCase()} reconocido.`);
      window.setTimeout(() => window.location.assign("/mpa/transmuta/pulsus-fractum#campus"), 900);
      return;
    }

    const normalizedId = third.replace(/\s+/g, "").toUpperCase();
    if (second === "custos" && normalizedId !== "A17") {
      setMessage("rejected");
      setMessageText("La identificación de esta cursada no ha sido reconocida.");
      return;
    }

    window.localStorage.setItem("mpa-campus-level", `course:${second}:${normalizedId}`);
    setMessage("accepted");
    setMessageText(`Tríada completa. ${second.toUpperCase()} ${normalizedId} reconocido.`);
    window.setTimeout(() => window.location.assign("/mpa/transmuta/pulsus-fractum#campus"), 900);
  }

  return (
    <>
      <Cosmos />
      <SiteHeader />
      <main className="universe-page">
        <section className="universe-gateway">
          <Image src="/mpa-universe-hero.png" alt="" fill priority sizes="100vw" className="universe-gateway-bg" />
          <div className="universe-gateway-shade" />

          <div className="container universe-gateway-inner">
            <nav className="breadcrumb universe-breadcrumb">
              <Link href="/">{t.nav.inicio}</Link><span className="sep">/</span>
              <Link href="/mpa">{t.nav.mpa}</Link><span className="sep">/</span>
              <span className="current">{t.nav.mpaUniverse}</span>
            </nav>
            <h1 className="sr-only">{t.nav.mpaUniverse}</h1>

            <div className="universe-access">
              <div className="universe-logo-float">
                <Image src="/mpa-universe-logo.png" alt="MPA · Evigila · Lude · Transmuta" width={512} height={512} priority />
              </div>
              <div className="universe-access-panel">
                <p className="universe-access-kicker">Presentá tu configuración actual</p>
                <p>La puerta reconocerá hasta dónde puede acompañarte.</p>
                <form onSubmit={enterUniverse} className="universe-key-form universe-triad-form">
                  <div className={`universe-key-seal${key ? " is-filled" : ""}${recognized.key ? " is-recognized" : ""}`}>
                    <span>I</span>
                    <label htmlFor="universe-key">Llave</label>
                    <input id="universe-key" type="password" value={key} onChange={(event) => { setKey(event.target.value); setRecognized(current => ({ ...current, key: false })); setMessage(null); setMessageText(""); }} placeholder="••••••••" autoComplete="off" />
                    <small>{recognized.key ? "Reconocida" : "Primer sello"}</small>
                  </div>
                  <i className="universe-key-connector" aria-hidden="true">✦</i>
                  <div className={`universe-key-seal${territoryKey ? " is-filled" : ""}${recognized.territory ? " is-recognized" : ""}`}>
                    <span>II</span>
                    <label htmlFor="territory-key">Territorio</label>
                    <input id="territory-key" type="password" value={territoryKey} onChange={(event) => { setTerritoryKey(event.target.value); setRecognized(current => ({ ...current, territory: false, ordo: false })); setMessage(null); setMessageText(""); }} placeholder="••••••••" autoComplete="off" />
                    <small>{recognized.territory ? "Reconocido" : "Segundo sello"}</small>
                  </div>
                  <i className="universe-key-connector" aria-hidden="true">✦</i>
                  <div className={`universe-key-seal${ordoKey ? " is-filled" : ""}${recognized.ordo ? " is-recognized" : ""}`}>
                    <span>III</span>
                    <label htmlFor="ordo-key">Ordo · ID</label>
                    <input id="ordo-key" type="password" value={ordoKey} onChange={(event) => { setOrdoKey(event.target.value); setRecognized(current => ({ ...current, ordo: false })); setMessage(null); setMessageText(""); }} placeholder="••••••••" autoComplete="off" />
                    <small>{recognized.ordo ? "Reconocido" : "Tercer sello"}</small>
                  </div>
                  <button type="submit" aria-label={t.mpa.universeEnter}><span>Abrir hasta donde llegue mi llave</span><b aria-hidden="true">→</b></button>
                </form>
                <p className={`universe-key-message${message ? ` ${message}` : ""}`} aria-live="polite">
                  {messageText}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="universe-initiation">
          <div className="container universe-initiation-inner">
            <p className="section-kicker">{t.nav.mpaUniverse}</p>
            <h2>{t.mpa.universeNoIniciadosTitle}</h2>
            <p className="universe-initiation-copy">{t.mpa.universeNoIniciadosBody}</p>
            <a className="button secondary universe-challenge-button" href={INITIATION_CHALLENGE}>{t.mpa.universeChallenge} <span aria-hidden="true">↗</span></a>
            <a className="universe-mirror" href={INITIATION_CHALLENGE} aria-label={t.mpa.universeChallenge}>
              <Image src="/mpa-universe-mirror.jpg" alt={t.mpa.universeChallenge} width={1080} height={1350} sizes="(max-width: 760px) 92vw, 760px" />
              <span className="universe-mirror-veil" aria-hidden="true" />
              <span className="universe-mirror-cta">{t.mpa.universeChallenge} <b aria-hidden="true">→</b></span>
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
