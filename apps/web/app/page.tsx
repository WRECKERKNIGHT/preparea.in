"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Star,
  BookOpen,
  CheckCircle2,
  Zap,
  BarChart3,
  Play,
  ChevronDown,
} from "lucide-react";
import { TSerif } from "@/components/ui/text-serif";
import { T } from "@/components/ui/text";
import { Magnetic } from "@/components/fx/magnetic";
import { Logo } from "@/components/logo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ══════════════════════════════════════════════════════════════════
   HERO SCENE — 3D Study Desk with Scroll-Triggered Animation
   ══════════════════════════════════════════════════════════════════ */
function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let scene: any, camera: any, renderer: any;
    let table: any, laptop: any, phone: any, lamp: any, book: any, pen: any;
    let animationId: number;
    let scrollProgress = 0;
    let mouseX = 0, mouseY = 0;

    // Lightweight 3D without Three.js dependency for now
    // Using CSS 3D transforms instead for performance

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600px] overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-night via-night-soft to-night opacity-95" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 3D Desk Scene */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <div className="relative w-full max-w-4xl h-full">
          {/* Table */}
          <div className="table-object absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-amber-900/80 rounded-lg shadow-2xl transform rotate-x-12"
               data-scroll="table" />

          {/* Laptop */}
          <div className="laptop-object absolute bottom-28 left-[20%] transform -translate-x-1/2" data-scroll="laptop">
            <div className="w-32 h-20 bg-gray-800 rounded-lg border-2 border-gray-600 shadow-xl">
              <div className="w-full h-full bg-blue-500/20 rounded flex items-center justify-center">
                <span className="text-white text-xs">📚</span>
              </div>
            </div>
            <div className="w-40 h-2 bg-gray-700 mx-auto mt-1 rounded-b-lg" />
          </div>

          {/* Phone */}
          <div className="phone-object absolute bottom-32 left-[35%] transform rotate-12" data-scroll="phone">
            <div className="w-12 h-20 bg-gray-900 rounded-xl border-2 border-gray-700 shadow-xl">
              <div className="w-full h-full bg-green-500/20 rounded flex items-center justify-center">
                <span className="text-white text-xs">📱</span>
              </div>
            </div>
          </div>

          {/* Study Lamp */}
          <div className="lamp-object absolute bottom-40 right-[25%] transform -translate-x-1/2" data-scroll="lamp">
            <div className="w-2 h-16 bg-yellow-600 mx-auto rounded-full" />
            <div className="w-12 h-8 bg-yellow-400/80 rounded-t-full shadow-lg shadow-yellow-500/50" />
          </div>

          {/* Books */}
          <div className="books-object absolute bottom-24 right-[15%]" data-scroll="books">
            <div className="w-16 h-4 bg-red-600 rounded m-1 shadow-md" />
            <div className="w-16 h-4 bg-blue-600 rounded m-1 shadow-md" />
            <div className="w-16 h-4 bg-green-600 rounded m-1 shadow-md" />
          </div>

          {/* Pens */}
          <div className="pens-object absolute bottom-28 right-[30%] transform rotate-45" data-scroll="pens">
            <div className="w-12 h-1 bg-red-500 rounded-full shadow-sm" />
            <div className="w-12 h-1 bg-blue-500 rounded-full shadow-sm mt-1" />
            <div className="w-12 h-1 bg-green-500 rounded-full shadow-sm mt-1" />
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-4">
          <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8 animate-float">
            <Star className="size-3.5 text-gold-deep fill-gold-deep" />
            <T className="text-xs font-semibold text-ink-muted">
              Trusted by 10,000+ aspirants across India
            </T>
          </div>

          <TSerif className="text-5xl sm:text-6xl md:text-8xl font-black leading-[1.08] mb-8 text-white">
            Study Smarter,{" "}
            <span className="text-gradient-gold">Not Harder</span>
          </TSerif>

          <T className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one study community for JEE, NEET, and board exam
            aspirants. Track progress, join live rooms, and achieve your dream
            rank — together.
          </T>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 pointer-events-auto">
            <Magnetic strength={0.2}>
              <Link href="/register">
                <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black shadow-clay-lg glow-gold inline-flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="size-5" />
                </span>
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/tour">
                <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold inline-flex items-center gap-2">
                  <Play className="size-4" />
                  Watch Demo
                </span>
              </Link>
            </Magnetic>
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce mt-8">
            <ChevronDown className="size-8 text-white/50 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING ORBS BACKGROUND
   ══════════════════════════════════════════════════════════════════ */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Warm golden glow top-left */}
      <div className="orb-glow absolute -top-32 -left-32 w-[600px] h-[600px] bg-gold/15 rounded-full blur-3xl" />
      {/* Soft plum glow bottom-right */}
      <div className="orb-glow absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-plum/12 rounded-full blur-3xl" />
      {/* Teal accent mid-right */}
      <div className="orb-glow absolute top-1/3 right-[10%] w-[350px] h-[350px] bg-teal/10 rounded-full blur-3xl" />
      {/* Berry accent mid-left */}
      <div className="orb-glow absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-berry/8 rounded-full blur-3xl" />
      {/* Floating decorative dots */}
      <div className="absolute top-[12%] left-[8%] w-3 h-3 rounded-full bg-gold/50 animate-float shadow-clay-sm" />
      <div className="absolute top-[28%] right-[12%] w-4 h-4 rounded-full bg-plum/40 animate-float-slow" />
      <div className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-accent/40 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[35%] right-[20%] w-4 h-4 rounded-full bg-teal/35 animate-float-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[60%] left-[5%] w-2 h-2 rounded-full bg-berry/50 animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-[15%] left-[25%] w-3 h-3 rounded-full bg-gold/40 animate-float-slow" style={{ animationDelay: "0.5s" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STAT PILL
   ══════════════════════════════════════════════════════════════════ */
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="clay-card-night flex flex-col items-center gap-1 px-6 py-4 min-w-[110px]">
      <TSerif className="text-2xl md:text-3xl font-black text-gold">{value}</TSerif>
      <T className="text-xs text-white/60 font-medium">{label}</T>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEATURE CARD
   ══════════════════════════════════════════════════════════════════ */
interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "accent" | "gold" | "plum" | "teal" | "berry";
}

const FEATURES: FeatureItem[] = [
  {
    icon: <Clock className="size-5" />,
    title: "Smart Study Timer",
    desc: "Pomodoro-style timer with room selection, session notes, and auto-tracking — your sessions save automatically.",
    color: "accent",
  },
  {
    icon: <BarChart3 className="size-5" />,
    title: "Analytics Dashboard",
    desc: "Daily, weekly & monthly trends at a glance. See streaks, consistency heatmaps, and productivity patterns.",
    color: "gold",
  },
  {
    icon: <Users className="size-5" />,
    title: "Live Study Rooms",
    desc: "Join scheduled group sessions with peers prepping for the same exam — accountability through community.",
    color: "plum",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Password Security",
    desc: "Instant login with scrypt-hashed passwords and secure reset tokens — no more waiting for OTP emails.",
    color: "teal",
  },
  {
    icon: <Star className="size-5" />,
    title: "Challenge System",
    desc: "7-day consistency challenges, streak rewards, and friendly competition to keep you motivated daily.",
    color: "berry",
  },
  {
    icon: <BookOpen className="size-5" />,
    title: "Mentor Sessions",
    desc: "Learn from successful IIT / AIIMS aspirants through live Q&A and guidance from those who've been there.",
    color: "accent",
  },
];

function FeatureCard({ f, index }: { f: FeatureItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      }
    );
  }, [index]);

  const iconBgs: Record<string, string> = {
    accent: "bg-accent-light text-accent",
    gold: "bg-gold-light text-gold-deep",
    plum: "bg-purple-100 text-plum",
    teal: "bg-teal/15 text-teal",
    berry: "bg-pink-100 text-berry",
  };

  return (
    <div
      ref={ref}
      className="clay-card flex flex-col gap-4 p-7 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-clay"
    >
      <div className={`clay-icon size-12 ${iconBgs[f.color]}`}>{f.icon}</div>
      <TSerif className="text-lg font-bold text-ink">{f.title}</TSerif>
      <T className="text-sm text-ink-muted leading-relaxed flex-1">{f.desc}</T>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STEP CARD
   ══════════════════════════════════════════════════════════════════ */
interface StepItem {
  num: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  { num: "1", title: "Create Account", desc: "Sign up in 30 seconds with email and password — instant access, no OTP waiting." },
  { num: "2", title: "Set Your Goals", desc: "Pick your exam (JEE / NEET / Boards), class, and daily study target." },
  { num: "3", title: "Start Studying", desc: "Use timers, join rooms, track streaks, and climb the leaderboard." },
];

function StepCard({ s, index }: { s: StepItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: index * 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      }
    );
  }, [index]);

  return (
    <div ref={ref} className="clay-card p-8 text-center flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full clay-icon-gold text-xl font-black flex items-center justify-center">{s.num}</div>
      <TSerif className="text-xl font-bold text-ink">{s.title}</TSerif>
      <T className="text-sm text-ink-muted leading-relaxed">{s.desc}</T>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TESTIMONIAL CARD
   ══════════════════════════════════════════════════════════════════ */
interface TestimonialItem {
  quote: string;
  name: string;
  exam: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "PrepArea helped me stay consistent for the first time. Went from 2 hrs/day to 8 hrs/day over 3 months.",
    name: "Aarav P.",
    exam: "JEE Advanced",
  },
  {
    quote: "The study rooms made me feel less alone. Studying alongside 20 other NEET aspirants kept me focused.",
    name: "Priya S.",
    exam: "NEET",
  },
  {
    quote: "Analytics showed me my weak patterns — I fixed them before the boards and scored 96%.",
    name: "Rohan M.",
    exam: "Class 12 Boards",
  },
];

function TestimonialCard({ t, index }: { t: TestimonialItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      }
    );
  }, [index]);

  return (
    <div ref={ref} className="clay-card-deep p-8 flex flex-col gap-4">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="size-4 text-gold fill-gold" />
        ))}
      </div>
      <T className="text-ink leading-relaxed italic">"{t.quote}"</T>
      <div>
        <T className="font-bold text-ink text-sm">{t.name}</T>
        <T className="text-xs text-ink-muted">{t.exam}</T>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TRUST BAR
   ══════════════════════════════════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon: <CheckCircle2 className="size-5 text-accent" />, text: "Free 7-day trial" },
    { icon: <Zap className="size-5 text-gold" />, text: "Instant setup" },
    { icon: <Shield className="size-5 text-plum" />, text: "Secure & private" },
  ];

  return (
    <div className="bg-raised border-y border-edge/40 py-4">
      <div className="mx-auto max-w-4xl flex flex-wrap justify-center gap-8 px-4">
        {items.map((item) => (
          <div key={item.text} className="flex items-center gap-2">
            {item.icon}
            <T className="text-sm text-ink-muted font-medium">{item.text}</T>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="relative min-h-screen bg-paper overflow-x-hidden">
      <BackgroundOrbs />

      {/* Trust Bar */}
      <TrustBar />

      {/* Hero Section with 3D Desk */}
      <HeroScene3D />

      {/* Divider */}
      <div className="dotted-light h-px w-full max-w-4xl mx-auto" aria-hidden="true" />

      {/* Features Section */}
      <section className="relative py-24 px-4 bg-raised">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <T className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-3 block">
              Everything you need
            </T>
            <TSerif className="text-3xl md:text-5xl font-black text-ink mb-4">
              Powerful Features
            </TSerif>
            <T className="text-ink-muted max-w-xl mx-auto">
              Designed to keep you focused, track your growth, and connect you
              with the community that lifts you up.
            </T>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <T className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-3 block">
              Simple process
            </T>
            <TSerif className="text-3xl md:text-5xl font-black text-ink">
              How It Works
            </TSerif>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <StepCard key={s.num} s={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="dotted-light h-px w-full max-w-4xl mx-auto" aria-hidden="true" />

      {/* Testimonials */}
      <section className="relative py-24 px-4 bg-night text-white overflow-hidden">
        <div className="absolute inset-0 stars opacity-50" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <T className="text-xs font-black uppercase tracking-[0.2em] text-gold mb-3 block">
              What they say
            </T>
            <TSerif className="text-3xl md:text-5xl font-black text-white">
              Loved by Aspirants
            </TSerif>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="clay-card-deep p-12 md:p-16 relative overflow-hidden">
            <div className="orb-glow absolute -top-16 -right-16 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
            <div className="orb-glow absolute -bottom-16 -left-16 w-64 h-64 bg-plum/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <TSerif className="text-3xl md:text-5xl font-black text-ink mb-6 leading-tight">
                Ready to Transform
                <br />
                Your{" "}
                <span className="text-gradient-gold">Preparation?</span>
              </TSerif>
              <T className="text-ink-muted text-lg mb-10 max-w-xl mx-auto">
                Join thousands of aspirants who are already achieving their
                dreams with PrepArea.
              </T>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.2}>
                  <Link href="/register">
                    <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black inline-flex items-center gap-2">
                      Start Free Trial
                      <ArrowRight className="size-5" />
                    </span>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link href="/login">
                    <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold">
                      Login
                    </span>
                  </Link>
                </Magnetic>
              </div>
              <T className="text-xs text-ink-faint mt-8">
                No credit card required · Cancel anytime · Free 7-day trial
              </T>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
