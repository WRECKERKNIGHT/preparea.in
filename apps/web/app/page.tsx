"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, Play, ChevronDown, Clock, TrendingUp, Users, Shield, BookOpen, BarChart3, CheckCircle2, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ══════════════════════════════════════════════════════════════════
   FLOATING ORBS BACKGROUND
   ══════════════════════════════════════════════════════════════════ */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div className="orb-glow absolute -top-32 -left-32 w-[600px] h-[600px] bg-gold/15 rounded-full blur-3xl" />
      <div className="orb-glow absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-plum/12 rounded-full blur-3xl" />
      <div className="orb-glow absolute top-1/3 right-[10%] w-[350px] h-[350px] bg-teal/10 rounded-full blur-3xl" />
      <div className="orb-glow absolute bottom-[20%] left-[5%] w-[300px] h-[300px] bg-berry/8 rounded-full blur-3xl" />
      <div className="absolute top-[12%] left-[8%] w-3 h-3 rounded-full bg-gold/50 animate-float shadow-clay-sm" />
      <div className="absolute top-[28%] right-[12%] w-4 h-4 rounded-full bg-plum/40 animate-float-slow" />
      <div className="absolute top-[45%] left-[15%] w-3 h-3 rounded-full bg-accent/40 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-[35%] right-[20%] w-4 h-4 rounded-full bg-teal/35 animate-float-slow" style={{ animationDelay: "2s" }} />
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
            <span className="text-sm text-ink-muted font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO SECTION
   ══════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animations
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" }
      );
    }
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      <BackgroundOrbs />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8" style={{ animation: "float 7s ease-in-out infinite" }}>
          <Star className="size-3.5 text-gold-deep fill-gold-deep" />
          <span className="text-xs font-semibold text-ink-muted">Trusted by 10,000+ aspirants across India</span>
        </div>

        {/* Main Heading */}
        <div ref={titleRef} className="mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>
            Study Smarter,{" "}
            <span className="text-gradient-gold">Not Harder</span>
          </h1>
        </div>

        {/* Subheading */}
        <div ref={subtitleRef}>
          <p className="text-lg md:text-xl text-ink-muted max-w-2xl mx-auto mb-12 leading-relaxed" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            The all-in-one study community for JEE, NEET, and board exam aspirants.
            Track progress, join live rooms, and achieve your dream rank — together.
          </p>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/register">
            <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black shadow-clay-lg glow-gold inline-flex items-center gap-2 transition-all duration-200 hover:scale-105">
              Start Free Trial
              <ArrowRight className="size-5" />
            </span>
          </Link>
          <Link href="/tour">
            <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold inline-flex items-center gap-2 transition-all duration-200 hover:scale-105">
              <Play className="size-4" />
              Watch Demo
            </span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "10K+", label: "Active Students" },
            { value: "500K+", label: "Study Hours" },
            { value: "94%", label: "Success Rate" },
            { value: "150+", label: "Mentors" },
          ].map((stat) => (
            <div key={stat.label} className="clay-card-night flex flex-col items-center gap-2 p-5">
              <span className="text-2xl md:text-3xl font-black text-gold" style={{ fontFamily: "var(--font-fraunces)" }}>{stat.value}</span>
              <span className="text-xs text-white/60 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="size-8 text-ink-muted" />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEATURES SECTION
   ══════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: <Clock className="size-5" />, title: "Smart Study Timer", desc: "Pomodoro-style timer with room selection, session notes, and auto-tracking.", color: "accent" },
  { icon: <BarChart3 className="size-5" />, title: "Analytics Dashboard", desc: "Daily, weekly & monthly trends at a glance. See streaks and patterns.", color: "gold" },
  { icon: <Users className="size-5" />, title: "Live Study Rooms", desc: "Join scheduled group sessions with peers prepping for the same exam.", color: "plum" },
  { icon: <Shield className="size-5" />, title: "Password Security", desc: "Instant login with scrypt-hashed passwords — no more OTP waiting.", color: "teal" },
  { icon: <Star className="size-5" />, title: "Challenge System", desc: "7-day consistency challenges, streak rewards, and friendly competition.", color: "berry" },
  { icon: <BookOpen className="size-5" />, title: "Mentor Sessions", desc: "Learn from successful IIT / AIIMS aspirants through live Q&A.", color: "accent" },
];

function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".feature-card");
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 bg-raised">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-3 block">Everything you need</span>
          <h2 className="text-3xl md:text-5xl font-black text-ink mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>Powerful Features</h2>
          <p className="text-ink-muted max-w-xl mx-auto">Designed to keep you focused, track your growth, and connect you with the community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const iconBgs: Record<string, string> = {
              accent: "bg-accent-light text-accent",
              gold: "bg-gold-light text-gold-deep",
              plum: "bg-purple-100 text-plum",
              teal: "bg-teal/15 text-teal",
              berry: "bg-pink-100 text-berry",
            };
            return (
              <div key={f.title} className={`feature-card clay-card flex flex-col gap-4 p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-clay`}>
                <div className={`clay-icon size-12 ${iconBgs[f.color]}`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOW IT WORKS SECTION
   ══════════════════════════════════════════════════════════════════ */
const STEPS = [
  { num: "1", title: "Create Account", desc: "Sign up in 30 seconds with email and password — instant access." },
  { num: "2", title: "Set Your Goals", desc: "Pick your exam, class, and daily study target." },
  { num: "3", title: "Start Studying", desc: "Use timers, join rooms, track streaks, and climb the leaderboard." },
];

function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".step-card");
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, x: index % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-accent mb-3 block">Simple process</span>
          <h2 className="text-3xl md:text-5xl font-black text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.num} className="step-card clay-card p-8 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full clay-icon-gold text-xl font-black flex items-center justify-center">{s.num}</div>
              <h3 className="text-xl font-bold text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{s.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
   ══════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { quote: "PrepArea helped me stay consistent for the first time. Went from 2 hrs/day to 8 hrs/day over 3 months.", name: "Aarav P.", exam: "JEE Advanced" },
  { quote: "The study rooms made me feel less alone. Studying alongside 20 other NEET aspirants kept me focused.", name: "Priya S.", exam: "NEET" },
  { quote: "Analytics showed me my weak patterns — I fixed them before the boards and scored 96%.", name: "Rohan M.", exam: "Class 12 Boards" },
];

function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".testimonial-card");
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 bg-night text-white overflow-hidden">
      <div className="absolute inset-0 stars opacity-50" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-gold mb-3 block">What they say</span>
          <h2 className="text-3xl md:text-5xl font-black" style={{ fontFamily: "var(--font-fraunces)" }}>Loved by Aspirants</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="testimonial-card clay-card-deep p-8 flex flex-col gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="size-4 text-gold fill-gold" />)}
              </div>
              <p className="text-ink leading-relaxed italic">"{t.quote}"</p>
              <div>
                <p className="font-bold text-ink text-sm">{t.name}</p>
                <p className="text-xs text-ink-muted">{t.exam}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   CTA SECTION
   ══════════════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } }
    );
  }, []);

  return (
    <section className="relative py-28 px-4">
      <div ref={ref} className="mx-auto max-w-3xl">
        <div className="clay-card-deep p-12 md:p-16 relative overflow-hidden">
          <div className="orb-glow absolute -top-16 -right-16 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="orb-glow absolute -bottom-16 -left-16 w-64 h-64 bg-plum/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-ink mb-6 leading-tight" style={{ fontFamily: "var(--font-fraunces)" }}>
              Ready to Transform<br />Your{" "}
              <span className="text-gradient-gold">Preparation?</span>
            </h2>
            <p className="text-ink-muted text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "var(--font-outfit)" }}>
              Join thousands of aspirants who are already achieving their dreams with PrepArea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black inline-flex items-center gap-2 transition-all duration-200 hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="size-5" />
                </span>
              </Link>
              <Link href="/login">
                <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold transition-all duration-200 hover:scale-105">Login</span>
              </Link>
            </div>
            <p className="text-xs text-ink-faint mt-8">No credit card required · Cancel anytime · Free 7-day trial</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE EXPORT
   ══════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <main className="relative min-h-screen bg-paper overflow-x-hidden">
      <BackgroundOrbs />
      <TrustBar />
      <HeroSection />
      <div className="dotted-light h-px w-full max-w-4xl mx-auto" aria-hidden="true" />
      <FeaturesSection />
      <HowItWorksSection />
      <div className="dotted-light h-px w-full max-w-4xl mx-auto" aria-hidden="true" />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
