import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — PrepArea",
  description: "Log in to your PrepArea dashboard.",
};

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-paper">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-glow absolute -top-32 -left-32 w-[500px] h-[500px] bg-plum/10 rounded-full blur-3xl" />
        <div className="orb-glow absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 text-center">
            <a href="/" className="inline-block">
              <span className="text-3xl font-black text-ink" style={{ fontFamily: "var(--font-fraunces)" }}>
                Prep<span className="text-gradient-gold">Area</span>
              </span>
            </a>
            <p className="mt-3 text-sm text-ink-muted">Welcome back — log in to continue your journey</p>
          </div>

          {/* Login Form */}
          <div className="clay-card-deep p-8">
            <LoginForm />
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-ink-faint">
            New to PrepArea?{" "}
            <a href="/register" className="font-semibold text-accent hover:text-accent-hover transition-colors">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
