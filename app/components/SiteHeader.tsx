"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Navegación principal: HOME | MPA | OBRAS | SOBRE R.C. | CONTACTO.
  // "Obras" es la entrada de menú de la sección general (portada del
  // catálogo transversal en /obras); "Obras destacadas" es la vidriera
  // editorial dentro de Home/Obras, no tiene entrada propia de menú.
  const NAV_LINKS = [
    { href: "/", label: t.nav.inicio },
    {
      href: "/mpa",
      label: t.nav.mpa,
      children: [
        { href: "/mpa/que-es-mpa", label: t.nav.queEsMpa },
        { href: "/mpa/universe", label: t.nav.mpaUniverse },
        { href: "/mpa/transmuta", label: t.nav.mpaTransmuta },
        { href: "https://mpaflow.com", label: t.nav.mpaFlow },
        { href: "/mpa/publishing-house", label: t.nav.mpaPublishingHouse },
      ],
    },
    { href: "/obras", label: t.nav.obras },
    { href: "/#sobre", label: t.nav.sobreRC },
    { href: "/#contacto", label: t.nav.contacto },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="nav-shell">
      <div className="nav-inner">
        <Link className="brand" href="/" aria-label={`${t.nav.inicio} — R.C. Dopazo`}>
          <Image
            className="brand-mark"
            src="/rc-dopazo-logo.png"
            alt="R.C. Dopazo"
            width={512}
            height={512}
            priority
          />
          <span className="brand-name">R.C. Dopazo</span>
        </Link>

        <nav className="nav-links">
          {NAV_LINKS.map((link, index) => (
            <Fragment key={link.href}>
            {link.children ? (
              <div className="nav-item">
                <button className="nav-mpa-trigger" type="button" aria-label={link.label}>
                  <Image src="/mpa-general-logo.png" alt="" width={64} height={64} />
                </button>
                <div className="nav-dropdown">
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link href={link.href}>
                {link.label}
              </Link>
            )}
            {index === 1 && (
              <a className="nav-stray-sheep" href="/stray-sheep" aria-label="Stray Sheep" title="Stray Sheep">
                <Image src="/stray-sheep-glasses.png" alt="" width={120} height={44} />
                <span role="tooltip">Stray Sheep</span>
              </a>
            )}
            </Fragment>
          ))}
          <LanguageToggle variant="desktop" />
        </nav>

        <div className="nav-mobile-tools">
          <LanguageToggle variant="mobile" />
          <button
            className={`menu-toggle${menuOpen ? " active" : ""}`}
            aria-label={menuOpen ? t.nav.cerrarMenu : t.nav.abrirMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.flatMap((link) =>
          link.children
            ? [
                <div className="mobile-parent mobile-mpa-parent" key={link.href}>
                  <Image src="/mpa-general-logo.png" alt="" width={58} height={58} />
                  <span>{link.label}</span>
                </div>,
                ...link.children.map((child) => (
                  <Link className="mobile-child" key={child.href} href={child.href} onClick={() => setMenuOpen(false)}>
                    {child.label}
                  </Link>
                )),
              ]
            : [
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>,
              ]
        )}
        <a className="mobile-stray-sheep" href="/stray-sheep" onClick={() => setMenuOpen(false)}>
          <Image src="/stray-sheep-glasses.png" alt="" width={90} height={34} />
          <span>Stray Sheep</span>
        </a>
      </div>
    </header>
  );
}
