"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
  hue: "white" | "gold" | "plum" | "teal";
};

const COLORS: Record<Star["hue"], string> = {
  white: "255,255,255",
  gold: "240,184,74",
  plum: "167,143,240",
  teal: "126,199,208",
};

export function Stars({ count = 60 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let raf = 0;

    const hud = ["white", "gold", "plum", "teal"] as const;
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      base: 0.15 + Math.random() * 0.5,
      speed: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      hue: hud[Math.floor(Math.random() * hud.length)],
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = t * 0.001;
      for (const s of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS[s.hue]},${(s.base * tw).toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
      aria-hidden="true"
    />
  );
}