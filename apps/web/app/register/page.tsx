import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Join the PrepArea study community.",
};

export default function RegisterPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Registration
          </p>
          <h1 className="mt-3 font-serif text-3xl font-medium text-ink sm:text-4xl">
            Join the first cohort
          </h1>
          <p className="mt-3 text-ink-muted">
            Free for the first 20 students. Two minutes, and you&rsquo;re in.
          </p>
        </div>
        <div className="card mt-10 p-7 sm:p-9">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}