import Image from "next/image";
import type { Obra } from "../lib/obras";

// Tarjeta de obra reutilizada por Home (selección destacada) y /obras
// (catálogo) — mismo diseño visual que ya tenía ¡Qué Embole!, pero ahora
// todo su contenido (textos, imagen, botones, URLs) viene de la
// configuración central en lib/obras.ts en vez de estar hardcodeado acá.
export function ObraCard({
  obra,
  variant = "catalog",
}: {
  obra: Obra;
  variant?: "featured" | "catalog";
}) {
  const image = variant === "featured" ? obra.images.featured ?? obra.images.cover : obra.images.cover;

  return (
    <div className="book-card">
      <span className="dot-deco gold" style={{ top: 20, right: 64 }} />
      <span className="dot-deco fuchsia" style={{ top: 68, right: 26 }} />
      <div className="book-layout">
        <div className="book-cover">
          <Image src={image} alt={`Tapa de ${obra.title} — R.C. Dopazo`} width={700} height={1073} />
        </div>
        <div className="book-info">
          {obra.affiliations.length > 0 && (
            <p className="book-badge">{obra.affiliations.join(" · ")}</p>
          )}
          <h3>{obra.title}</h3>
          {obra.tagline && <p className="book-tagline">{obra.tagline}</p>}
          <p className="book-body">{obra.description}</p>
          {obra.links.length > 0 && (
            <div className="book-actions">
              {obra.links.map((link, i) => (
                <a
                  key={link.label}
                  className={i === 0 ? "button primary" : "button secondary"}
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
          {obra.note && <p className="book-note">{obra.note}</p>}
        </div>
      </div>
    </div>
  );
}
