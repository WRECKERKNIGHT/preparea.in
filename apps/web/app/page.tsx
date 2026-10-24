"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, Play, ChevronDown, CheckCircle2, Zap, Shield, Clock, Users, BookOpen, BarChart3, Target, CalendarCheck, TrendingUp, MessageSquare, Mic } from "lucide-react";

/* ══════════════════════════════════════════════════════════════════
   PREMIUM HERO SECTION — Mesh Gradient + Animated Orbs
   ══════════════════════════════════════════════════════════════════ */

function HeroOrbs() {
  return (
    <>
      {/* Primary purple orb */}
      <div
        className="orb orb-primary w-[800px] h-[800px] -top-40 -left-40 animate-float"
        aria-hidden="true"
      />

      {/* Secondary green orb */}
      <div
        className="orb orb-secondary w-[600px] h-[600px] top-20 right-0 animate-float"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* Accent blue orb */}
      <div
        className="orb w-[400px] h-[400px] bottom-20 left-1/4"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }}
        aria-hidden="true"
      />
    </>
  );
}

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };

    const createParticles = () => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      aria-hidden="true"
    />
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Animated Orbs */}
      <HeroOrbs />

      {/* Particle Canvas */}
      <HeroParticles />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-float">
            <Star className="size-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-300">
              Trusted by 10,000+ aspirants
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
            <span className="block text-white">Study Smarter,</span>
            <span className="gradient-text">Not Harder</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one study community for JEE, NEET, and board exam aspirants.
            Track progress, join live rooms, and achieve your dream rank — together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register">
              <button className="btn-premium btn-primary group">
                Start Free Trial
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/tour">
              <button className="btn-premium btn-secondary">
                <Play className="size-4 fill-current" />
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Active Students", icon: Users },
              { value: "500K+", label: "Study Hours", icon: Clock },
              { value: "94%", label: "Success Rate", icon: BarChart3 },
              { value: "150+", label: "Mentors", icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <stat.icon className="size-6 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="size-8 text-gray-500" />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FEATURES SECTION
   ══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    icon: Users,
    title: "Virtual Study Rooms",
    desc: "Four scheduled focus sessions daily — Morning, Afternoon, Evening, and Night. Study alongside peers in real-time.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Target,
    title: "Daily Targets",
    desc: "Set one number each morning: how many hours you'll study today. Track it simply, hit it consistently.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Clock,
    title: "Study-Time Tracking",
    desc: "Log your time in the app or track live with a built-in timer. Progress is personal — no leaderboards.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: CalendarCheck,
    title: "Consistency Challenges",
    desc: "Start with the 7-Day Challenge. Build streaks, earn badges, and prove consistency is a skill.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "Personal Progress",
    desc: "Clean weekly view of minutes studied, streaks, and whether you hit your daily target.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Community",
    desc: "Discord for conversation, Telegram for announcements. Clear rules from day one.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Mic,
    title: "Mentor Sessions",
    desc: "Experienced aspirants share their journey — strategies, mistakes, and how they stayed consistent.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    desc: "Strict moderation, privacy-focused, and no guaranteed-rank claims. Just real advice.",
    color: "from-blue-500 to-indigo-500",
  },
];

function FeaturesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Designed to keep you focused, track your growth, and connect you with the community.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={feature.title} className="glass-card p-8 group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="size-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOW IT WORKS SECTION
   ══════════════════════════════════════════════════════════════════ */

const STEPS = [
  { num: "1", title: "Create Account", desc: "Sign up in 30 seconds with email and password. Instant access." },
  { num: "2", title: "Set Your Goals", desc: "Pick your exam, class, and daily study target." },
  { num: "3", title: "Start Studying", desc: "Use timers, join rooms, track streaks, and climb." },
];

function HowItWorksSection() {
  return (
    <section className="relative py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {/* Number */}
              <div className="text-8xl font-black text-white/5 absolute -top-6 -left-4 select-none">
                {step.num}
              </div>

              {/* Content */}
              <div className="relative glass-card p-8 pt-12">
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent" />
              )}
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

function TestimonialsSection() {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-900/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
            What They Say
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Loved by <span className="gradient-text">Aspirants</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="glass-card p-8">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="size-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-sm text-gray-500">{t.exam}</p>
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
  return (
    <section className="relative py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-16 relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-emerald-500/20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Transform<br />
              <span className="gradient-text">Your Preparation?</span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
              Join thousands of aspirants who are already achieving their dreams with PrepArea.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button className="btn-premium btn-primary">
                  Start Free Trial
                  <ArrowRight className="size-5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-premium btn-secondary">
                  Login
                </button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              No credit card required · Cancel anytime · Free 7-day trial
            </p>
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
    <main className="relative min-h-screen bg-bg-black overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
