"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  LoaderCircle,
  LogOut,
  Mic,
  Send,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import type { DashboardMe, Student } from "@preparea/shared";

// ---------------------------------------------------------------------------

function fmtH(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

const TOKEN_KEY = "pa_token";

function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  const headers: Record<string, string> = {
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init?.body) headers["Content-Type"] = "application/json";
  return fetch(path, { ...init, headers, credentials: "same-origin" });
}

const hon = () =>
  ["Good morning", "Good afternoon", "Good evening"][
    Math.min(2, Math.floor(new Date().getHours() / 6))
  ];

// ---------------------------------------------------------------------------

export function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<DashboardMe | null>(null);

  const reload = useCallback(async () => {
    const res = await apiFetch("/api/me");
    if (res.status === 401) {
      setMe(null);
      setLoading(false);
      return;
    }
    const json = await res.json();
    if (json.ok) setMe(json.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await apiFetch("/api/me");
      if (cancelled) return;
      if (res.status === 401) {
        setMe(null);
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (json.ok) setMe(json.data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-ink-faint">
        <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!me) return <LoginGate onLoggedIn={reload} />;

  return <AuthenticatedView me={me} onUpdate={reload} />;
}

// ---------------------------------------------------------------------------

function LoginGate({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Could not send the code.");
        return;
      }
      setDevCode(json.data?.devCode);
      setStep("code");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Invalid code.");
        return;
      }
      if (json.data?.token) {
        window.localStorage.setItem(TOKEN_KEY, json.data.token);
      }
      onLoggedIn();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Member dashboard
        </p>
        <h1 className="mt-3 font-serif text-3xl font-medium text-ink">
          {step === "email" ? "Log in with your email" : "Enter the code"}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {step === "email"
            ? "We send a 6-digit code. No passwords to remember."
            : `We emailed a code to ${email}. It expires in 10 minutes.`}
        </p>
        {devCode && step === "code" ? (
          <p className="mt-3 rounded-[6px] border border-edge bg-raised px-4 py-2 text-sm">
            Dev code: <span className="font-bold text-accent">{devCode}</span>
          </p>
        ) : null}
      </div>

      <div className="card mt-8 p-6">
        {step === "email" ? (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="label">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                "Send code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <div>
              <label htmlFor="code" className="label">
                6-digit code
              </label>
              <input
                id="code"
                className="input number text-center text-xl tracking-[0.5em]"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                "Verify & open dashboard"
              )}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-center text-sm text-ink-faint hover:text-ink"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-ink-faint">
        New here?{" "}
        <a
          href="/register"
          className="font-semibold text-accent hover:text-accent-hover"
        >
          Join the community instead
        </a>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function AuthenticatedView({
  me,
  onUpdate,
}: {
  me: DashboardMe;
  onUpdate: () => void;
}) {
  const student: Student = me.student;
  const [logoutBusy, setLogoutBusy] = useState(false);

  async function logout() {
    setLogoutBusy(true);
    await apiFetch("/api/auth/logout", { method: "POST" });
    window.localStorage.removeItem(TOKEN_KEY);
    onUpdate();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-faint">{hon()},</p>
          <h1 className="font-display text-4xl font-black tracking-tight text-ink sm:text-5xl">
            {student.name}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {student.exam} · {student.klass === "Dropper" ? "Dropper" : `Class ${student.klass}`}
          </p>
        </div>
        <button
          onClick={logout}
          className="btn-ghost text-sm disabled:opacity-60"
          disabled={logoutBusy}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Log out
        </button>
      </div>

      {me.announcement ? (
        <div className="mt-6 flex items-center gap-3 rounded-[6px] border border-accent/25 bg-accent-light/50 px-4 py-3">
          <Send className="size-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm text-ink-muted">{me.announcement}</p>
        </div>
      ) : null}

      <TrialBanner trial={me.trial} />

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          icon={Target}
          label="Today's target"
          value={fmtH(me.todayTargetMin)}
        />
        <Stat
          icon={Timer}
          label="Studied today"
          value={fmtH(me.todayMinutes)}
          sub={me.lastCheckin ? `Checked in · ${me.lastCheckin.status}` : "Not checked in yet"}
        />
        <Stat icon={TrendingUp} label="This week" value={fmtH(me.weekMinutes)} />
        <Stat icon={Flame} label="Day streak" value={`${me.streakDays}${me.streakDays === 1 ? " day" : " days"}`} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-3">
          <WeeklyChart buckets={me.weekBuckets} />
          {me.activeChallenge ? (
            <ChallengeCard
              me={me}
              onUpdate={onUpdate}
            />
          ) : null}
          <CheckinCard key={me.lastCheckin?.id ?? "none"} me={me} onUpdate={onUpdate} />
        </div>

        <aside className="space-y-8 lg:col-span-2">
          <RoomsCard rooms={me.rooms} onUpdate={onUpdate} />
          <MentorsCard sessions={me.mentorSessions} />
          <CommunityCard />
        </aside>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function TrialBanner({ trial }: { trial: DashboardMe["trial"] }) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (trial.expired) return;
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, [trial.expired]);

  const endMs = new Date(trial.endsAt).getTime();
  const diff = Math.max(0, endMs - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (trial.expired) {
    return (
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-plum/25 bg-plum/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="clay-icon size-10 rounded-xl bg-gradient-to-br from-plum-light to-plum text-white">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-ink">
              Free trial over
            </p>
            <p className="text-sm text-ink-muted">
              Your 7-day trial ended. Join a new cohort to keep momentum going.
            </p>
          </div>
        </div>
        <a href="/register" className="btn-ghost text-sm">
          Start another week
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-raised to-plum/10 px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="clay-icon size-10 rounded-xl bg-gradient-to-br from-gold-light to-gold text-gold-deep">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-ink">
            {days > 0
              ? `${days} day${days === 1 ? "" : "s"} of your free trial left`
              : hours > 0
                ? `${hours} hour${hours === 1 ? "" : "s"} of your free trial left`
                : "Last day of your free trial"}
          </p>
          <p className="text-sm text-ink-muted">
            Everything on PrepArea is free for your first 7 days. No card needed.
          </p>
        </div>
      </div>
      <a href="/features" className="btn-gold text-sm">
        See what&rsquo;s included
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="clay-card-deep p-5">
      <span className="clay-icon size-10 rounded-xl bg-gradient-to-br from-accent-light to-accent text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-black text-ink number">{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-ink-faint">{sub}</p> : null}
    </div>
  );
}

function WeeklyChart({ buckets }: { buckets: DashboardMe["weekBuckets"] }) {
  const max = Math.max(60, ...buckets.map((b) => b.minutes));
  const todayIdx = buckets.length - 1;
  return (
    <section className="clay-card-deep p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Last 7 days</h2>
        <span className="text-xs font-semibold text-ink-faint">minutes studied</span>
      </div>
      <div className="mt-6 flex h-40 items-end justify-between gap-3">
        {buckets.map((b, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] font-medium text-ink-faint number">{b.minutes}</span>
            <div
              className={`w-full max-w-9 rounded-full ${i === todayIdx ? "bg-gradient-to-b from-accent to-accent-deep" : "bg-accent/30"}`}
              style={{ height: `${Math.max(4, (b.minutes / max) * 100)}%` }}
              role="img"
              aria-label={`${b.label}: ${b.minutes} minutes`}
            />
            <span
              className={`text-[11px] font-medium ${i === todayIdx ? "font-bold text-accent" : "text-ink-faint"}`}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChallengeCard({
  me,
  onUpdate,
}: {
  me: DashboardMe;
  onUpdate: () => void;
}) {
  const { activeChallenge: c, challengeProgress: p } = me;
  const [joining, setJoining] = useState(false);
  if (!c) return null;

  const challenge = c;

  const labels: Record<string, string> = {
    hit: "On target",
    partial: "Partial",
    miss: "Missed",
  };

  async function join() {
    setJoining(true);
    await apiFetch(`/api/challenges/${challenge.id}/join`, { method: "POST" });
    onUpdate();
    setJoining(false);
  }

  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <CalendarCheck className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-medium text-ink">{c.name}</h2>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm text-ink-muted">{c.rules}</p>

      {p.joined ? (
        <div className="mt-5">
          <div className="grid grid-cols-7 gap-2">
            {p.dayStatuses.map((status, i) => (
              <div
                key={i}
                title={status ? labels[status] : "Upcoming"}
                className={`flex aspect-square items-center justify-center rounded-[6px] text-xs font-semibold ${
                  status === "hit"
                    ? "bg-accent text-white"
                    : status === "partial"
                      ? "bg-accent-light text-accent"
                      : status === "miss"
                        ? "bg-error/10 text-error"
                        : "border border-edge text-ink-faint"
                }`}
              >
                {status === "hit" ? "✓" : status === "miss" ? "✕" : i + 1}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-faint">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px] bg-accent" /> On target
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px] bg-accent-light" /> Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-[2px] bg-error/40" /> Missed
            </span>
          </div>
        </div>
      ) : (
        <button onClick={join} disabled={joining} className="btn-primary mt-5 text-sm disabled:opacity-60">
          Join this challenge
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}

function CheckinCard({
  me,
  onUpdate,
}: {
  me: DashboardMe;
  onUpdate: () => void;
}) {
  const [target, setTarget] = useState(me.todayTargetMin);
  const [completed, setCompleted] = useState(me.todayMinutes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<boolean>(Boolean(me.lastCheckin));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await apiFetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedMin: completed, targetMin: target }),
    });
    setSaving(false);
    setSaved(true);
    onUpdate();
  }

  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-medium text-ink">
          {saved ? "Today's check-in" : "Evening check-in"}
        </h2>
      </div>

      {saved && me.lastCheckin ? (
        <div className="mt-4 rounded-[6px] border border-edge bg-paper px-4 py-3">
          <p className="text-sm text-ink-muted">
            Target{" "}
            <span className="font-semibold text-ink number">{fmtH(me.lastCheckin.targetMin)}</span>
            {" · "}completed{" "}
            <span className="font-semibold text-ink number">{fmtH(me.lastCheckin.completedMin)}</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            {me.lastCheckin.status === "hit"
              ? "You hit your target today. Nice."
              : me.lastCheckin.status === "partial"
                ? "Partial day. Every bit counts."
                : "Nothing logged yet — it's still the day."}
          </p>
          <button
            onClick={() => setSaved(false)}
            className="mt-2 text-xs font-semibold text-accent hover:text-accent-hover"
          >
            Update check-in
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tgt" className="label">
Today&rsquo;s target
              </label>
              <input
                id="tgt"
                type="number"
                min={15}
                max={720}
                step={15}
                className="input number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="cmp" className="label">
                Completed (minutes)
              </label>
              <input
                id="cmp"
                type="number"
                min={0}
                max={1440}
                step={5}
                className="input number"
                value={completed}
                onChange={(e) => setCompleted(Number(e.target.value))}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full justify-center text-sm disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              "Check in"
            )}
          </button>
        </form>
      )}
    </section>
  );
}

function RoomsCard({ rooms, onUpdate }: { rooms: DashboardMe["rooms"]; onUpdate: () => void }) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!activeRoom) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [activeRoom]);

  async function stop(roomId?: string) {
    const minutes = Math.max(1, Math.round(seconds / 60));
    if (minutes > 0) {
      await apiFetch("/api/study-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, roomId }),
      });
      onUpdate();
    }
    setActiveRoom(null);
    setSeconds(0);
  }

  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-medium text-ink">Study rooms</h2>
      </div>
      <div className="mt-4 divide-y divide-edge">
        {rooms.map((room) => (
          <div key={room.id} className="py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink">{room.name}</p>
                <p className="text-xs text-ink-faint">{room.day}</p>
              </div>
              {room.zoomLink ? (
                <a
                  href={room.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost px-3 py-1.5 text-xs"
                >
                  <Video className="size-3.5" aria-hidden="true" />
                  Join
                </a>
              ) : (
                <span className="text-xs text-ink-faint">Link at session time</span>
              )}
            </div>
            {activeRoom === room.id ? (
              <div className="mt-3 flex items-center justify-between rounded-[6px] border border-accent/30 bg-accent-light/50 px-3 py-2">
                <p className="text-sm font-semibold text-accent number">
                  {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
                </p>
                <button
                  onClick={() => stop(room.id)}
                  className="text-xs font-semibold text-accent-hover hover:underline"
                >
                  Stop & log
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveRoom(room.id)}
                className="mt-2 text-xs font-semibold text-accent hover:text-accent-hover"
              >
                <Timer className="mr-1 inline size-3.5" aria-hidden="true" />
                Study in this room
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function MentorsCard({ sessions }: { sessions: DashboardMe["mentorSessions"] }) {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <Mic className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-medium text-ink">Mentor sessions</h2>
      </div>
      <div className="mt-4 divide-y divide-edge">
        {sessions.length === 0 ? (
          <p className="py-3 text-sm text-ink-faint">No upcoming sessions yet.</p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="py-3">
              <p className="text-sm font-medium text-ink">{s.topic}</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {s.mentorName} · {s.date} at {s.time}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function CommunityCard() {
  return (
    <section className="card p-6">
      <div className="flex items-center gap-2">
        <Send className="size-5 text-accent" aria-hidden="true" />
        <h2 className="font-medium text-ink">Community</h2>
      </div>
      <div className="mt-4 space-y-2">
        <a
          href="https://t.me/preparea_announcements"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full justify-between text-sm"
        >
          Telegram announcements
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
        <a
          href="https://discord.gg/preparea"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost w-full justify-between text-sm"
        >
          Join Discord
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}