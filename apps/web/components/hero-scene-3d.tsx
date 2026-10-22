"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ══════════════════════════════════════════════════════════════════
   3D STUDY DESK COMPONENT
   ══════════════════════════════════════════════════════════════════ */
function StudyDesk({ scrollProgress }: { scrollProgress: number }) {
  const tableRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const phoneRef = useRef<THREE.Group>(null);
  const lampRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Group>(null);
  const penRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Animate based on scroll progress
    if (tableRef.current) {
      tableRef.current.rotation.x = THREE.MathUtils.lerp(-0.3, -0.1, scrollProgress);
      tableRef.current.position.y = THREE.MathUtils.lerp(-0.5, 0, scrollProgress);
    }
    if (laptopRef.current) {
      laptopRef.current.position.x = THREE.MathUtils.lerp(2, 0, scrollProgress);
      laptopRef.current.position.y = THREE.MathUtils.lerp(-1, 0.5, scrollProgress);
    }
    if (phoneRef.current) {
      phoneRef.current.position.x = THREE.MathUtils.lerp(-2, 0, scrollProgress);
      phoneRef.current.position.y = THREE.MathUtils.lerp(-1.5, 0, scrollProgress);
    }
    if (lampRef.current) {
      lampRef.current.position.z = THREE.MathUtils.lerp(-2, 0, scrollProgress);
      lampRef.current.position.y = THREE.MathUtils.lerp(-0.5, 1, scrollProgress);
    }
  });

  return (
    <group ref={tableRef}>
      {/* Table */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[6, 0.2, 4]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Laptop */}
      <group ref={laptopRef} position={[1.5, 0.5, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[1.2, 0.05, 0.8]} />
          <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.6, -0.35]}>
          <boxGeometry args={[1.2, 0.7, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, -0.35]} material-color="#4CAF50">
          <planeGeometry args={[1.1, 0.6]} />
        </mesh>
      </group>

      {/* Phone */}
      <group ref={phoneRef} position={[-1.5, 0, 0.5]}>
        <mesh>
          <boxGeometry args={[0.4, 0.8, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.35, 0.7]} />
          <meshStandardMaterial color="#2196F3" roughness={0.1} />
        </mesh>
      </group>

      {/* Study Lamp */}
      <group ref={lampRef} position={[2, 0, -1]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.4, 0.8, 32]} />
          <meshStandardMaterial color="#FFA500" transparent opacity={0.8} />
        </mesh>
        <pointLight position={[0, 1.5, 0]} color="#FFD700" intensity={2} distance={5} />
      </group>

      {/* Books */}
      <group ref={bookRef} position={[-2, 0, -0.5]}>
        {[0, 0.1, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y + 0.05, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color={["#FF6B6B", "#4ECDC4", "#45B7D1"][i]} />
          </mesh>
        ))}
      </group>

      {/* Pens */}
      <group ref={penRef} position={[-1, 0, 1]}>
        {[0, 0.15, 0.3].map((angle, i) => (
          <mesh key={i} position={[0, 0.02, 0]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color={["#E74C3C", "#3498DB", "#2ECC71"][i]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3D SCENE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
function Scene3D({ onScrollProgress }: { onScrollProgress: (progress: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        onScrollProgress(self.progress);
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [onScrollProgress]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <StudyDesk scrollProgress={0} />
      </Canvas>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO SECTION WITH 3D
   ══════════════════════════════════════════════════════════════════ */
export function HeroScene3D() {
  const [scrollProgress, setScrollProgress] = useState(0);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-night">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene3D onScrollProgress={setScrollProgress} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-night/50 via-transparent to-night/80" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          {/* Badge */}
          <div
            className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8"
            style={{
              animation: `float 7s ease-in-out infinite`,
            }}
          >
            <Star className="size-3.5 text-gold-deep fill-gold-deep" />
            <span className="text-xs font-semibold text-white/90">
              Trusted by 10,000+ aspirants across India
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] mb-8"
            style={{
              fontFamily: "var(--font-fraunces)",
              opacity: scrollProgress > 0.5 ? 0 : 1,
              transform: `translateY(${scrollProgress * -50}px)`,
              transition: "all 0.1s ease-out",
            }}
          >
            <span className="text-white">Study Smarter,</span>
            <br />
            <span
              className="text-gradient-gold"
              style={{
                background: "linear-gradient(100deg, #b06e12, #f7cf7a 45%, #b06e12)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Not Harder
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{
              fontFamily: "var(--font-outfit)",
              fontWeight: 300,
              opacity: scrollProgress > 0.3 ? 0 : 1,
              transform: `translateY(${scrollProgress * -30}px)`,
              transition: "all 0.1s ease-out",
            }}
          >
            The all-in-one study community for JEE, NEET, and board exam
            aspirants. Track progress, join live rooms, and achieve your dream
            rank — together.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              opacity: scrollProgress > 0.4 ? 0 : 1,
              transform: `translateY(${scrollProgress * -20}px)`,
              transition: "all 0.1s ease-out",
            }}
          >
            <Link href="/register" className="group">
              <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black shadow-clay-lg glow-gold inline-flex items-center gap-2 transition-all duration-300 hover:scale-105">
                Start Free Trial
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/tour" className="group">
              <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold inline-flex items-center gap-2 transition-all duration-300 hover:scale-105">
                <Play className="size-4" />
                Watch Demo
              </span>
            </Link>
          </div>

          {/* Stats Row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
            style={{
              opacity: scrollProgress > 0.6 ? 0 : 1,
              transform: `translateY(${scrollProgress * -40}px)`,
              transition: "all 0.1s ease-out",
            }}
          >
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500K+", label: "Study Hours" },
              { value: "94%", label: "Success Rate" },
              { value: "150+", label: "Mentors" },
            ].map((stat) => (
              <div key={stat.label} className="clay-card-night flex flex-col items-center gap-2 p-4">
                <span
                  className="text-2xl md:text-3xl font-black text-gold"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-white/60 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="size-8 text-white/50" />
      </div>
    </section>
  );
}

// Import statements needed
import { Star, ArrowRight, Play, ChevronDown } from "lucide-react";
import Link from "next/link";
