"use client";

import { HeroScene } from "@/components/fx/hero-scene";
import { TSerif, T, Button } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <HeroScene />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
      </div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <TSerif className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PrepArea
            </TSerif>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => window.location.href = "/login"}>
                Log In
              </Button>
              <Button variant="primary" onClick={() => window.location.href = "/register"}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <T className="text-purple-300 text-sm font-medium">
              🎯 Trusted by 10,000+ aspirants across India
            </T>
          </div>

          <TSerif className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Study Smarter,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Not Harder
            </span>
          </TSerif>

          <T className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            The all-in-one study platform for JEE, NEET, and board exam aspirants.
            Track your progress, join live sessions, and achieve your dream rank.
          </T>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={() => { window.location.href = "/register"; }}
              className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25"
            >
              Start Free Trial →
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { window.location.href = "/login"; }}
              className="px-8 py-4 text-lg bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Active Students", value: "10K+" },
              { label: "Study Hours", value: "500K+" },
              { label: "Success Rate", value: "94%" },
              { label: "Mentors", value: "150+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <TSerif className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </TSerif>
                <T className="text-slate-400 text-sm">{stat.label}</T>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <T className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Everything you need
            </T>
            <TSerif className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </TSerif>
            <T className="text-slate-400 text-lg max-w-2xl mx-auto">
              Designed to help you stay focused, track progress, and achieve your goals
            </T>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "⏱️",
                title: "Smart Study Timer",
                desc: "Pomodoro-style timer with room selection, session notes, and auto-tracking",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30",
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                desc: "Visualize your progress with daily/weekly trends, streaks, and consistency metrics",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/30",
              },
              {
                icon: "👥",
                title: "Live Study Rooms",
                desc: "Join scheduled study sessions with peers preparing for the same exams",
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-500/30",
              },
              {
                icon: "🏆",
                title: "Challenge System",
                desc: "Stay motivated with streaks, achievements, and friendly competition",
                gradient: "from-orange-500/20 to-red-500/20",
                border: "border-orange-500/30",
              },
              {
                icon: "👨‍🏫",
                title: "Mentor Sessions",
                desc: "Learn from successful IIT/AIIMS aspirants through live Q&A sessions",
                gradient: "from-pink-500/20 to-rose-500/20",
                border: "border-pink-500/30",
              },
              {
                icon: "🔒",
                title: "Secure Account",
                desc: "Password-based auth with instant access - no more waiting for OTP emails",
                gradient: "from-indigo-500/20 to-violet-500/20",
                border: "border-indigo-500/30",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border ${feature.border} hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <TSerif className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </TSerif>
                <T className="text-slate-300 leading-relaxed">
                  {feature.desc}
                </T>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <T className="text-purple-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Simple process
            </T>
            <TSerif className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </TSerif>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Account", desc: "Sign up with your email and set a secure password" },
              { step: "2", title: "Set Your Goals", desc: "Choose your exam, class, and daily study target" },
              { step: "3", title: "Start Studying", desc: "Use timers, join rooms, and track your progress" },
            ].map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <TSerif className="text-2xl font-bold text-white mb-3">
                    {item.title}
                  </TSerif>
                  <T className="text-slate-400">
                    {item.desc}
                  </T>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-purple-400 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <TSerif className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your
                <br />
                Preparation?
              </TSerif>
              <T className="text-purple-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of aspirants who are already achieving their dreams with PrepArea
              </T>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => { window.location.href = "/register"; }}
                  className="px-8 py-4 text-lg bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-xl"
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => { window.location.href = "/login"; }}
                  className="px-8 py-4 text-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </div>
              <T className="text-purple-200 text-sm mt-8">
                No credit card required • Cancel anytime • Free 7-day trial
              </T>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <TSerif className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            PrepArea
          </TSerif>
          <T className="text-slate-500 text-sm">
            © 2026 PrepArea. All rights reserved. Not a coaching platform.
          </T>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}