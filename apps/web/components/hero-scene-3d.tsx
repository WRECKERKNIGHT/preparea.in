"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Play, ChevronDown } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const booksRef = useRef<THREE.Group>(null);
  const pensRef = useRef<THREE.Group>(null);
  const cupRef = useRef<THREE.Group>(null);
  const glassesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = scrollProgress;

    // Table - subtle rotation
    if (tableRef.current) {
      tableRef.current.rotation.x = THREE.MathUtils.lerp(-0.4, -0.15, p);
      tableRef.current.rotation.y = THREE.MathUtils.lerp(0.1, 0, p);
      tableRef.current.position.y = THREE.MathUtils.lerp(-0.8, 0, p);
    }

    // Laptop - slides in from left
    if (laptopRef.current) {
      laptopRef.current.position.x = THREE.MathUtils.lerp(-3, -0.5, p);
      laptopRef.current.position.y = THREE.MathUtils.lerp(-2, 0.3, p);
      laptopRef.current.rotation.z = THREE.MathUtils.lerp(0.3, 0, p);
      laptopRef.current.rotation.y = THREE.MathUtils.lerp(-0.5, 0, p);
    }

    // Phone - slides in from right
    if (phoneRef.current) {
      phoneRef.current.position.x = THREE.MathUtils.lerp(3, 1.2, p);
      phoneRef.current.position.y = THREE.MathUtils.lerp(-1.5, 0.2, p);
      phoneRef.current.rotation.z = THREE.MathUtils.lerp(-0.3, 0, p);
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(0.5, 0, p);
    }

    // Lamp - rises from below
    if (lampRef.current) {
      lampRef.current.position.x = THREE.MathUtils.lerp(0, 2, p);
      lampRef.current.position.y = THREE.MathUtils.lerp(-2, 1, p);
      lampRef.current.position.z = THREE.MathUtils.lerp(0, -0.5, p);
    }

    // Books - stack up from bottom
    if (booksRef.current) {
      booksRef.current.position.x = THREE.MathUtils.lerp(-2.5, -1.8, p);
      booksRef.current.position.y = THREE.MathUtils.lerp(-2, 0.1, p);
      booksRef.current.position.z = THREE.MathUtils.lerp(0, 0.5, p);
    }

    // Pens - roll in from side
    if (pensRef.current) {
      pensRef.current.position.x = THREE.MathUtils.lerp(2.5, 1.5, p);
      pensRef.current.position.y = THREE.MathUtils.lerp(-1.8, 0, p);
      pensRef.current.rotation.z = THREE.MathUtils.lerp(1, 0, p);
    }

    // Coffee cup - appears from right
    if (cupRef.current) {
      cupRef.current.position.x = THREE.MathUtils.lerp(2.8, 2.2, p);
      cupRef.current.position.y = THREE.MathUtils.lerp(-1.5, 0.15, p);
      cupRef.current.position.z = THREE.MathUtils.lerp(-0.5, 0, p);
    }

    // Glasses - slide from top
    if (glassesRef.current) {
      glassesRef.current.position.x = THREE.MathUtils.lerp(-1, -0.5, p);
      glassesRef.current.position.y = THREE.MathUtils.lerp(2, 0.1, p);
      glassesRef.current.rotation.z = THREE.MathUtils.lerp(-0.2, 0, p);
    }
  });

  return (
    <group ref={tableRef}>
      {/* TABLE */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[8, 0.15, 5]} />
        <meshStandardMaterial color="#8B6914" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Table legs */}
      <mesh position={[-3.5, -1, -2]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#7A5C12" />
      </mesh>
      <mesh position={[3.5, -1, -2]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#7A5C12" />
      </mesh>
      <mesh position={[-3.5, -1, 2]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#7A5C12" />
      </mesh>
      <mesh position={[3.5, -1, 2]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#7A5C12" />
      </mesh>

      {/* LAPTOP */}
      <group ref={laptopRef} position={[-1.5, 0.5, 0]}>
        <mesh position={[0, 0.5, -0.4]} castShadow>
          <boxGeometry args={[1.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, -0.37]} castShadow>
          <planeGeometry args={[1.7, 1.1]} />
          <meshStandardMaterial color="#4CAF50" emissive="#2E7D32" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 0.05, 1.2]} />
          <meshStandardMaterial color="#2d2d2d" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.03, 0.3]} castShadow>
          <boxGeometry args={[0.6, 0.02, 0.4]} />
          <meshStandardMaterial color="#3d3d3d" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>

      {/* PHONE */}
      <group ref={phoneRef} position={[1.2, 0.2, 0.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.8, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.35, 0.7]} />
          <meshStandardMaterial color="#2196F3" emissive="#1565C0" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* STUDY LAMP */}
      <group ref={lampRef} position={[2.2, 0.5, -0.8]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#FFA500" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
          <coneGeometry args={[0.4, 0.3, 32]} />
          <meshStandardMaterial color="#FFEB3B" transparent opacity={0.9} emissive="#FFD54F" emissiveIntensity={0.5} />
        </mesh>
        <pointLight position={[0, 0.8, 0]} color="#FFD700" intensity={2} distance={8} castShadow />
      </group>

      {/* BOOKS */}
      <group ref={booksRef} position={[-1.8, 0.1, 0.8]}>
        {[
          { color: "#FF6B6B", y: 0.05 },
          { color: "#4ECDC4", y: 0.15 },
          { color: "#45B7D1", y: 0.25 },
        ].map((book, i) => (
          <mesh key={i} position={[0, book.y, 0]} castShadow>
            <boxGeometry args={[0.6, 0.1, 0.4]} />
            <meshStandardMaterial color={book.color} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* PENS */}
      <group ref={pensRef} position={[1.5, 0.05, 0.8]}>
        {[
          { color: "#E74C3C", rot: 0.1 },
          { color: "#3498DB", rot: -0.05 },
          { color: "#2ECC71", rot: 0.08 },
        ].map((pen, i) => (
          <mesh key={i} position={[i * 0.1 - 0.1, 0, 0]} rotation={[0, 0, pen.rot]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color={pen.color} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* COFFEE CUP */}
      <group ref={cupRef} position={[2.2, 0.15, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0.15, 0, 0]} castShadow>
          <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
      </group>

      {/* GLASSES */}
      <group ref={glassesRef} position={[-0.5, 0.1, 1]}>
        <mesh castShadow>
          <torusGeometry args={[0.12, 0.015, 8, 24]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 0, 0]} castShadow>
          <torusGeometry args={[0.12, 0.015, 8, 24]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.15, 0.05, 0]}>
          <boxGeometry args={[0.1, 0.01, 0.01]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.01, 0.01]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.42, 0, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.15, 0.01, 0.01]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3D SCENE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
function Scene3D({ onScrollProgress }: { onScrollProgress: (progress: number) => void }) {
  const [, setProgress] = useState(0);

  useEffect(() => {
    // Simple interval to simulate scroll progress for demo
    const interval = setInterval(() => {
      setProgress(p => p >= 1 ? 0 : p + 0.01);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 3, 6], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} color="#FFF8E7" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#FFE4B5"
        castShadow
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#9370DB" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={0.5} intensity={0.8} castShadow />

      <color attach="background" args={["#171536"]} />
      <fog attach="fog" args={["#171536", 10, 25]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0f0d24" roughness={0.8} />
      </mesh>

      <StudyDesk scrollProgress={0.5} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO SECTION WITH 3D
   ══════════════════════════════════════════════════════════════════ */
export function HeroScene3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#171536]">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Scene3D onScrollProgress={() => {}} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#171536]/30 via-transparent to-[#171536]/90 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-5xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            style={{ animation: "float 7s ease-in-out infinite" }}
          >
            <Star className="size-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-white/90">
              Trusted by 10,000+ aspirants across India
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] mb-8 text-white">
            Study Smarter,{" "}
            <span
              className="text-transparent"
              style={{
                background: "linear-gradient(100deg, #b06e12, #f7cf7a 45%, #f0b84a, #b06e12)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              Not Harder
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            The all-in-one study community for JEE, NEET, and board exam
            aspirants. Track progress, join live rooms, and achieve your dream
            rank — together.
          </p>

          {/* CTA Buttons */}
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

          {/* Stats Row */}
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
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="size-8 text-white/50" />
      </div>
    </div>
  );
}
