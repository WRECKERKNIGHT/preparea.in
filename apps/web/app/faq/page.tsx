"use client";
import { CheckCircle2, Clock, Users, Video, Star, Shield, Zap, MessageSquare } from "lucide-react";
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

const faqs = [
  {
    icon: Shield,
    q: "Is this a coaching or teaching platform?",
    a: "No. PrepArea is a study community. It doesn't replace teachers, coaching, textbooks or test series — it gives you the consistent, focused environment to actually study.",
    color: "accent",
  },
  {
    icon: Users,
    q: "Who is it for?",
    a: "Competitive-exam aspirants — primarily JEE, NEET, CUET and board students, roughly classes 9–12 and droppers.",
    color: "gold",
  },
  {
    icon: Zap,
    q: "What do I need to start?",
    a: "A device with Zoom (or a browser), Telegram and Discord for the community. Your study material stays where it is.",
    color: "plum",
  },
  {
    icon: Clock,
    q: "How does the 7-Day Challenge work?",
    a: "Set a daily target each morning, study during the day, check in each evening. Miss a day? No shame — tomorrow counts. It's about consistency, not comparison.",
    color: "teal",
  },
  {
    icon: Video,
    q: "What tools do you use?",
    a: "For the MVP: Google Forms and Sheets, Discord, Telegram, Zoom and YPT-style tracking. No custom app is required to start.",
    color: "berry",
  },
  {
    icon: Star,
    q: "Is study-time tracking competitive?",
    a: "No. Progress is personal. We deliberately avoid leaderboards and unhealthy study-hour comparisons.",
    color: "accent",
  },
  {
    icon: Shield,
    q: "Is my information safe?",
    a: "We collect only what's needed to run the community, don't publish member details publicly, and enforce strict privacy and moderation rules.",
    color: "gold",
  },
  {
    icon: CheckCircle2,
    q: "Is it free?",
    a: "Everyone gets a 7-day free trial — no card needed. The first cohort and 7-Day Challenge start inside it. After the trial, the community stays affordable, and selected premium features may be tested as a paid membership.",
    color: "plum",
  },
  {
    icon: MessageSquare,
    q: "Will there be a proper app?",
    a: "The MVP deliberately uses existing tools. A dedicated app is on the roadmap — only after the community proves it works.",
    color: "teal",
  },
];

const quickLinks = [
  { text: "Start Free Trial", href: "/register", icon: CheckCircle2 },
  { text: "Join Discord", href: "https://discord.gg/preparea", icon: MessageSquare },
  { text: "View Features", href: "/features", icon: Zap },
];

export default function FaqPage() {
  const faqsRef = useRef<HTMLDivElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (faqsRef.current) {
      const items = faqsRef.current.querySelectorAll(".faq-item");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 90%" },
          }
        );
      });
    }

    if (quickLinksRef.current) {
      const links = quickLinksRef.current.querySelectorAll(".quick-link");
      gsap.fromTo(
        links,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
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
            <MessageSquare className="size-4 text-plum" />
            <span className="text-xs font-semibold text-ink-muted">Got Questions?</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Frequently Asked{" "}
            <span className="text-gradient-gold">Questions</span>
          </h1>

          <p className="text-lg text-ink-muted max-w-2xl mx-auto" style={{ fontFamily: "var(--font-outfit)", fontWeight: 300 }}>
            Everything you need to know about PrepArea. Can't find what you're looking for? Join our community and ask directly.
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section ref={faqsRef} className="py-16 px-4 bg-raised">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="faq-item clay-card-deep overflow-hidden"
              >
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-4 px-7 py-5">
                    <span className={`clay-icon size-10 shrink-0 rounded-xl bg-gradient-to-br ${
                      faq.color === "accent" ? "from-accent-light to-accent" :
                      faq.color === "gold" ? "from-gold-light to-gold" :
                      faq.color === "plum" ? "from-plum-soft to-plum" :
                      faq.color === "teal" ? "from-teal-soft to-teal" :
                      "from-pink-100 to-berry"
                    } text-white`}>
                      <faq.icon className="size-5" />
                    </span>
                    <div className="flex-1">
                      <h2 className="font-display text-lg font-bold text-ink">
                        {faq.q}
                      </h2>
                    </div>
                    <span className="clay-icon size-8 shrink-0 rounded-full bg-gradient-to-br from-gold-light to-gold text-gold-deep transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="px-7 pb-6 pl-20">
                    <T className="text-ink-muted leading-relaxed">{faq.a}</T>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section ref={quickLinksRef} className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-10 text-center" style={{ fontFamily: "var(--font-fraunces)" }}>
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <div
                key={link.text}
                className="quick-link clay-card p-6 text-center hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <link.icon className="size-8 text-accent mx-auto mb-4" />
                <Link href={link.href} className="text-lg font-bold text-ink hover:text-accent transition-colors">
                  {link.text}
                </Link>
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
              <TSerif className="text-3xl md:text-4xl font-black text-ink mb-4">
                Still Have Questions?
              </TSerif>
              <T className="text-ink-muted mb-8">
                Join our community and ask us directly. We're here to help.
              </T>
              <Magnetic strength={0.2}>
                <Link href="/register">
                  <span className="clay-btn clay-btn-gold px-8 py-4 text-base font-black inline-flex items-center gap-2 shadow-clay-lg glow-gold hover:scale-105 transition-transform duration-200">
                    Join PrepArea
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
