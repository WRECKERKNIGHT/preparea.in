"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import type { RegisterInput } from "@preparea/shared";

const CHALLENGES = [
  "Procrastination",
  "Distractions from phone",
  "Studying alone",
  "Losing track of time",
  "Skipping days",
  "No fixed routine",
  "Other",
];

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RegisterInput>({
    name: "",
    klass: "",
    exam: "",
    email: "",
    tgUsername: "",
    discordUsername: "",
    dailyTargetMin: 300,
    mainChallenge: "",
    source: "website",
  });

  const set = <K extends keyof RegisterInput>(key: K, value: RegisterInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-5">
      <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-raised to-plum/10 px-4 py-3">
        <span className="clay-icon size-9 shrink-0 rounded-xl bg-gradient-to-br from-gold-light to-gold text-gold-deep">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <p className="text-sm text-ink-muted">
          <span className="font-bold text-ink">7 days free</span> — join free,
          no card needed. Everything is open during your trial.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="label">
          Full name
        </label>
        <input
          id="name"
          className="input"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="class" className="label">
            Class
          </label>
          <select
            id="class"
            className="input"
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
            Preparing for
          </label>
          <select
            id="exam"
            className="input"
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

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          Used only for community invites and daily check-in reminders.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tg" className="label">
            Telegram username <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <input
            id="tg"
            className="input"
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
            className="input"
            placeholder="username"
            value={form.discordUsername ?? ""}
            onChange={(e) => set("discordUsername", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="target" className="label">
          Approximate daily study target
        </label>
        <div className="flex items-center gap-3">
          <input
            id="target"
            type="number"
            min={15}
            max={720}
            step={15}
            className="input number"
            value={form.dailyTargetMin}
            onChange={(e) => set("dailyTargetMin", Number(e.target.value))}
          />
          <span className="shrink-0 text-sm text-ink-muted">minutes / day</span>
        </div>
      </div>

      <div>
        <label htmlFor="challenge" className="label">
          Your biggest consistency challenge
        </label>
        <select
          id="challenge"
          className="input"
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

      {error ? (
        <p
          role="alert"
          className="rounded-[6px] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Registering…
          </>
        ) : (
          <>
            Register
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-ink-faint">
        By registering you agree to the community rules. We collect only what is
        needed to run the community.
      </p>
    </form>
  );
}