"use client";
import {
  Video,
  Clock,
  TrendingUp,
  Users,
  Star,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  BarChart3,
  MessageCircle,
  Award,
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

export default function TourPage() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            <span className="text-xs font-semibold text-ink-muted">How PrepArea Works</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Your <span className="text-gradient-gold">Complete Guide</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            Learn how to use PrepArea effectively to boost your exam preparation. Step-by-step guide from signup to success.
          </p>
        </div>
      </section>

      {/* Step-by-Step Tutorial */}
      <section ref={stepsRef} className="py-16 px-4 bg-raised">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {[
              {
                step: "Step 1",
                icon: Users,
                title: "Create Your Account",
                desc: "Sign up with your email and create a secure password. Choose your class (9-12 or Dropper) and the exam you're preparing for (JEE, NEET, CUET, or Boards). This takes less than 2 minutes.",
                color: "accent",
                detail: "You'll get instant access to all community features during your 7-day free trial.",
              },
              {
                step: "Step 2",
                icon: Clock,
                title: "Set Your Daily Target",
                desc: "Each morning, tell us how many hours you plan to study. We'll track your progress and send reminders when you check in during the day.",
                color: "gold",
                detail: "Start with a realistic target — consistency matters more than intensity.",
              },
              {
                step: "Step 3",
                icon: Video,
                title: "Join a Live Study Room",
                desc: "Click into any of our four scheduled focus sessions: Morning Focus (6-9 AM), Afternoon Grind (12-3 PM), Evening Session (5-8 PM), or Night Owl (9 PM-12 AM). Just show up and study alongside others on Zoom.",
                color: "plum",
                detail: "The rooms are monitored but not distracting — it's your space to focus with others.",
              },
              {
                step: "Step 4",
                icon: BarChart3,
                title: "Track Your Progress",
                desc: "Visit your dashboard to see your streaks, weekly totals, and consistency graph. The analytics show you patterns you might miss — like which days you're weakest.",
                color: "teal",
                detail: "We never rank you against others. Your progress is personal.",
              },
              {
                step: "Step 5",
                icon: MessageCircle,
                title: "Join the Community",
                desc: "Connect with fellow aspirants on Discord (subject channels, accountability partners) and Telegram (announcements, daily reminders). Find your study squad.",
                color: "berry",
                detail: "The community is moderated and safe — no toxic competition, just support.",
              },
              {
                step: "Step 6",
                icon: Award,
                title: "Attend Mentor Sessions",
                desc: "Every week, top aspirants host live Q&A sessions. Learn their strategies, ask about their struggles, and get honest advice that works for real exams.",
                color: "accent",
                detail: "Mentors share experience, not curriculum. They've been where you are.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="tour-step clay-card-deep p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-clay-lg"
              >
                <div className="flex items-start gap-4">
                  <div className={`clay-icon size-14 rounded-2xl bg-gradient-to-br ${
                    item.color === "accent" ? "from-accent-light to-accent" :
                    item.color === "gold" ? "from-gold-light to-gold" :
                    item.color === "plum" ? "from-plum-soft to-plum" :
                    item.color === "teal" ? "from-teal-soft to-teal" :
                    "from-berry to-pink-500"
                  } text-white shrink-0`}>
                    <item.icon className="size-7" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-black uppercase tracking-widest text-accent mb-2 block">
                      {item.step}
                    </span>
                    <h2 className="text-2xl font-black text-ink mb-3" style={{ fontFamily: "var(--font-fraunces)" }}>
                      {item.title}
                    </h2>
                    <T className="text-ink-muted leading-relaxed mb-3">{item.desc}</T>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold-deep text-sm font-medium">
                      <Play className="size-3 fill-gold-deep" />
                      {item.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section ref={featuresRef} className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            Everything Included in Your Trial
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { text: "Free 7-day trial", icon: CheckCircle2 },
              { text: "No credit card needed", icon: CheckCircle2 },
              { text: "4 daily study rooms", icon: CheckCircle2 },
              { text: "Progress analytics", icon: CheckCircle2 },
              { text: "Community access", icon: CheckCircle2 },
              { text: "Weekly mentor sessions", icon: CheckCircle2 },
            ].map((feature) => (
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
                Ready to <span className="text-gradient-gold">Start?</span>
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
                    <span className="clay-btn clay-btn-outline px-10 py-5 text-base font-bold">Sign In</span>
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
