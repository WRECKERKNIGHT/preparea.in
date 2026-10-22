"use client";
import {
  CalendarCheck,
  Clock,
  LineChart,
  MessagesSquare,
  Mic,
  NotebookPen,
  ShieldCheck,
  Target,
  Users,
  Video,
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

const topics = [
  "How I planned my preparation for the full year",
  "Mistakes I made so you don't have to",
  "Managing school, coaching and self-study together",
  "A revision strategy that actually sticks",
  "Staying consistent for months, not days",
  "What exam day actually feels like",
];

const principles = [
  "Mentors share their own experience — they don't teach curriculum.",
  "No guaranteed ranks, selections or scores, ever.",
  "Mentors are verified by PrepArea before hosting a session.",
  "Sessions are structured: talk, then Q&A.",
  "All sessions are recorded and available for members.",
  "You can ask anonymous questions during Q&A.",
];

const mentorStats = [
  { value: "150+", label: "Verified Mentors" },
  { value: "500+", label: "Sessions Hosted" },
  { value: "10K+", label: "Students Helped" },
  { value: "94%", label: "Satisfaction Rate" },
];

export default function MentorsPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLUListElement>(null);
  const principlesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );
    }

    // Topics animation
    if (topicsRef.current) {
      gsap.fromTo(topicsRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: topicsRef.current, start: "top 85%" },
        }
      );
    }

    // Principles animation
    if (principlesRef.current) {
      gsap.fromTo(principlesRef.current.children,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: principlesRef.current, start: "top 85%" },
        }
      );
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb-glow absolute -top-32 -left-32 w-[600px] h-[600px] bg-plum/15 rounded-full blur-3xl" />
          <div className="orb-glow absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="clay-chip inline-flex items-center gap-2 px-5 py-2 mb-8 animate-float">
            <Video className="size-4 text-plum" />
            <span className="text-xs font-semibold text-ink-muted">Live Sessions Every Week</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Learn from Those Who{" "}
            <span className="text-gradient-gold">Done It</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            Practical guidance from experienced aspirants — for students, delivered honestly. No fluff, no promises, just real advice.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-12 px-4 bg-raised">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6">
          {mentorStats.map((stat) => (
            <div key={stat.label} className="text-center p-4">
              <TSerif className="text-3xl md:text-4xl font-black text-plum">{stat.value}</TSerif>
              <T className="text-sm text-ink-muted mt-1">{stat.label}</T>
            </div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            Example Session Topics
          </h2>

          <ul ref={topicsRef} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, i) => (
              <li
                key={topic}
                className="clay-card flex items-center gap-3 px-6 py-5 hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
              >
                <span className="clay-icon size-9 shrink-0 rounded-xl bg-gradient-to-br from-plum-soft to-plum text-white">
                  <Mic className="size-4" aria-hidden="true" />
                </span>
                <span className="font-display text-base font-bold text-ink">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-raised">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            How Mentor Sessions Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "Scheduled Live Sessions",
                body: "30–45 minutes including Q&A. Announced weekly on Telegram with Zoom links.",
                accent: "from-plum-soft to-plum",
              },
              {
                icon: ShieldCheck,
                title: "Verified Mentors Only",
                body: "Every mentor is vetted. No inflated claims, no false promises — just experience.",
                accent: "from-accent-light to-accent",
              },
              {
                icon: NotebookPen,
                title: "Experience Over Expertise",
                body: "Mentors share what worked for them. They aren't standing in for teachers.",
                accent: "from-gold-light to-gold",
              },
            ].map(({ icon: Icon, title, body, accent }, i) => (
              <div key={title} className="clay-card-deep p-7">
                <span className={`clay-icon size-12 rounded-[18px] bg-gradient-to-br ${accent} text-white`}>
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-black text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>{title}</h3>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            What Mentors Commit to
          </h2>

          <ul ref={principlesRef} className="space-y-4">
            {principles.map((p) => (
              <li key={p} className="clay-card flex items-start gap-3 px-6 py-4">
                <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-gold-deep" />
                <span className="text-sm text-ink leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="clay-card-deep p-12 relative overflow-hidden">
            <div className="orb-glow absolute -top-16 -right-16 w-64 h-64 bg-plum/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-ink mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>
                Want to Become a Mentor?
              </h2>
              <T className="text-ink-muted mb-8">
                Share your journey and help someone else navigate theirs.
              </T>
              <Magnetic strength={0.2}>
                <Link href="/register">
                  <span className="clay-btn clay-btn-gold px-8 py-4 text-base font-black inline-flex items-center gap-2 shadow-clay-lg glow-gold hover:scale-105 transition-transform duration-200">
                    Join as a Mentor
                    <Users className="size-5" />
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
