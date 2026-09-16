"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { CampusBlock, CampusExperience, CampusLanguage } from "@/lib/campus-content";

const ACCESS_HASH = "53a262023ec1056f291cf2b332ffacbb2b790b9306ff9869e72c0d419d95e6eb";

export default function CampusExperiencePage() {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<CampusExperience | null>(null);
  const [lang, setLang] = useState<CampusLanguage>("es");
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [completed, setCompleted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [access, setAccess] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("preview") === "draft";
    fetch(`/api/campus/content?slug=${encodeURIComponent(slug)}${preview ? "&state=draft" : ""}`, { cache: "no-store" })
      .then(async response => response.ok ? (await response.json()).content : null)
      .then(content => {
        setExperience(content);
        if (content) {
          const saved = window.localStorage.getItem(`pulsus-experience-${slug}`);
          if (saved) try { const value = JSON.parse(saved); setActive(value.active || 0); setVisited(value.visited || [0]); setCompleted(Boolean(value.completed)); } catch { /* Start clean. */ }
          setAccess(content.access === "open" || window.sessionStorage.getItem("pulsus-campus-access") === "open");
        }
        setChecked(true);
      });
  }, [slug]);

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code.trim().toUpperCase()));
    const hash = Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
    if (hash === ACCESS_HASH) { window.sessionStorage.setItem("pulsus-campus-access", "open"); setAccess(true); setError(""); }
    else setError(lang === "es" ? "La Escuela todavía no reconoce esa palabra." : "The School does not recognize that word yet.");
  };

  const persist = (nextActive: number, nextVisited = visited, nextCompleted = completed) => {
    window.localStorage.setItem(`pulsus-experience-${slug}`, JSON.stringify({ active: nextActive, visited: nextVisited, completed: nextCompleted }));
  };
  const go = (index: number) => {
    const nextVisited = Array.from(new Set([...visited, index])).sort((a, b) => a - b);
    setActive(index); setVisited(nextVisited); persist(index, nextVisited);
  };

  if (!checked) return <main className="school-access-gate" />;
  if (!experience) return <main className="school-access-gate"><section><p>Campus Pulsus Fractum</p><h1>Esta experiencia todavía está en construcción.</h1><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">Volver al Ágora</Link></section></main>;
  const locale = experience.locales[lang];
  const stage = locale.stages[active] || locale.stages[0];
  if (!access) return <main className="school-access-gate"><div className="school-visitor-stars"/><Link className="school-access-back" href="/mpa/transmuta/pulsus-fractum?entry=mpa">← {lang === "es" ? "Volver al Ágora" : "Back to the Agora"}</Link><Language lang={lang} setLang={setLang}/><section><div className="school-access-seal"><i>PF</i></div><p>{experience.kind === "workshop" ? "Taller del Campus" : "Experiencia del Campus"}</p><h1>{locale.hero}</h1><span>{lang === "es" ? "El recorrido se abre con la palabra recibida al inscribirte." : "The path opens with the word you received upon enrollment."}</span><form onSubmit={unlock}><label>{lang === "es" ? "Palabra de acceso" : "Access word"}</label><div><input type="password" value={code} onChange={event => { setCode(event.target.value); setError(""); }} autoFocus/><button>{lang === "es" ? "Entrar" : "Enter"} →</button></div><small className={error ? "is-error" : ""}>{error || (lang === "es" ? "Usá la palabra de acceso del Campus." : "Use your Campus access word.")}</small></form></section></main>;

  return <main className="pf-classroom"><div className="pf-classroom-stars"/><header className="pf-classroom-header"><Link href="/mpa/transmuta/pulsus-fractum?entry=mpa">← {lang === "es" ? "Volver al Ágora" : "Back to the Agora"}</Link><span>Escuela de Metalkimia · Pulsus Fractum</span><div><b>{completed ? (lang === "es" ? "Experiencia completada" : "Experience completed") : (lang === "es" ? "Progreso guardado" : "Progress saved")}</b><Language lang={lang} setLang={setLang}/></div></header><div className="pf-classroom-layout"><aside className="pf-classroom-index"><p>{experience.kind === "workshop" ? "Ágora libre" : `Grado ${experience.grade || 1}`}</p><h2>{experience.name || locale.eyebrow}</h2><div className="pf-classroom-progress"><i style={{ width: `${completed ? 100 : Math.max(12, ((active + 1) / locale.stages.length) * 100)}%` }}/></div><small>{completed ? "100%" : `${visited.length} / ${locale.stages.length}`}</small><nav>{locale.stages.map((item, index) => <button key={item.id} className={active === index ? "is-active" : ""} onClick={() => go(index)}><em>{String(index + 1).padStart(2, "0")}</em><span>{item.name}</span>{completed || visited.includes(index) ? <b>✓</b> : null}</button>)}</nav></aside><section className="pf-classroom-content"><div className="pf-classroom-eyebrow">{locale.eyebrow}</div><h1>{locale.hero}</h1><blockquote>{locale.subtitle}</blockquote><div className="pf-classroom-panel"><article><p className="pf-lesson-label">{stage.label}</p><h2>{stage.title}</h2><p>{stage.body}</p>{stage.mediaUrl && <ExperienceMedia url={stage.mediaUrl} lang={lang}/>} {stage.blocks.map(block => <section className="pu-managed-block" key={block.id} data-block={block.type}><p>{block.content}</p>{block.url && <ExperienceMedia url={block.url} type={block.type} lang={lang}/>}</section>)}</article></div><div className="pf-classroom-controls"><button disabled={active === 0} onClick={() => go(active - 1)}>← {lang === "es" ? "Anterior" : "Previous"}</button>{active < locale.stages.length - 1 ? <button className="primary" onClick={() => go(active + 1)}>{lang === "es" ? "Guardar y continuar" : "Save and continue"} →</button> : <button className="primary" onClick={() => { const next = !completed; setCompleted(next); persist(active, visited, next); }}>{completed ? (lang === "es" ? "Reabrir" : "Reopen") : (lang === "es" ? "Completar experiencia ✓" : "Complete experience ✓")}</button>}</div></section></div></main>;
}

function Language({ lang, setLang }: { lang: CampusLanguage; setLang: (lang: CampusLanguage) => void }) {
  return <div className="pf-language"><button className={lang === "es" ? "is-active" : ""} onClick={() => setLang("es")}>ES</button><span>/</span><button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button></div>;
}

function ExperienceMedia({ url, type, lang }: { url: string; type?: CampusBlock["type"]; lang: CampusLanguage }) {
  let decoded = url.toLowerCase(); try { decoded = decodeURIComponent(url).toLowerCase(); } catch { /* Use original. */ }
  const kind = type || (/youtu\.be|youtube\.com|vimeo\.com/.test(decoded) ? "video" : /\.(png|jpe?g|webp|gif|svg)(?:\?|$)/.test(decoded) ? "image" : /\.(mp3|wav|ogg|m4a)(?:\?|$)/.test(decoded) ? "audio" : /\.pdf(?:\?|$)/.test(decoded) ? "download" : "text");
  if (kind === "image") return <figure className="pu-campus-media"><img src={url} alt={lang === "es" ? "Material visual" : "Visual material"}/></figure>;
  if (kind === "audio") return <div className="pu-campus-media"><audio controls src={url}/></div>;
  if (kind === "video") { const embed = embedVideo(url); if (embed) return <div className="pu-campus-media is-video"><iframe src={embed} title="Video" allowFullScreen/></div>; }
  if (kind === "download") return <a className="pu-campus-resource" href={url} target="_blank" rel="noreferrer">{lang === "es" ? "Abrir material descargable ↗" : "Open downloadable material ↗"}</a>;
  return <a className="pu-campus-resource" href={url} target="_blank" rel="noreferrer">{lang === "es" ? "Abrir recurso ↗" : "Open resource ↗"}</a>;
}

function embedVideo(url: string) {
  try { const parsed = new URL(url); if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`; if (parsed.hostname.includes("youtube.com")) return `https://www.youtube.com/embed/${parsed.searchParams.get("v") || parsed.pathname.split("/").pop()}`; if (parsed.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${parsed.pathname.split("/").filter(Boolean).pop()}`; } catch { return ""; }
  return "";
}
