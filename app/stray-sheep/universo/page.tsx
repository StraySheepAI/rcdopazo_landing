"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageToggle } from "../../components/LanguageToggle";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { StrayUniverseCanvas } from "./StrayUniverseCanvas";
import { NaiveVideoCanvas } from "./NaiveVideoCanvas";
import { StrayAudioButton } from "./StrayAudioButton";

export default function StrayWorldPage() {
  const { locale } = useLanguage();
  const [openSphere, setOpenSphere] = useState<string | null>(null);
  const tx = (es: string, en: string) => locale === "es" ? es : en;

  return (
    <main className="stray-world">
      <StrayUniverseCanvas />
      <header className="stray-world-header">
        <Link href="/mpa">← MPA</Link>
        <span>{tx("Mundo Stray", "Stray World")}</span>
        <LanguageToggle />
      </header>

      <section className="stray-world-stage" aria-label={tx("Mundo Stray", "Stray World")}>
        <div className="stray-world-character">
          <NaiveVideoCanvas label={tx("Stray da la bienvenida a su mundo", "Stray welcomes you to their world")} />
          <StrayAudioButton playLabel={tx("Reproducir bienvenida", "Play welcome")} pauseLabel={tx("Pausar bienvenida", "Pause welcome")} />
        </div>

        <div className="stray-world-doors" aria-label={tx("Lugares del Mundo Stray", "Places in Stray World")}>
          <article className="stray-door stray-door-roles" aria-disabled="true">
            <Image className="stray-door-image stray-door-roles-image" src="/stray-portal-roles.png" alt={tx("Portal de Roles", "Role Portal")} width={1080} height={1440} />
            <span className="stray-door-status">🔒 {tx("Próximamente", "Coming soon")}</span>
            <small>{tx("Acceso 01", "Access 01")}</small>
            <h2>{tx("Portal de Roles", "Portal of Roles")}</h2>
            <p>{tx("Elegí una configuración temporal para explorar.", "Choose a temporary configuration to explore.")}</p>
          </article>
          <article className="stray-door stray-door-oracle" aria-disabled="true">
            <Image className="stray-door-image stray-door-umbral-image" src="/stray-umbral.png" alt={tx("Artefacto del Umbral", "Threshold artifact")} width={1024} height={1536} />
            <span className="stray-door-status">🔒 {tx("Próximamente", "Coming soon")}</span>
            <small>{tx("Acceso 02", "Access 02")}</small>
            <h2>{tx("Portal de los Mundos", "Portal of Worlds")}</h2>
            <p>{tx("Viajá entre mundos, tiempos y relatos.", "Travel between worlds, times, and stories.")}</p>
          </article>
          <article className="stray-door stray-door-lab" aria-disabled="true">
            <Image className="stray-door-image" src="/stray-laboratorio.png" alt={tx("Puerta del Laboratorio", "Laboratory door")} width={715} height={944} />
            <span className="stray-door-status">🔒 {tx("Próximamente", "Coming soon")}</span>
            <small>{tx("Acceso 03", "Access 03")}</small>
            <h2>{tx("Laboratorio", "Laboratory")}</h2>
            <p>{tx("La escuela central de Stray estudia lo que sucede en todos los mundos.", "Stray's central school studies what happens across every world.")}</p>
          </article>
        </div>
      </section>

      <section className="stray-sad-family" aria-label={tx("Las bolas tristes", "The sad spheres")}>
        <div className="stray-sad-home" aria-hidden="true">
          <i className="stray-sad-home-roof" />
          <i className="stray-sad-home-window stray-sad-home-window-left" />
          <i className="stray-sad-home-window stray-sad-home-window-right" />
          <i className="stray-sad-home-door" />
          <i className="stray-sad-home-chimney" />
        </div>
        <div className="stray-sad-family-heading">
          <p>{tx("En el mundo de Stray nadie se entristece a solas", "In Stray's world, nobody is sad alone")}</p>
          <h2>{tx("Las bolas tristes", "The Sad Spheres")}</h2>
          <span>{tx("Olas, Tufito y Parche son una familia: tres formas distintas de quedarse un rato con lo que duele.", "Olas, Tufito, and Parche are a family: three different ways of staying for a while with what hurts.")}</span>
        </div>
        <div className="stray-sad-family-portraits">
          <article className="stray-sphere-tufito">
            <div className="stray-sphere-portrait"><Image src="/stray-bola-triste-43.png" alt="Tufito" width={700} height={700} /></div>
            <button type="button" onClick={() => setOpenSphere(openSphere === "tufito" ? null : "tufito")}>{tx("Conocé a Tufito", "Meet Tufito")}</button>
            {openSphere === "tufito" && <p>{tx("No mira: huele. «¿Hice algo?», «Si te molesto, me voy». Anticipa lo que todavía no ocurrió.", "She does not look: she sniffs. “Did I do something?”, “If I bother you, I'll leave.” She anticipates what has not happened yet.")}</p>}
          </article>
          <article className="stray-sphere-olas">
            <div className="stray-sphere-portrait"><Image src="/stray-bola-triste-44.png" alt="Olas" width={700} height={700} /></div>
            <button type="button" onClick={() => setOpenSphere(openSphere === "olas" ? null : "olas")}>{tx("Conocé a Olas", "Meet Olas")}</button>
            {openSphere === "olas" && <p>{tx("Habita el pasado. «Antes…», «Quiero, pero no puedo». Mira hacia atrás mientras el presente sigue rodando.", "She inhabits the past. “Before…”, “I want to, but I can't.” She looks backward while the present keeps rolling.")}</p>}
          </article>
          <article className="stray-sphere-parche">
            <div className="stray-sphere-portrait"><Image src="/stray-bola-triste-45.png" alt="Parche" width={700} height={700} /></div>
            <button type="button" onClick={() => setOpenSphere(openSphere === "parche" ? null : "parche")}>{tx("Conocé a Parche", "Meet Parche")}</button>
            {openSphere === "parche" && <p>{tx("Dice «ya está»: «Estoy bien», «Ya pasó». No para de moverse, pero la bola sigue intacta.", "She says “it's done”: “I'm fine,” “It's over.” She never stops moving, but the sphere remains intact.")}</p>}
          </article>
        </div>
        <Link className="stray-works-link" href="/mpa/publishing-house/stray-sheep-collection">
          {tx("Nuestras obras", "Our works")} <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="stray-patrana" id="la-patrana">
        <Image
          src="/stray-patrana.png"
          alt={tx("Las Patrañas", "The Tall Tales")}
          width={1080}
          height={1080}
          style={{ width: "clamp(260px, 28vw, 420px)" }}
        />
        <p>{tx("Próximo territorio", "Next territory")}</p>
        <h2>{tx("Las Patrañas", "The Tall Tales")}</h2>
        <span>{tx("Una verdad demasiado obediente merece ser investigada.", "A truth that is too obedient deserves investigation.")}</span>
        <button type="button" disabled>{tx("Develar la Patraña · Próximamente", "Unveil the Tall Tale · Coming soon")}</button>
      </section>
    </main>
  );
}
