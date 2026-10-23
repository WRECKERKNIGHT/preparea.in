"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight, Play, ChevronDown } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════
   CSS-BASED HERO — no Three.js, no canvas, zero layout shift
   ══════════════════════════════════════════════════════════════════ */

function FloatingOrb({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={`absolute rounded-full blur-3xl opacity-30 ${className}`} style={style} aria-hidden="true" />;
}

function StudyDeskScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    let scrollY = 0;

    const onScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          const maxScroll = window.innerHeight * 1.5;
          const p = Math.min(scrollY / maxScroll, 1);
          el.style.setProperty("--scroll", String(p));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    el.style.setProperty("--scroll", "0");
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-scene relative w-full h-[120vh] overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0d24] via-[#171536] to-[#0f0d24]" />

      {/* Floating orbs - pure CSS animation */}
      <FloatingOrb className="w-[500px] h-[500px] bg-purple-600/40 top-20 -left-40" />
      <FloatingOrb className="w-[400px] h-[400px] bg-yellow-500/20 top-40 right-0" />
      <FloatingOrb className="w-[300px] h-[300px] bg-blue-500/20 bottom-40 left-20" />
      <FloatingOrb className="w-[250px] h-[250px] bg-pink-500/15 bottom-20 right-20" />

      {/* Animated desk scene */}
      <div className="desk-scene absolute inset-0 flex items-center justify-center">
        {/* Table surface */}
        <div
          className="desk-table absolute w-[600px] h-[280px] rounded-2xl"
          style={{ transform: "perspective(1200px) rotateX(45deg) rotateZ(-5deg)", transformStyle: "preserve-3d" }}
        >
          <div className="desk-surface absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-900/80 to-amber-950/90 border border-amber-700/30 shadow-2xl" />
        </div>

        {/* Laptop */}
        <div
          className="desk-laptop absolute"
          style={{ left: "calc(50% - 200px)", top: "calc(50% + 40px)", transform: "translateZ(40px)" }}
        >
          <div className="laptop-screen w-[180px] h-[120px] rounded-lg bg-gray-900 border-2 border-gray-700 shadow-lg overflow-hidden">
            <div className="screen-content w-full h-full bg-gradient-to-br from-green-900/60 to-blue-900/60 flex items-center justify-center">
              <div className="text-xs text-green-400 font-mono">PrepArea</div>
            </div>
          </div>
          <div className="laptop-base w-[200px] h-[10px] rounded-b-lg bg-gray-800 mt-1 mx-auto" />
        </div>

        {/* Phone */}
        <div className="desk-phone absolute" style={{ right: "calc(50% - 160px)", top: "calc(50% + 60px)" }}>
          <div className="w-[50px] h-[90px] rounded-xl bg-gray-900 border border-gray-600 shadow-lg overflow-hidden">
            <div className="phone-screen w-full h-full bg-gradient-to-br from-blue-900/70 to-cyan-900/70" />
          </div>
        </div>

        {/* Books */}
        <div className="desk-books absolute" style={{ left: "calc(50% - 280px)", top: "calc(50% + 80px)" }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute w-[60px] h-[12px] rounded-sm shadow-md"
              style={{
                background: ["#FF6B6B", "#4ECDC4", "#45B7D1"][i],
                bottom: `${i * 13}px`,
                left: `${i * 3}px`,
                transform: `rotate(${-2 + i}deg)`,
              }}
            />
          ))}
        </div>

        {/* Lamp */}
        <div className="desk-lamp absolute" style={{ right: "calc(50% - 240px)", top: "calc(50% - 20px)" }}>
          <div className="lamp-base w-[40px] h-[8px] rounded-full bg-amber-700 mx-auto" />
          <div className="lamp-stem w-[3px] h-[50px] bg-amber-600 mx-auto" />
          <div className="lamp-shade w-[50px] h-[25px] rounded-t-full bg-yellow-500/80 mx-auto mt-0" />
          <div className="lamp-glow absolute w-[100px] h-[100px] -top-[30px] left-[-25px] rounded-full bg-yellow-400/20 blur-xl" />
        </div>

        {/* Coffee cup */}
        <div className="desk-cup absolute" style={{ right: "calc(50% - 100px)", top: "calc(50% + 100px)" }}>
          <div className="w-[30px] h-[25px] rounded-b-lg bg-white/90 shadow-md" />
        </div>
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          style={{ animation: "float 7s ease-in-out infinite" }}>
          <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white/90">Trusted by 10,000+ aspirants across India</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] mb-8 text-white"
          style={{ fontFamily: "var(--font-fraunces)" }}>
          Study Smarter,{" "}
          <span className="text-transparent bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 bg-clip-text"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Not Harder
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          The all-in-one study community for JEE, NEET, and board exam aspirants.
          Track progress, join live rooms, and achieve your dream rank — together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <span className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-yellow-500 to-amber-500 text-yellow-950 font-black text-base rounded-full shadow-lg hover:scale-105 transition-transform duration-200">
              Start Free Trial
              <ArrowRight className="size-5" />
            </span>
          </Link>
          <Link href="/tour">
            <span className="inline-flex items-center gap-2 px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base rounded-full hover:bg-white/20 transition-all duration-200">
              <Play className="size-4" />
              Watch Demo
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
          {[
            { value: "10K+", label: "Active Students" },
            { value: "500K+", label: "Study Hours" },
            { value: "94%", label: "Success Rate" },
            { value: "150+", label: "Mentors" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-2xl md:text-3xl font-black text-yellow-400">{stat.value}</div>
              <div className="text-xs text-white/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="size-8 text-white/50" />
      </div>
    </div>
  );
}

export function HeroScene3D() {
  return <StudyDeskScene />;
}
