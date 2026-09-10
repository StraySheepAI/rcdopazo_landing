"use client";

import { useEffect, useState } from "react";

type Role = "editor" | "architect";
const initialSteps = ["Preparación", "Umbral", "Siete lentes", "Hacer hablar", "Laboratorio", "El tercero", "Integración"];

export default function CampusAdmin() {
  const [role, setRole] = useState<Role | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [steps, setSteps] = useState(initialSteps);
  const [active, setActive] = useState(0);
  const [title, setTitle] = useState("Principios universales");
  const [hero, setHero] = useState("Su papel en la creación de tu realidad");
  const [eyebrow, setEyebrow] = useState("Introducción a los principios universales");
  const [body, setBody] = useState("Prepará una realidad que hoy te esté ocupando.");
  const [media, setMedia] = useState("");

  useEffect(() => { fetch("/api/admin-campus/session").then(r => r.json()).then(d => { setRole(d.role); setReady(true); }); }, []);
  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const res = await fetch("/api/admin-campus/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await res.json(); if (!res.ok) return setError(data.error); setRole(data.role); setPassword("");
  };
  const logout = async () => { await fetch("/api/admin-campus/session", { method: "DELETE" }); setRole(null); };
  const renameStep = (value: string) => setSteps(steps.map((s, i) => i === active ? value : s));
  const move = (direction: number) => { const to = active + direction; if (to < 0 || to >= steps.length) return; const next = [...steps]; [next[active], next[to]] = [next[to], next[active]]; setSteps(next); setActive(to); };

  if (!ready) return <main className="campus-admin-login" />;
  if (!role) return <main className="campus-admin-login"><section><div className="campus-admin-seal">PF</div><p>Administrador del Campus</p><h1>La arquitectura se abre desde acá.</h1><span>Ingresá con tu clave de Editor o Arquitecta.</span><form onSubmit={login}><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" autoFocus /><button>Entrar al administrador</button></form>{error && <small>{error}</small>}</section></main>;

  return <main className="campus-admin"><header><div><span>PF</span><p><b>Administrador del Campus</b><small>Principios Universales · borrador</small></p></div><nav><a href="/mpa/transmuta/pulsus-fractum/agora/principios-universales" target="_blank">Ver página ↗</a><button onClick={logout}>Cerrar sesión</button></nav></header><div className="campus-admin-shell">
    <aside><p>Experiencias</p><h2>Ágora libre</h2><button className="is-selected">Principios Universales <small>En revisión</small></button><button>＋ Nueva experiencia</button><hr/><div className="campus-role"><span>{role === "architect" ? "Arquitecta" : "Editor"}</span><small>{role === "architect" ? "Contenido y estructura" : "Contenido"}</small></div></aside>
    <section className="campus-admin-editor"><div className="campus-admin-toolbar"><div><span>Borrador</span><b>Todos los cambios se previsualizan antes de publicar.</b></div><button>Guardar borrador</button><button>Previsualizar</button><button className="primary">Publicar</button></div><div className="campus-admin-grid">
      <div className="campus-structure"><div className="panel-title"><p>Estructura</p>{role === "architect" && <button onClick={() => setSteps([...steps, "Nueva etapa"])}>＋ Etapa</button>}</div>{steps.map((step, i) => <button key={`${step}-${i}`} className={active === i ? "active" : ""} onClick={() => setActive(i)}><em>{String(i + 1).padStart(2, "0")}</em><span>{step}</span><i>⋮</i></button>)}{role === "architect" && <div className="reorder"><button onClick={() => move(-1)}>↑ Subir</button><button onClick={() => move(1)}>↓ Bajar</button></div>}</div>
      <div className="campus-fields"><p className="panel-kicker">Contenido · ES <button>Editar EN</button></p><label>Nombre de la etapa<input value={steps[active]} onChange={e => renameStep(e.target.value)} /></label><label>Antetítulo<input value={eyebrow} onChange={e => setEyebrow(e.target.value)} /></label><label>Título principal<input value={active === 0 ? hero : title} onChange={e => active === 0 ? setHero(e.target.value) : setTitle(e.target.value)} /></label><label>Texto<textarea value={body} onChange={e => setBody(e.target.value)} /></label><div className="campus-media"><p>Imagen, video o media</p><div><input value={media} onChange={e => setMedia(e.target.value)} placeholder="Pegá un enlace a YouTube, Vimeo, imagen o audio"/><button>＋ Subir archivo</button></div><small>Podrás agregar texto alternativo, epígrafe y ubicación.</small></div><div className="campus-blocks"><p>Agregar bloque</p><div><button>＋ Texto</button><button>＋ Imagen</button><button>＋ Video</button><button>＋ Audio</button><button>＋ Descargable</button><button>＋ Consigna</button></div></div></div>
      <aside className="campus-preview"><p>Vista previa</p><article><small>{eyebrow}</small><h2>{active === 0 ? hero : title}</h2><h3>{String(active + 1).padStart(2, "0")} · {steps[active]}</h3><div className="preview-media">{media ? "MEDIA CONECTADA" : "＋ MEDIA"}</div><p>{body}</p></article><small>Esta vista todavía es un prototipo visual. La publicación persistente se activará al conectar el almacenamiento de Vercel.</small></aside>
    </div></section></div>
  </main>;
}
