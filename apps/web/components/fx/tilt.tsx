"use client";

import {
  useRef,
  useCallback,
  useLayoutEffect,
  type ReactNode,
  type CSSProperties,
} from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  max?: number;
  scale?: number;
  glare?: boolean;
  style?: CSSProperties;
};

export function Tilt({
  children,
  className = "",
  max = 10,
  scale = 1.02,
  glare = true,
  style,
}: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * max;
      const ry = (px - 0.5) * max;

      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.35), transparent 55%)`;
        glareRef.current.style.opacity = "1";
      }
    },
    [max, scale]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
      el.style.transition = "transform 160ms ease-out, box-shadow 200ms ease";
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
      {glare ? (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}