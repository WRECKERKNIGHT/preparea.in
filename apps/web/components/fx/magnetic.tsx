"use client";

import { useRef, useCallback, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({
  children,
  className = "",
  strength = 0.32,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.transition = "transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)";
      el.style.transform = "translate(0px, 0px)";
    }
  }, []);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => {
        const el = ref.current;
        if (el) el.style.transition = "transform 90ms ease-out";
      }}
    >
      {children}
    </span>
  );
}