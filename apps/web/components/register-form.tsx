"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LoaderCircle,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Shield,
} from "lucide-react";

const CHALLENGES = [
  "Procrastination",
  "Distractions from phone",
  "Studying alone",
  "Losing track of time",
  "Skipping days",
  "No fixed routine",
  "Other",
];

interface FormData {
  name: string;
  klass: string;
  exam: string;
  email: string;
  password: string;
  confirmPassword: string;
  tgUsername: string;
  discordUsername: string;
  dailyTargetMin: number;
  mainChallenge: string;
  source: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: "",
    klass: "",
    exam: "",
    email: "",
    password: "",
    confirmPassword: "",
    tgUsername: "",
    discordUsername: "",
    dailyTargetMin: 300,
    mainChallenge: "",
    source: "website",
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length > 0 && form.exam && form.klass;
    if (step === 1) return form.email.includes("@") && form.password.length >= 8;
    return true;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.exam || !form.klass) {
      setError("Please fill in your name, class and exam.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("Password must contain at least one letter and one number.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.dailyTargetMin < 15 || form.dailyTargetMin > 720) {
      setError("Daily target should be between 15 minutes and 12 hours.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Something went wrong. Try again.");
        return;
      }
      router.push(`/register/success?joined=${encodeURIComponent(json.data.id)}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    { title: "Your Details", icon: Users, desc: "Tell us about yourself" },
    { title: "Create Account", icon: Shield, desc: "Set up your login" },
    { title: "Goals & Goals", icon: Clock, desc: "Set your targets" },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => i <= step && setStep(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              i <= step
                ? "bg-gradient-to-r from-accent to-teal text-white shadow-lg"
                : "bg-white/50 text-ink-faint hover:bg-white/80"
            }`}
          >
            <s.icon className="size-3.5" />
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="clay-card-deep p-5 bg-gradient-to-br from-gold/10 via-raised to-plum/10">
            <div className="flex items-center gap-3">
              <div className="clay-icon size-10 rounded-xl bg-gradient-to-br from-gold-light to-gold text-gold-deep">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="font-bold text-ink text-sm">7 days free trial</p>
                <p className="text-xs text-ink-muted">Join free, no card needed. Everything is open during your trial.</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="label">
              Full Name *
            </label>
            <input
              id="name"
              className="input mt-1"
              autoComplete="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="class" className="label">
                Class *
              </label>
              <select
                id="class"
                className="input mt-1"
                value={form.klass}
                onChange={(e) => set("klass", e.target.value)}
              >
                <option value="">Select class…</option>
                {["9", "10", "11", "12", "Dropper", "Other"].map((c) => (
                  <option key={c} value={c}>
                    {c === "Other" ? "Other" : `Class ${c}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="exam" className="label">
                Preparing for *
              </label>
              <select
                id="exam"
                className="input mt-1"
                value={form.exam}
                onChange={(e) => set("exam", e.target.value)}
              >
                <option value="">Select exam…</option>
                {["JEE", "NEET", "CUET", "Boards", "Other"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Account */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <label htmlFor="email" className="label">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className="input mt-1"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <p className="mt-1.5 text-xs text-ink-faint">
              Used for community invites and daily reminders.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password *
            </label>
            <input
              id="password"
              type="password"
              className="input mt-1"
              autoComplete="new-password"
              placeholder="Min. 8 characters, with letters and numbers"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input mt-1"
              autoComplete="new-password"
              placeholder="Type your password again"
              value={form.confirmPassword ?? ""}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 2: Goals */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tg" className="label">
                Telegram username <span className="font-normal text-ink-faint">(optional)</span>
              </label>
              <input
                id="tg"
                className="input mt-1"
                placeholder="@username"
                value={form.tgUsername ?? ""}
                onChange={(e) => set("tgUsername", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="discord" className="label">
                Discord username <span className="font-normal text-ink-faint">(optional)</span>
              </label>
              <input
                id="discord"
                className="input mt-1"
                placeholder="username"
                value={form.discordUsername ?? ""}
                onChange={(e) => set("discordUsername", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="target" className="label">
              Daily Study Target
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                id="target"
                type="number"
                min={15}
                max={720}
                step={15}
                className="input number w-32"
                value={form.dailyTargetMin}
                onChange={(e) => set("dailyTargetMin", Number(e.target.value))}
              />
              <span className="text-sm text-ink-muted">minutes / day</span>
            </div>
          </div>

          <div>
            <label htmlFor="challenge" className="label">
              Biggest Consistency Challenge
            </label>
            <select
              id="challenge"
              className="input mt-1"
              value={form.mainChallenge ?? ""}
              onChange={(e) => set("mainChallenge", e.target.value)}
            >
              <option value="">Select…</option>
              {CHALLENGES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-ghost flex-1 justify-center"
          >
            Back
          </button>
        )}
        {step < 2 ? (
          <button
            type="button"
            onClick={() => canAdvance() && setStep(step + 1)}
            disabled={!canAdvance()}
            className="btn-primary flex-1 justify-center gap-2 disabled:opacity-50"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Registering…
              </>
            ) : (
              <>
                Join PrepArea
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-ink-faint">
        By registering you agree to the community rules. We collect only what is
        needed to run the community.
      </p>
    </form>
  );
}
