"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = self.progress;
        setWidth(Math.round(p * 100));
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left"
      aria-hidden="true"
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-gold via-gold-soft to-teal"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}