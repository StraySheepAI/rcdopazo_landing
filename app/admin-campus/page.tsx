"use client";

import { useEffect, useState } from "react";
import { DEFAULT_CAMPUS_EXPERIENCE, type CampusAccessMode, type CampusBlock, type CampusExperience, type CampusExperienceKind, type CampusLanguage, type CampusStage } from "@/lib/campus-content";

type Role = "editor" | "architect";
type ExperienceSummary = { slug: string; name: string; kind: CampusExperienceKind; access: CampusAccessMode; status: "draft" | "published"; path: string; managed: boolean };
const cloneDefault = () => structuredClone(DEFAULT_CAMPUS_EXPERIENCE);
const blockNames = { text: "Texto", image: "Imagen", video: "Video", audio: "Audio", download: "Descargable", prompt: "Consigna" } as const;

export default function CampusAdmin() {
  const [role, setRole] = useState<Role | null>(null), [ready, setReady] = useState(false);
  const [password, setPassword] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false), [uploading, setUploading] = useState(false), [storageReady, setStorageReady] = useState(false);
  const [lang, setLang] = useState<CampusLanguage>("es"), [active, setActive] = useState(0);
  const [content, setContent] = useState<CampusExperience>(cloneDefault);
  const [experiences, setExperiences] = useState<ExperienceSummary[]>([]), [selectedSlug, setSelectedSlug] = useState("principios-universales"), [creating, setCreating] = useState(false);
  const [newExperience, setNewExperience] = useState({ name: "", slug: "", kind: "course" as CampusExperienceKind, access: "key" as CampusAccessMode });

  const loadExperiences = async () => {
    const response = await fetch("/api/campus/experiences", { cache: "no-store" });
    if (response.ok) setExperiences((await response.json()).experiences);
  };
  const loadDraft = async (slug = selectedSlug) => {
    const response = await fetch(`/api/campus/content?state=draft&slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json(); setContent(data.content); setStorageReady(data.storageReady); setSelectedSlug(slug); setActive(0);
  };
  useEffect(() => { fetch("/api/admin-campus/session").then(r => r.json()).then(async data => { setRole(data.role); if (data.role) { await Promise.all([loadExperiences(), loadDraft("principios-universales")]); } setReady(true); }); }, []);
  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    const response = await fetch("/api/admin-campus/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json(); if (!response.ok) return setError(data.error);
    setRole(data.role); setPassword(""); await Promise.all([loadExperiences(), loadDraft("principios-universales")]);
  };
  const logout = async () => { await fetch("/api/admin-campus/session", { method: "DELETE" }); setRole(null); };
  const locale = content.locales[lang], stage = locale.stages[active] || locale.stages[0];
  const updateLocale = (patch: Partial<typeof locale>) => setContent(current => ({ ...current, locales: { ...current.locales, [lang]: { ...current.locales[lang], ...patch } } }));
  const updateStage = (patch: Partial<CampusStage>) => updateLocale({ stages: locale.stages.map((item, index) => index === active ? { ...item, ...patch } : item) });
  const updateBlock = (index: number, patch: Partial<CampusBlock>) => updateStage({ blocks: stage.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block) });
  const addBlock = (type: CampusBlock["type"]) => updateStage({ blocks: [...stage.blocks, { id: crypto.randomUUID(), type, content: "", url: "" }] });
  const moveBlock = (index: number, direction: number) => {
    const to = index + direction; if (to < 0 || to >= stage.blocks.length) return;
    const blocks = [...stage.blocks]; [blocks[index], blocks[to]] = [blocks[to], blocks[index]]; updateStage({ blocks });
  };
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
    const stageId = locale.stages[active]?.id, stageName = locale.stages[active]?.name || "esta etapa";
    if (!window.confirm(`¿Eliminar “${stageName}” en español e inglés? El cambio recién será visible cuando publiques.`)) return;
    setContent(current => ({ ...current, locales: Object.fromEntries((Object.keys(current.locales) as CampusLanguage[]).map(key => [key, { ...current.locales[key], stages: current.locales[key].stages.filter(item => item.id !== stageId) }])) as CampusExperience["locales"] }));
    setActive(current => Math.max(0, Math.min(current - 1, locale.stages.length - 2)));
    setNotice("Etapa eliminada del borrador. Guardá o publicá para confirmar el cambio.");
  };
  const duplicateStage = () => {
    if (role !== "architect") return;
    const id = `etapa-${Date.now()}`;
    setContent(current => ({ ...current, locales: Object.fromEntries((Object.keys(current.locales) as CampusLanguage[]).map(key => { const stages = [...current.locales[key].stages], source = stages[active]; stages.splice(active + 1, 0, { ...structuredClone(source), id, name: `${source.name}${key === "es" ? " · copia" : " · copy"}`, blocks: source.blocks.map(block => ({ ...block, id: crypto.randomUUID() })) }); return [key, { ...current.locales[key], stages }]; })) as CampusExperience["locales"] }));
    setActive(active + 1); setNotice("Etapa duplicada en español e inglés. Ya podés editarla.");
  };
  const save = async (action: "draft" | "publish") => {
    setSaving(true); setNotice(""); setError("");
    const response = await fetch("/api/campus/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, action }) });
    const data = await response.json(); setSaving(false); if (!response.ok) return setError(data.error);
    setContent(data.content); setNotice(action === "publish" ? "Publicado en el Campus." : "Borrador guardado.");
    if (action === "publish") {
      setExperiences(items => items.map(item => item.slug === content.slug ? { ...item, status: "published" } : item));
      await fetch("/api/campus/experiences", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: content.slug, status: "published" }) });
    }
  };
  const createExperience = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    const response = await fetch("/api/campus/experiences", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(newExperience) });
    const data = await response.json(); setSaving(false);
    if (!response.ok) return setError(data.error || "No se pudo crear la experiencia.");
    setExperiences(items => [...items, data.summary]); setContent(data.experience); setSelectedSlug(data.summary.slug); setActive(0); setCreating(false);
    setNewExperience({ name: "", slug: "", kind: "course", access: "key" }); setNotice("Experiencia creada como borrador. Ya podés construirla.");
  };
  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void, success: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setNotice(""); setError("");
    const body = new FormData(); body.append("file", file);
    try {
      const response = await fetch("/api/campus/media", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) setError(data.error || "No se pudo subir el archivo.");
      else { onUploaded(data.url); setNotice(success); }
    } catch { setError("No se pudo completar la subida. Intentá nuevamente."); }
    finally { setUploading(false); event.target.value = ""; }
  };
  const uploadMedia = (event: React.ChangeEvent<HTMLInputElement>) => uploadFile(event, url => updateStage({ mediaUrl: url }), "Archivo subido y conectado a esta etapa. Guardá o publicá para conservarlo.");
  const uploadBlockMedia = (index: number, event: React.ChangeEvent<HTMLInputElement>) => uploadFile(event, url => updateBlock(index, { url }), "Archivo subido y conectado al bloque. Guardá o publicá para conservarlo.");

  if (!ready) return <main className="campus-admin-login" />;
  if (!role) return <main className="campus-admin-login"><section><div className="campus-admin-seal">PF</div><p>Administrador del Campus</p><h1>La arquitectura se abre desde acá.</h1><span>Ingresá con tu clave de Editor o Arquitecta.</span><form onSubmit={login}><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Contraseña" autoFocus /><button>Entrar al administrador</button></form>{error && <small>{error}</small>}</section></main>;

  const selectedExperience = experiences.find(item => item.slug === selectedSlug);
  return <main className="campus-admin"><header><div><span>PF</span><p><b>Administrador del Campus</b><small>{content.name || content.locales.es.eyebrow} · versión {content.version}</small></p></div><nav>{selectedExperience && <a href={selectedExperience.path} target="_blank">Ver página ↗</a>}<button onClick={logout}>Cerrar sesión</button></nav></header><div className="campus-admin-shell">
    <aside><p>Experiencias</p><h2>Campus</h2>{experiences.map(item => item.managed ? <button key={item.slug} className={selectedSlug === item.slug ? "is-selected" : ""} onClick={() => loadDraft(item.slug)}>{item.name}<small>{item.status === "published" ? "Publicada" : "Borrador"} · {item.kind}</small></button> : <a key={item.slug} className="campus-static-experience" href={item.path} target="_blank">{item.name}<small>Experiencia existente ↗</small></a>)}{role === "architect" && <button onClick={() => setCreating(true)}>＋ Nueva experiencia</button>}<hr/><div className="campus-role"><span>{role === "architect" ? "Arquitecta" : "Editor"}</span><small>{role === "architect" ? "Contenido y estructura" : "Contenido"}</small></div></aside>
    <section className="campus-admin-editor">{creating && <form className="campus-create-experience" onSubmit={createExperience}><header><div><small>Nueva experiencia</small><h2>Creá la puerta y después construí su recorrido.</h2></div><button type="button" onClick={() => setCreating(false)}>Cerrar</button></header><label>Nombre<input required value={newExperience.name} onChange={event => setNewExperience(current => ({ ...current, name: event.target.value, slug: current.slug || event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }))}/></label><label>Dirección<input required value={newExperience.slug} onChange={event => setNewExperience(current => ({ ...current, slug: event.target.value }))}/></label><label>Formato<select value={newExperience.kind} onChange={event => setNewExperience(current => ({ ...current, kind: event.target.value as CampusExperienceKind }))}><option value="workshop">Taller</option><option value="course">Curso</option><option value="class">Clase</option><option value="encounter">Encuentro</option></select></label><label>Acceso<select value={newExperience.access} onChange={event => setNewExperience(current => ({ ...current, access: event.target.value as CampusAccessMode }))}><option value="open">Abierto</option><option value="key">Con clave</option><option value="enrollment">Solo cursantes</option></select></label><button className="primary" disabled={saving}>Crear experiencia</button></form>}<div className="campus-admin-toolbar"><div><span>{storageReady ? "Almacenamiento conectado" : "Falta conectar almacenamiento"}</span><b>{notice || "Los cambios se previsualizan antes de publicar."}</b>{error && <small className="is-error">{error}</small>}</div><button disabled={saving} onClick={() => save("draft")}>{saving ? "Guardando…" : "Guardar borrador"}</button>{selectedExperience && <a className="campus-preview-link" href={`${selectedExperience.path}?preview=draft`} target="_blank">Previsualizar</a>}<button disabled={saving} className="primary" onClick={() => save("publish")}>Publicar</button></div>{role === "architect" && <div className="campus-experience-settings"><label>Nombre interno<input value={content.name || ""} onChange={event => setContent(current => ({ ...current, name: event.target.value }))}/></label><label>Formato<select value={content.kind || "course"} onChange={event => setContent(current => ({ ...current, kind: event.target.value as CampusExperienceKind }))}><option value="workshop">Taller</option><option value="course">Curso</option><option value="class">Clase</option><option value="encounter">Encuentro</option></select></label><label>Acceso<select value={content.access || "key"} onChange={event => setContent(current => ({ ...current, access: event.target.value as CampusAccessMode }))}><option value="open">Abierto</option><option value="key">Con clave</option><option value="enrollment">Solo cursantes</option></select></label><label>Grado<input type="number" min="0" max="9" value={content.grade || 0} onChange={event => setContent(current => ({ ...current, grade: Number(event.target.value) }))}/></label><label>Imagen de portada<input value={content.coverUrl || ""} onChange={event => setContent(current => ({ ...current, coverUrl: event.target.value }))} placeholder="Enlace de imagen"/></label></div>}<div className="campus-admin-grid">
      <div className="campus-structure"><div className="panel-title"><p>Estructura</p>{role === "architect" && <button onClick={addStage}>＋ Etapa</button>}</div>{locale.stages.map((item, index) => <button key={item.id} className={active === index ? "active" : ""} onClick={() => setActive(index)}><em>{String(index + 1).padStart(2, "0")}</em><span>{item.name}</span><i aria-hidden="true">›</i></button>)}{role === "architect" && <div className="reorder"><button disabled={active === 0} onClick={() => move(-1)}>↑ Subir</button><button disabled={active === locale.stages.length - 1} onClick={() => move(1)}>↓ Bajar</button></div>}</div>
      <div className="campus-fields"><p className="panel-kicker">Contenido · {lang.toUpperCase()} <button onClick={() => setLang(lang === "es" ? "en" : "es")}>Editar {lang === "es" ? "EN" : "ES"}</button></p>{role === "architect" && <div className="campus-stage-actions"><span>Etapa seleccionada: <b>{stage.name}</b></span><button onClick={duplicateStage}>Duplicar</button><button className="danger" disabled={locale.stages.length <= 1} onClick={removeStage}>Eliminar etapa</button></div>}<label>Antetítulo del taller<input value={locale.eyebrow} onChange={event => updateLocale({ eyebrow: event.target.value })} /></label><label>Título principal<input value={locale.hero} onChange={event => updateLocale({ hero: event.target.value })} /></label><label>Subtítulo<input value={locale.subtitle} onChange={event => updateLocale({ subtitle: event.target.value })} /></label><hr/><label>Nombre de la etapa<input value={stage.name} onChange={event => updateStage({ name: event.target.value })} /></label><label>Rótulo y duración<input value={stage.label} onChange={event => updateStage({ label: event.target.value })} /></label><label>Título de la etapa<input value={stage.title} onChange={event => updateStage({ title: event.target.value })} /></label><label>Texto<textarea value={stage.body} onChange={event => updateStage({ body: event.target.value })} /></label><div className="campus-media"><p>Imagen, video o media</p><div><input value={stage.mediaUrl} onChange={event => updateStage({ mediaUrl: event.target.value })} placeholder="Pegá un enlace a YouTube, Vimeo, imagen o audio"/><label className={`campus-upload-button ${uploading || !storageReady ? "is-disabled" : ""}`}><input type="file" accept="image/*,audio/*,application/pdf" disabled={uploading || !storageReady} onChange={uploadMedia}/>{uploading ? "Subiendo…" : "＋ Subir archivo"}</label></div><small>Imágenes, audios y PDF de hasta 4 MB. Para videos, pegá un enlace de YouTube o Vimeo.</small></div><div className="campus-blocks"><p>Agregar bloque</p><div>{(Object.keys(blockNames) as CampusBlock["type"][]).map(type => <button key={type} onClick={() => addBlock(type)}>＋ {blockNames[type]}</button>)}</div></div>{stage.blocks.map((block, index) => <div className="campus-block-editor" key={block.id}><p><select aria-label="Tipo de bloque" value={block.type} onChange={event => updateBlock(index, { type: event.target.value as CampusBlock["type"] })}>{(Object.keys(blockNames) as CampusBlock["type"][]).map(type => <option key={type} value={type}>{blockNames[type]}</option>)}</select><span><button disabled={index === 0} onClick={() => moveBlock(index, -1)}>↑</button><button disabled={index === stage.blocks.length - 1} onClick={() => moveBlock(index, 1)}>↓</button><button className="danger" onClick={() => updateStage({ blocks: stage.blocks.filter((_, blockIndex) => blockIndex !== index) })}>Quitar</button></span></p><textarea value={block.content} onChange={event => updateBlock(index, { content: event.target.value })} placeholder="Contenido del bloque"/>{block.type !== "text" && block.type !== "prompt" && <div className="campus-block-media"><input value={block.url || ""} onChange={event => updateBlock(index, { url: event.target.value })} placeholder="Enlace del recurso"/><label className={`campus-upload-button ${uploading || !storageReady || block.type === "video" ? "is-disabled" : ""}`}><input type="file" accept={block.type === "image" ? "image/*" : block.type === "audio" ? "audio/*" : "application/pdf,image/*,audio/*"} disabled={uploading || !storageReady || block.type === "video"} onChange={event => uploadBlockMedia(index, event)}/>{block.type === "video" ? "Usar enlace" : uploading ? "Subiendo…" : "＋ Subir"}</label></div>}</div>)}</div>
      <aside className="campus-preview"><p>Vista previa</p><article><small>{locale.eyebrow}</small><h2>{locale.hero}</h2><blockquote>{locale.subtitle}</blockquote><h3>{String(active + 1).padStart(2, "0")} · {stage.name}</h3><b>{stage.title}</b><AdminMediaPreview url={stage.mediaUrl}/><p>{stage.body}</p>{stage.blocks.map(block => <p key={block.id}><small>{blockNames[block.type]}</small><br/>{block.content}</p>)}</article><small>{storageReady ? "Guardar conserva el borrador. Publicar actualiza la experiencia visible." : "La interfaz está preparada; falta crear el almacén de Vercel para activar Guardar y Publicar."}</small></aside>
    </div></section></div></main>;
}

function AdminMediaPreview({ url }: { url: string }) {
  if (!url) return <div className="preview-media">＋ MEDIA</div>;
  let decoded = url.toLowerCase();
  try { decoded = decodeURIComponent(url).toLowerCase(); } catch { /* Keep the original URL when it contains a literal percent sign. */ }
  if (/\.(png|jpe?g|webp|gif|avif|svg)(?:\?|$)/.test(decoded)) return <div className="preview-media has-media"><img src={url} alt="Vista previa del material" /></div>;
  if (/\.(mp3|wav|ogg|m4a|aac)(?:\?|$)/.test(decoded)) return <div className="preview-media has-media"><audio controls src={url} /></div>;
  if (/\.pdf(?:\?|$)/.test(decoded)) return <div className="preview-media has-media"><iframe src={url} title="Vista previa del documento" /></div>;
  return <div className="preview-media">MEDIA CONECTADA</div>;
}
