import Image from "next/image";
import Link from "next/link";
import { Cosmos } from "../components/Cosmos";
import { CosmicMotion } from "../components/CosmicMotion";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export default function CodexEvigilaPage() {
  return (
    <>
      <Cosmos />
      <CosmicMotion />
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumb">
              <Link href="/">Inicio</Link><span className="sep">/</span>
              <Link href="/obras?filtro=juegos">Juegos</Link><span className="sep">/</span>
              <span className="current">Códex EVIGILA</span>
            </nav>
            <p className="section-kicker">Tarot de los Essentors · MPA</p>
            <h1>Códex EVIGILA</h1>
            <p className="page-hero-copy">El libro-guía que abre el universo jugable del Tarot de los Essentors.</p>
          </div>
        </section>

        <section className="page-body codex-landing">
          <div className="container codex-landing-grid">
            <div className="codex-landing-cover">
              <Image src="/portfolio-creativo/codex-evigila-cover.png" alt="Códex EVIGILA · El Tarot de los Essentors · Vol. I" width={1304} height={1999} priority />
            </div>
            <div className="codex-landing-copy">
              <p className="section-kicker">Volumen I</p>
              <h2>El Tarot de los Essentors</h2>
              <p>Una guía para entrar al sistema, reconocer sus personajes y recorrer sus símbolos. El mini Códex está en preparación y esta es su puerta de acceso.</p>
              <p className="book-note">Próximamente: nuevas páginas, personajes y recorridos.</p>
              <Link href="/obras?filtro=juegos" className="button secondary">Volver a Juegos <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
