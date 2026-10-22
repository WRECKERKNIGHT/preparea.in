"use client";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  LineChart,
  Mic,
  MessagesSquare,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Video,
  Star,
  Zap,
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

const features = [
  {
    icon: Users,
    title: "Virtual Study Rooms",
    body: "Four scheduled focus sessions a day — Morning, Afternoon, Evening and Night Focus — on Zoom. Founders study alongside you, so the room is never empty.",
    accent: "from-accent-light to-accent",
    gradient: "from-accent/10 to-transparent",
  },
  {
    icon: Target,
    title: "Daily Targets",
    body: "Set one number each morning: how many hours you'll study today. Stated simply, tracked simply.",
    accent: "from-gold-light to-gold",
    gradient: "from-gold/10 to-transparent",
  },
  {
    icon: Clock,
    title: "Study-Time Tracking",
    body: "Log your time in the app or track live with a built-in timer. Progress is personal — we never rank you against others.",
    accent: "from-teal-soft to-teal",
    gradient: "from-teal/10 to-transparent",
  },
  {
    icon: CalendarCheck,
    title: "Consistency Challenges",
    body: "Start with the 7-Day Challenge: set, study, check in. Then 14-day, 30-day and 100-hour editions.",
    accent: "from-plum-soft to-plum",
    gradient: "from-plum/10 to-transparent",
  },
  {
    icon: LineChart,
    title: "Personal Progress",
    body: "A clean weekly view of the minutes you studied, your streak, and whether you hit today's target.",
    accent: "from-accent-light to-accent",
    gradient: "from-accent/10 to-transparent",
  },
  {
    icon: MessagesSquare,
    title: "Community",
    body: "Discord for conversation and subject channels; Telegram for announcements and reminders. Clear rules from day one.",
    accent: "from-teal-soft to-teal",
    gradient: "from-teal/10 to-transparent",
  },
  {
    icon: Mic,
    title: "Mentor Sessions",
    body: "Experienced aspirants share how they planned, what they'd do differently, and how they stayed consistent. Experience, never promises.",
    accent: "from-plum-soft to-plum",
    gradient: "from-plum/10 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "A Safe Environment",
    body: "Strict moderation, privacy-focused by design, and no guaranteed-rank or guaranteed-selection claims allowed.",
    accent: "from-gold-light to-gold",
    gradient: "from-gold/10 to-transparent",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      }
    );
  }, [index]);

  return (
    <div
      ref={ref}
      className="clay-card-deep h-full p-7 group transition-all duration-300 hover:-translate-y-2 hover:shadow-clay-lg"
    >
      <div className={`clay-icon size-12 rounded-[18px] bg-gradient-to-br ${feature.accent} text-white`}>
        <feature.icon className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-black text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>
        {feature.title}
      </h2>
      <T className="mt-2 text-sm text-ink-muted leading-relaxed">{feature.body}</T>
      <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
    </div>
  );
}

export default function FeaturesPage() {
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!featuresRef.current) return;
    const cards = featuresRef.current.querySelectorAll(".feature-card");
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        }
      );
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb-glow absolute -top-32 -left-32 w-[600px] h-[600px] bg-gold/15 rounded-full blur-3xl" />
          <div className="orb-glow absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-plum/12 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8 animate-float">
            <Zap className="size-4 text-gold-deep fill-gold-deep" />
            <span className="text-xs font-semibold text-ink-muted">Everything you need</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Everything PrepArea{" "}
            <span className="text-gradient-gold">Includes</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            PrepArea isn't teaching, coaching or test series. It's the focused environment your material is missing.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className="relative py-16 px-4 bg-raised">
        <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={feature.title} className="feature-card relative">
              <FeatureCard feature={feature} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="clay-card-deep p-12 md:p-16 relative overflow-hidden">
            <div className="orb-glow absolute -top-16 -right-16 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
            <div className="orb-glow absolute -bottom-16 -left-16 w-64 h-64 bg-plum/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <TSerif className="text-3xl md:text-5xl font-black text-ink mb-6">
                Ready to{" "}
                <span className="text-gradient-gold">Get Started?</span>
              </TSerif>
              <T className="text-ink-muted text-lg mb-10 max-w-xl mx-auto">
                Join thousands of aspirants who are already achieving their dreams with PrepArea.
              </T>
              <Magnetic strength={0.2}>
                <Link href="/register">
                  <span className="clay-btn clay-btn-gold px-10 py-5 text-base font-black inline-flex items-center gap-2 shadow-clay-lg glow-gold hover:scale-105 transition-transform duration-200">
                    Start Free Trial
                    <ArrowRight className="size-5" />
                  </span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
