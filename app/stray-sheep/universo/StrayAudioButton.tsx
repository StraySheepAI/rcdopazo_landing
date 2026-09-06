"use client";

import { useEffect, useRef, useState } from "react";

export function StrayAudioButton({ playLabel, pauseLabel }: { playLabel: string; pauseLabel: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true));
    else { audio.pause(); setPlaying(false); }
  };

  return (
    <div className="stray-audio-mini">
      <audio ref={audioRef} src="/stray-video.mp4" preload="auto" onEnded={() => setPlaying(false)} />
      <button type="button" onClick={toggle} aria-label={playing ? pauseLabel : playLabel} title={playing ? pauseLabel : playLabel}>
        {playing ? "Ⅱ" : "▶"}
      </button>
    </div>
  );
}
