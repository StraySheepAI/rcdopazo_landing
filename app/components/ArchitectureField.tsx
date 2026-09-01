"use client";

import { useEffect, useRef } from "react";

// Traducción directa del prototipo "R.C. Dopazo — Arquitectura viva"
// provisto por la autora (index.html + INSTRUCCIONES.txt): tres raíces
// (Discernir / Explorar / Reconfigurar), cada una con tres palabras hijas,
// orbitando el emblema R.C. Dopazo, unidas por curvas animadas que se
// cruzan entre sí. La lógica de dibujo (posiciones, curvas, triángulos,
// colores) se preserva sin reinterpretar ni simplificar; se retocaron
// únicamente dos constantes de layout (radio y apertura angular de las
// palabras hijas) para que no se superpongan al vivir en un campo más
// grande dentro del hero — pedido explícito, no un rediseño. El montaje
// (ResizeObserver + canvas transparente llenando su contenedor) está
// pensado para integrarse directamente en el hero de Home, sin overlays
// de marca/copy/controles del prototipo standalone original.
const TAU = Math.PI * 2;

type RGB = [number, number, number];

const COLORS: RGB[] = [
  [233, 189, 101],
  [232, 65, 146],
  [132, 88, 237],
];

const ROOTS = [
  { name: "DISCERNIR", words: ["Delimitar", "Triangular", "Evigilar"], angle: -Math.PI / 2, color: COLORS[0] },
  { name: "EXPLORAR", words: ["Percibir", "Relacionar", "Posibilitar"], angle: Math.PI / 6, color: COLORS[1] },
  { name: "RECONFIGURAR", words: ["Intervenir", "Observar", "Transmutar"], angle: (Math.PI * 5) / 6, color: COLORS[2] },
];

type Pt = { x: number; y: number };
type Child = { name: string; x: number; y: number; color: RGB };
type Root = { name: string; words: string[]; angle: number; color: RGB; x: number; y: number; children: Child[] };

function rgba(c: RGB, a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

export function ArchitectureField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const logo = logoRef.current;
    if (!wrap || !canvas || !logo) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    const pointer = { x: 0, y: 0, on: false };

    function size() {
      const r = wrap!.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tri(cx: number, cy: number, r: number, rot: number, stroke: RGB, alpha: number, width = 1, fill = 0) {
      ctx!.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = rot + (i * TAU) / 3;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y);
      }
      ctx!.closePath();
      ctx!.strokeStyle = rgba(stroke, alpha);
      ctx!.lineWidth = width;
      if (fill) {
        ctx!.fillStyle = rgba(stroke, fill);
        ctx!.fill();
      }
      ctx!.stroke();
    }

    function qpoint(a: Pt, c: Pt, b: Pt, u: number): Pt {
      const v = 1 - u;
      return { x: v * v * a.x + 2 * v * u * c.x + u * u * b.x, y: v * v * a.y + 2 * v * u * c.y + u * u * b.y };
    }

    function curve(a: Pt, b: Pt, color: RGB, rank: number, alpha = 0.22) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const bend = Math.sin(t * 0.00018 + rank * 2.1) * Math.min(46, len * 0.13);
      const c = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
      const g = ctx!.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, rgba(color, 0.09));
      g.addColorStop(0.48, rgba(color, alpha));
      g.addColorStop(1, rgba(color, 0.1));
      [-5, 0, 6].forEach((o, i) => {
        ctx!.beginPath();
        ctx!.moveTo(a.x + nx * o, a.y + ny * o);
        ctx!.quadraticCurveTo(c.x + nx * o, c.y + ny * o, b.x + nx * o, b.y + ny * o);
        ctx!.strokeStyle = g;
        ctx!.lineWidth = i === 1 ? 1.35 : 0.62;
        ctx!.stroke();
      });
      const u = (t * 0.000055 + rank * 0.27) % 1;
      const p = qpoint(a, c, b, u);
      const trail = qpoint(a, c, b, Math.max(0, u - 0.07));
      ctx!.beginPath();
      ctx!.moveTo(trail.x, trail.y);
      ctx!.lineTo(p.x, p.y);
      ctx!.strokeStyle = rgba(color, 0.68);
      ctx!.lineWidth = 1.9;
      ctx!.stroke();
      const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
      glow.addColorStop(0, rgba(color, 0.8));
      glow.addColorStop(1, rgba(color, 0));
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, 9, 0, TAU);
      ctx!.fill();
    }

    function positions(): Root[] {
      // en contenedores angostos (mobile) se achica el radio para que las
      // etiquetas no salgan del canvas — mismo criterio, menos alcance.
      const narrow = w < 480;
      const cx = w * (narrow ? 0.5 : 0.52);
      const cy = h * 0.48;
      const orbit = Math.min(w * (narrow ? 0.27 : 0.34), h * (narrow ? 0.27 : 0.34));
      return ROOTS.map((r, i) => {
        const drift = Math.sin(t * 0.00013 + i * 2.2) * 0.08;
        const a = r.angle + drift;
        const breath = 1 + Math.sin(t * 0.00019 + i) * 0.055;
        const x = cx + Math.cos(a) * orbit * breath;
        const y = cy + Math.sin(a) * orbit * 0.82 * breath;
        // radio y apertura angular de las 3 palabras hijas — ampliados
        // respecto al prototipo (que ya se pisaban en DISCERNIR incluso a
        // pantalla completa) para que quepan legibles en el campo del hero.
        const children = r.words.map((name, j) => {
          const ca = a + (j - 1) * 0.86 + Math.sin(t * 0.00017 + j + i) * 0.07;
          const cr = narrow ? Math.min(58, Math.max(40, orbit * 0.42)) : Math.min(118, Math.max(66, orbit * 0.42));
          return { name, x: x + Math.cos(ca) * cr, y: y + Math.sin(ca) * cr * 0.72, color: r.color };
        });
        return { ...r, x, y, children };
      });
    }

    function background() {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < Math.min(90, (w * h) / 13000); i++) {
        const x = (i * 191.3) % w;
        const y = (i * i * 53.7 + 71) % h;
        const a = 0.06 + 0.08 * (1 + Math.sin(t * 0.0004 + i));
        ctx!.fillStyle = `rgba(240,230,218,${a})`;
        ctx!.fillRect(x, y, i % 9 ? 0.7 : 1.3, i % 9 ? 0.7 : 1.3);
      }
    }

    function center(cx: number, cy: number, R: number) {
      const pulse = 1 + Math.sin(t * 0.0008) * 0.018;
      for (let i = 0; i < 5; i++) {
        tri(
          cx,
          cy,
          R * (1.1 + i * 0.19),
          -Math.PI / 2 + t * 0.000018 * (i % 2 ? 1 : -1),
          COLORS[i % 3],
          0.04 + i * 0.015,
          0.55,
          i === 1 ? 0.006 : 0
        );
      }
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 1.35);
      halo.addColorStop(0, "rgba(232,187,102,.11)");
      halo.addColorStop(0.52, "rgba(194,67,152,.05)");
      halo.addColorStop(1, "rgba(80,44,160,0)");
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.35, 0, TAU);
      ctx!.fill();
      if (logo!.complete) {
        ctx!.save();
        ctx!.translate(cx, cy);
        ctx!.globalAlpha = 0.92;
        ctx!.shadowBlur = 30;
        ctx!.shadowColor = "rgba(224,166,70,.32)";
        ctx!.drawImage(logo!, -R * pulse, -R * pulse, R * 2 * pulse, R * 2 * pulse);
        ctx!.restore();
      }
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + i * (TAU / 3) + t * 0.000035;
        const p = { x: cx + Math.cos(a) * R * 0.82, y: cy + Math.sin(a) * R * 0.82 };
        ctx!.fillStyle = rgba(COLORS[i], 0.65);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.8, 0, TAU);
        ctx!.fill();
      }
    }

    function network(P: Root[], cx: number, cy: number, R: number) {
      const narrow = w < 480;
      const orbit = Math.min(w * (narrow ? 0.27 : 0.34), h * (narrow ? 0.27 : 0.34));
      tri(cx, cy, orbit * 1.03, -Math.PI / 2 + t * 0.000008, COLORS[0], 0.18, 1.05, 0.008);
      P.forEach((p, i) =>
        curve({ x: cx + Math.cos(p.angle) * R * 0.72, y: cy + Math.sin(p.angle) * R * 0.72 }, p, p.color, i, 0.46)
      );
      P.forEach((p, i) => curve(p, P[(i + 1) % 3], p.color, i + 3, 0.24));
      P.forEach((p, i) => {
        const heat = pointer.on ? Math.max(0, 1 - Math.hypot(pointer.x - p.x, pointer.y - p.y) / 150) : 0;
        const rootRadius = narrow ? 37 : Math.max(43, Math.min(56, w * 0.048));
        tri(p.x, p.y, rootRadius + Math.sin(t * 0.00035 + i) * 4, -Math.PI / 2 + t * 0.00005 * (i % 2 ? 1 : -1), p.color, 0.5 + heat * 0.25, 1.15, 0.025);
        tri(p.x, p.y, rootRadius * 1.25, -Math.PI / 2 - t * 0.000027, p.color, 0.18, 0.7);
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.font = `600 ${Math.max(9, Math.min(13, w * 0.011))}px Rajdhani, sans-serif`;
        ctx!.fillStyle = "rgba(248,242,236,.92)";
        ctx!.fillText(p.name, p.x, p.y - (narrow ? 34 : 58));
        p.children.forEach((ch, j) => {
          curve(p, ch, p.color, 7 + i * 3 + j, 0.18);
          tri(ch.x, ch.y, 9 + j * 1.7, -Math.PI / 2 + t * 0.00006 * (j % 2 ? 1 : -1), p.color, 0.3, 0.55, 0.01);
          ctx!.font = `500 ${Math.max(8, Math.min(11, w * 0.009))}px Rajdhani, sans-serif`;
          ctx!.fillStyle = "rgba(248,242,236,.62)";
          ctx!.fillText(ch.name, ch.x, ch.y + (narrow ? 13 : 20));
        });
        ctx!.beginPath();
        p.children.forEach((ch, j) => (j ? ctx!.lineTo(ch.x, ch.y) : ctx!.moveTo(ch.x, ch.y)));
        ctx!.closePath();
        ctx!.strokeStyle = rgba(p.color, 0.18);
        ctx!.fillStyle = rgba(p.color, 0.014);
        ctx!.lineWidth = 0.75;
        ctx!.fill();
        ctx!.stroke();
      });
    }

    function frame(now: number) {
      const dt = Math.min(40, now - last);
      last = now;
      t += dt;
      background();
      const narrow = w < 480;
      const cx = w * (narrow ? 0.5 : 0.52);
      const cy = h * 0.48;
      const R = narrow ? Math.max(50, Math.min(84, Math.min(w, h) * 0.145)) : Math.max(88, Math.min(142, Math.min(w, h) * 0.155));
      const P = positions();
      network(P, cx, cy, R);
      center(cx, cy, R);
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const r = wrap!.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    }
    function onLeave() {
      pointer.on = false;
    }

    const ro = new ResizeObserver(size);
    ro.observe(wrap);
    size();
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="architecture-field" ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={logoRef} src="/rc-dopazo-emblem.png" alt="" style={{ display: "none" }} />
    </div>
  );
}
