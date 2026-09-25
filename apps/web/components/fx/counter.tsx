"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function Counter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2,
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef({ n: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const render = () => {
      const text = valueRef.current.n.toFixed(decimals);
      el.textContent = `${prefix}${text}${suffix}`;
    };

    if (reduce) {
      valueRef.current.n = value;
      render();
      return;
    }

    const tween = gsap.fromTo(
      valueRef.current,
      { n: 0 },
      {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: render,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
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
  }, [value, suffix, prefix, decimals, duration]);

  return (
    <div
      ref={ref}
      className={`number ${className}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}0{suffix}
    </div>
  );
}