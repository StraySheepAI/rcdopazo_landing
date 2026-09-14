"use client";

import { useEffect, useState } from "react";
import { DEFAULT_CAMPUS_EXPERIENCE, type CampusBlock, type CampusExperience, type CampusLanguage, type CampusStage } from "@/lib/campus-content";

type Role = "editor" | "architect";
const cloneDefault = () => structuredClone(DEFAULT_CAMPUS_EXPERIENCE);
const blockNames = { text: "Texto", image: "Imagen", video: "Video", audio: "Audio", download: "Descargable", prompt: "Consigna" } as const;

export default function CampusAdmin() {
  const [role, setRole] = useState<Role | null>(null), [ready, setReady] = useState(false);
  const [password, setPassword] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false), [storageReady, setStorageReady] = useState(false);
  const [lang, setLang] = useState<CampusLanguage>("es"), [active, setActive] = useState(0);
  const [content, setContent] = useState<CampusExperience>(cloneDefault);

  const loadDraft = async () => {
    const response = await fetch("/api/campus/content?state=draft", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json(); setContent(data.content); setStorageReady(data.storageReady);
  };
  useEffect(() => { fetch("/api/admin-campus/session").then(r => r.json()).then(async data => { setRole(data.role); if (data.role) await loadDraft(); setReady(true); }); }, []);
  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    const response = await fetch("/api/admin-campus/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json(); if (!response.ok) return setError(data.error);
    setRole(data.role); setPassword(""); await loadDraft();
  };
  const logout = async () => { await fetch("/api/admin-campus/session", { method: "DELETE" }); setRole(null); };
  const locale = content.locales[lang], stage = locale.stages[active] || locale.stages[0];
  const updateLocale = (patch: Partial<typeof locale>) => setContent(current => ({ ...current, locales: { ...current.locales, [lang]: { ...current.locales[lang], ...patch } } }));
  const updateStage = (patch: Partial<CampusStage>) => updateLocale({ stages: locale.stages.map((item, index) => index === active ? { ...item, ...patch } : item) });
  const updateBlock = (index: number, patch: Partial<CampusBlock>) => updateStage({ blocks: stage.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block) });
  const addBlock = (type: CampusBlock["type"]) => updateStage({ blocks: [...stage.blocks, { id: crypto.randomUUID(), type, content: "", url: "" }] });
  const addStage = () => {
    if (role !== "architect") return;
    const id = `etapa-${Date.now()}`, blank = (name: string): CampusStage => ({ id, name, label: "", title: "", body: "", mediaUrl: "", blocks: [] });
    setContent(current => ({ ...current, locales: { es: { ...current.locales.es, stages: [...current.locales.es.stages, blank("Nueva etapa")] }, en: { ...current.locales.en, stages: [...current.locales.en.stages, blank("New stage")] } } }));
    setActive(content.locales.es.stages.length);
  };
  const move = (direction: number) => {
    if (role !== "architect") return;
    const to = active + direction; if (to < 0 || to >= locale.stages.length) return;
    setContent(current => ({ ...current, locales: Object.fromEntries((Object.keys(current.locales) as CampusLanguage[]).map(key => { const list = [...current.locales[key].stages]; [list[active], list[to]] = [list[to], list[active]]; return [key, { ...current.locales[key], stages: list }]; })) as CampusExperience["locales"] })); setActive(to);
  };
  const removeStage = () => {
    if (role !== "architect" || locale.stages.length <= 1) return;
    const stageName = locale.stages[active]?.name || "esta etapa";
    if (!window.confirm(`¿Eliminar “${stageName}” en español e inglés? El cambio recién será visible cuando publiques.`)) return;
    setContent(current => ({ ...current, locales: Object.fromEntries((Object.keys(current.locales) as CampusLanguage[]).map(key => [key, { ...current.locales[key], stages: current.locales[key].stages.filter((_, index) => index !== active) }])) as CampusExperience["locales"] }));
    setActive(current => Math.max(0, Math.min(current - 1, locale.stages.length - 2)));
    setNotice("Etapa eliminada del borrador. Guardá o publicá para confirmar el cambio.");
  };
  const save = async (action: "draft" | "publish") => {
    setSaving(true); setNotice(""); setError("");
    const response = await fetch("/api/campus/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, action }) });
    const data = await response.json(); setSaving(false); if (!response.ok) return setError(data.error);
    setContent(data.content); setNotice(action === "publish" ? "Publicado en el Campus." : "Borrador guardado.");
  };

  if (!ready) return <main className="campus-admin-login" />;
  if (!role) return <main className="campus-admin-login"><section><div className="campus-admin-seal">PF</div><p>Administrador del Campus</p><h1>La arquitectura se abre desde acá.</h1><span>Ingresá con tu clave de Editor o Arquitecta.</span><form onSubmit={login}><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Contraseña" autoFocus /><button>Entrar al administrador</button></form>{error && <small>{error}</small>}</section></main>;

  return <main className="campus-admin"><header><div><span>PF</span><p><b>Administrador del Campus</b><small>Principios Universales · versión {content.version}</small></p></div><nav><a href="/mpa/transmuta/pulsus-fractum/agora/principios-universales" target="_blank">Ver página ↗</a><button onClick={logout}>Cerrar sesión</button></nav></header><div className="campus-admin-shell">
    <aside><p>Experiencias</p><h2>Ágora libre</h2><button className="is-selected">Principios Universales <small>{content.updatedAt ? `Actualizado ${new Date(content.updatedAt).toLocaleDateString("es-AR")}` : "Contenido inicial"}</small></button><button disabled>＋ Nueva experiencia</button><hr/><div className="campus-role"><span>{role === "architect" ? "Arquitecta" : "Editor"}</span><small>{role === "architect" ? "Contenido y estructura" : "Contenido"}</small></div></aside>
    <section className="campus-admin-editor"><div className="campus-admin-toolbar"><div><span>{storageReady ? "Almacenamiento conectado" : "Falta conectar almacenamiento"}</span><b>{notice || "Los cambios se previsualizan antes de publicar."}</b>{error && <small className="is-error">{error}</small>}</div><button disabled={saving} onClick={() => save("draft")}>{saving ? "Guardando…" : "Guardar borrador"}</button><a className="campus-preview-link" href="/mpa/transmuta/pulsus-fractum/agora/principios-universales?preview=draft" target="_blank">Previsualizar</a><button disabled={saving} className="primary" onClick={() => save("publish")}>Publicar</button></div><div className="campus-admin-grid">
      <div className="campus-structure"><div className="panel-title"><p>Estructura</p>{role === "architect" && <button onClick={addStage}>＋ Etapa</button>}</div>{locale.stages.map((item, index) => <button key={item.id} className={active === index ? "active" : ""} onClick={() => setActive(index)}><em>{String(index + 1).padStart(2, "0")}</em><span>{item.name}</span><i>⋮</i></button>)}{role === "architect" && <div className="reorder"><button disabled={active === 0} onClick={() => move(-1)}>↑ Subir</button><button disabled={active === locale.stages.length - 1} onClick={() => move(1)}>↓ Bajar</button><button className="danger" disabled={locale.stages.length <= 1} onClick={removeStage}>Eliminar etapa</button></div>}</div>
      <div className="campus-fields"><p className="panel-kicker">Contenido · {lang.toUpperCase()} <button onClick={() => setLang(lang === "es" ? "en" : "es")}>Editar {lang === "es" ? "EN" : "ES"}</button></p><label>Antetítulo del taller<input value={locale.eyebrow} onChange={event => updateLocale({ eyebrow: event.target.value })} /></label><label>Título principal<input value={locale.hero} onChange={event => updateLocale({ hero: event.target.value })} /></label><label>Subtítulo<input value={locale.subtitle} onChange={event => updateLocale({ subtitle: event.target.value })} /></label><hr/><label>Nombre de la etapa<input value={stage.name} onChange={event => updateStage({ name: event.target.value })} /></label><label>Rótulo y duración<input value={stage.label} onChange={event => updateStage({ label: event.target.value })} /></label><label>Título de la etapa<input value={stage.title} onChange={event => updateStage({ title: event.target.value })} /></label><label>Texto<textarea value={stage.body} onChange={event => updateStage({ body: event.target.value })} /></label><div className="campus-media"><p>Imagen, video o media</p><div><input value={stage.mediaUrl} onChange={event => updateStage({ mediaUrl: event.target.value })} placeholder="Pegá un enlace a YouTube, Vimeo, imagen o audio"/><button disabled>＋ Subir archivo</button></div><small>El enlace queda asociado a esta etapa. La subida directa será la siguiente integración.</small></div><div className="campus-blocks"><p>Agregar bloque</p><div>{(Object.keys(blockNames) as CampusBlock["type"][]).map(type => <button key={type} onClick={() => addBlock(type)}>＋ {blockNames[type]}</button>)}</div></div>{stage.blocks.map((block, index) => <div className="campus-block-editor" key={block.id}><p><b>{blockNames[block.type]}</b><button onClick={() => updateStage({ blocks: stage.blocks.filter((_, blockIndex) => blockIndex !== index) })}>Quitar</button></p><textarea value={block.content} onChange={event => updateBlock(index, { content: event.target.value })} placeholder="Contenido del bloque"/>{block.type !== "text" && block.type !== "prompt" && <input value={block.url || ""} onChange={event => updateBlock(index, { url: event.target.value })} placeholder="Enlace del recurso"/>}</div>)}</div>
      <aside className="campus-preview"><p>Vista previa</p><article><small>{locale.eyebrow}</small><h2>{locale.hero}</h2><blockquote>{locale.subtitle}</blockquote><h3>{String(active + 1).padStart(2, "0")} · {stage.name}</h3><b>{stage.title}</b><div className="preview-media">{stage.mediaUrl ? "MEDIA CONECTADA" : "＋ MEDIA"}</div><p>{stage.body}</p>{stage.blocks.map(block => <p key={block.id}><small>{blockNames[block.type]}</small><br/>{block.content}</p>)}</article><small>{storageReady ? "Guardar conserva el borrador. Publicar actualiza la experiencia visible." : "La interfaz está preparada; falta crear el almacén de Vercel para activar Guardar y Publicar."}</small></aside>
    </div></section></div></main>;
}
