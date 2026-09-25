"use client";

import type { ReactNode } from "react";

type MarqueeProps = {
  items: ReactNode[];
  speed?: number;
  className?: string;
  separator?: ReactNode;
};

export function Marquee({
  items,
  className = "",
  separator,
}: MarqueeProps) {
  const row = (keyPrefix: string) => (
    <div
      key={keyPrefix}
      className="flex shrink-0 items-center gap-6 pr-6"
      aria-hidden={keyPrefix !== "a"}
    >
      {items.map((item, i) => (
        <div key={`${keyPrefix}-${i}`} className="flex items-center gap-6">
          <span>{item}</span>
          {separator ?? <span className="text-current opacity-50">✦</span>}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`relative flex w-full overflow-hidden ${className}`}
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}
    >
      <div className="flex w-max animate-marquee will-change-transform">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}