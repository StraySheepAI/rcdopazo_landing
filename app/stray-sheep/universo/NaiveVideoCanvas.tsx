"use client";

import { useEffect, useRef } from "react";

export function NaiveVideoCanvas({ label }: { label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!video || !canvas || !ctx) return;
    let animation = 0;
    let previousTime = -1;
    const width = 420;
    const height = 640;
    const pixels = width * height;
    const seen = new Uint8Array(pixels);
    const queue = new Uint32Array(pixels);
    canvas.width = width;
    canvas.height = height;

    const render = () => {
      if (video.readyState >= 2 && video.currentTime !== previousTime) {
        previousTime = video.currentTime;
        const cropTop = Math.round(video.videoHeight * 0.08);
        const cropHeight = Math.round(video.videoHeight * 0.84);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(video, 0, cropTop, video.videoWidth, cropHeight, 0, 0, width, height);
        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;
        seen.fill(0);
        let head = 0, tail = 0;
        const eligible = (p: number) => {
          const i = p * 4;
          const r = data[i], g = data[i + 1], b = data[i + 2];
          return Math.min(r, g, b) > 210 && Math.max(r, g, b) - Math.min(r, g, b) < 42;
        };
        const push = (p: number) => {
          if (!seen[p] && eligible(p)) { seen[p] = 1; queue[tail++] = p; }
        };
        for (let x = 0; x < width; x++) { push(x); push((height - 1) * width + x); }
        for (let y = 1; y < height - 1; y++) { push(y * width); push(y * width + width - 1); }
        while (head < tail) {
          const p = queue[head++];
          const x = p % width;
          if (x) push(p - 1);
          if (x + 1 < width) push(p + 1);
          if (p >= width) push(p - width);
          if (p + width < pixels) push(p + width);
        }
        for (let p = 0; p < pixels; p++) if (seen[p]) {
          const i = p * 4;
          data[i + 3] = 0;
        }
        ctx.putImageData(frame, 0, 0);
      }
      animation = requestAnimationFrame(render);
    };
    video.play().catch(() => undefined);
    animation = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="stray-naive-video" role="img" aria-label={label}>
      <video ref={videoRef} src="/stray-video.mp4" muted playsInline preload="auto" />
      <canvas ref={canvasRef} />
    </div>
  );
}
