"use client";

import { useEffect, useRef } from "react";

export function StrayUniverseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      o: Math.random() * 0.8 + 0.3,
      speed: Math.random() * 0.0005 + 0.0002,
      twinkle: Math.random() * Math.PI * 2,
      dx: (Math.random() - 0.5) * 0.00008,
      dy: (Math.random() - 0.5) * 0.00004,
    }));
    const nebulas = [
      { x: 0.1, y: 0.2, r: 0.4, c: "200,20,120", o: 0.14 },
      { x: 0.9, y: 0.7, r: 0.35, c: "220,40,100", o: 0.11 },
      { x: 0.5, y: 0.5, r: 0.5, c: "150,10,80", o: 0.07 },
      { x: 0.7, y: 0.1, r: 0.3, c: "240,80,160", o: 0.09 },
      { x: 0.2, y: 0.8, r: 0.3, c: "180,30,120", o: 0.08 },
    ];
    const shoots: Array<{x:number;y:number;len:number;speed:number;angle:number;life:number}> = [];
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      nebulas.forEach((n) => {
        const gradient = ctx.createRadialGradient(n.x * width, n.y * height, 0, n.x * width, n.y * height, n.r * Math.min(width, height));
        gradient.addColorStop(0, `rgba(${n.c},${n.o})`);
        gradient.addColorStop(1, `rgba(${n.c},0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
      stars.forEach((star) => {
        star.twinkle += star.speed * 60;
        star.x = (star.x + star.dx + 1) % 1;
        star.y = (star.y + star.dy + 1) % 1;
        const opacity = star.o * (0.55 + 0.45 * Math.sin(star.twinkle));
        if (star.r > 1.4) {
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,150,200,${opacity * 0.18})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });
      if (shoots.length < 5 && Math.random() < 0.025) {
        shoots.push({ x: Math.random() * width, y: Math.random() * height * 0.5, len: Math.random() * 130 + 70, speed: Math.random() * 9 + 5, angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, life: 1 });
      }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const shoot = shoots[i];
        shoot.x += Math.cos(shoot.angle) * shoot.speed;
        shoot.y += Math.sin(shoot.angle) * shoot.speed;
        shoot.life -= 0.02;
        if (shoot.life <= 0) { shoots.splice(i, 1); continue; }
        const gradient = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - Math.cos(shoot.angle) * shoot.len, shoot.y - Math.sin(shoot.angle) * shoot.len);
        gradient.addColorStop(0, `rgba(232,112,180,${shoot.life * 0.95})`);
        gradient.addColorStop(1, "rgba(200,60,150,0)");
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(shoot.x - Math.cos(shoot.angle) * shoot.len, shoot.y - Math.sin(shoot.angle) * shoot.len);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      t += 0.001;
      nebulas[0].x = 0.1 + Math.sin(t) * 0.02;
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(frame); };
  }, []);

  return <canvas ref={canvasRef} className="stray-universe-canvas" aria-hidden="true" />;
}
