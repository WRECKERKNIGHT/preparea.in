import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Video,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { TSerif } from "@/components/ui/text-serif";
import { T } from "@/components/ui/text";
import { Magnetic } from "@/components/fx/magnetic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const metadata: Metadata = {
  title: "Tour — PrepArea",
  description: "Take a guided tour of PrepArea.",
};

const tourSteps = [
  {
    icon: Video,
    title: "Join a Study Room",
    desc: "Click into any live Zoom room — Morning Focus, Afternoon Grind, Evening Session, or Night Owl. Just show up and study alongside others.",
    color: "accent",
  },
  {
    icon: Clock,
    title: "Set Your Daily Target",
    desc: "Each morning, tell us how many hours you plan to study. Your timer starts when you begin, stops when you pause.",
    color: "gold",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    desc: "See your streaks, weekly totals, and consistency graph. No judging — just honest numbers you can act on.",
    color: "plum",
  },
  {
    icon: Users,
    title: "Join the Community",
    desc: "Hop into Discord channels for your exam group. Find accountability partners, share resources, and celebrate wins together.",
    color: "teal",
  },
  {
    icon: Star,
    title: "Take on Challenges",
    desc: "Start with the 7-Day Challenge. Build streaks, earn badges, and prove to yourself that consistency is a skill you can develop.",
    color: "berry",
  },
  {
    icon: Zap,
    title: "Attend Mentor Sessions",
    desc: "Every week, top aspirants host live Q&A sessions. Learn their strategies, ask about their struggles, and get honest advice.",
    color: "accent",
  },
];

const features = [
  { text: "Free 7-day trial", icon: CheckCircle2 },
  { text: "No credit card required", icon: CheckCircle2 },
  { text: "Cancel anytime", icon: CheckCircle2 },
  { text: "Mobile-friendly", icon: CheckCircle2 },
  { text: "Private & secure", icon: CheckCircle2 },
  { text: "Active community", icon: CheckCircle2 },
];

export default function TourPage() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate tour steps
    if (stepsRef.current) {
      const cards = stepsRef.current.querySelectorAll(".tour-step");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          }
        );
      });
    }

    // Animate features
    if (featuresRef.current) {
      const items = featuresRef.current.querySelectorAll(".feature-item");
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb-glow absolute -top-32 -left-32 w-[600px] h-[600px] bg-gold/15 rounded-full blur-3xl" />
          <div className="orb-glow absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-plum/12 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8 animate-float">
            <Video className="size-4 text-gold-deep fill-gold-deep" />
            <span className="text-xs font-semibold text-ink-muted">Quick Start Guide</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Take a <span className="text-gradient-gold">Tour</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            See how PrepArea works in 6 simple steps. From signing up to acing your exams — we've got you covered.
          </p>
        </div>
      </section>

      {/* Tour Steps */}
      <section ref={stepsRef} className="py-16 px-4 bg-raised">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourSteps.map((step, i) => (
              <div
                key={step.title}
                className={`tour-step clay-card-deep p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-clay-lg`}
              >
                <div className={`clay-icon size-14 rounded-2xl bg-gradient-to-br ${
                  step.color === "accent" ? "from-accent-light to-accent" :
                  step.color === "gold" ? "from-gold-light to-gold" :
                  step.color === "plum" ? "from-plum-soft to-plum" :
                  step.color === "teal" ? "from-teal-soft to-teal" :
                  "from-berry to-pink-500"
                } text-white`}>
                  <step.icon className="size-7" />
                </div>
                <h2 className="mt-4 text-xl font-black text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>
                  {step.title}
                </h2>
                <T className="mt-2 text-sm text-ink-muted leading-relaxed">{step.desc}</T>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent">
                  <span>Step {i + 1}</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            Everything Included
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.text}
                className="feature-item clay-card flex items-center gap-3 px-5 py-4"
              >
                <feature.icon className="size-5 text-accent shrink-0" />
                <T className="text-sm text-ink font-medium">{feature.text}</T>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="clay-card-deep p-12 relative overflow-hidden">
            <div className="orb-glow absolute -top-16 -right-16 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
            <div className="orb-glow absolute -bottom-16 -left-16 w-64 h-64 bg-plum/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <TSerif className="text-3xl md:text-5xl font-black text-ink mb-6">
                Ready to{" "}
                <span className="text-gradient-gold">Start?</span>
              </TSerif>
              <T className="text-ink-muted text-lg mb-10 max-w-xl mx-auto">
                Join thousands of aspirants achieving their dreams with PrepArea.
              </T>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.2}>
                  <Link href="/register">
                    <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black inline-flex items-center gap-2 shadow-clay-lg glow-gold hover:scale-105 transition-transform duration-200">
                      Start Free Trial
                      <ArrowRight className="size-5" />
                    </span>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link href="/login">
                    <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold">Login</span>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
