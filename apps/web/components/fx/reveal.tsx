"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
  id?: string;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  x = 0,
  scale = 1,
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y, x, scale },
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1.05,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once,
        },
      }
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener("load", onLoad);
    };
  }, [delay, y, x, scale, once]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}