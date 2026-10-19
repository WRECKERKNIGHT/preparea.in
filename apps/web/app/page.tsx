"use client";

import { HeroScene } from "@/components/fx/hero-scene";
import { TSerif, T, Button, Card } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Animated Hero Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroScene />
      </div>

      {/* Main Content */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Text with Reveal Animation */}
          <div className="text-center mb-16">
            <TSerif className="text-5xl font-bold text-primary-600 mb-6">
              PrepArea
            </TSerif>
            <T className="text-xl text-muted-foreground mb-8">
              The ultimate study community for competitive exam aspirants
            </T>
            <div className="flex justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  // In a real app, this would navigate to registration
                  alert("Redirecting to registration...");
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  // In a real app, this would navigate to login
                  alert("Redirecting to login...");
                }}
              >
                Log In
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <section className="mb-16">
            <TSerif className="text-3xl font-bold text-center text-primary-600 mb-12">
              Why Choose PrepArea?
            </TSerif>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Study Timers
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Track your study sessions with our built-in Pomodoro-style timer
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Feature Card 2 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Analytics Dashboard
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Visualize your progress, streaks, and consistency over time
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Feature Card 3 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Study Rooms
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Join live study sessions with peers preparing for the same exams
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Feature Card 4 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Challenge System
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Stay motivated with streaks, achievements, and friendly competition
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Feature Card 5 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Mentor Sessions
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Learn from successful aspirants and experts in your field
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Feature Card 6 */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <TSerif className="text-2xl font-bold text-center text-primary-600 mb-4">
                  Community Support
                </TSerif>
                <T className="text-center text-muted-foreground mb-4">
                  Connect with thousands of aspirants sharing the same journey
                </T>
                <div className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16">
            <TSerif className="text-3xl font-bold text-center text-primary-600 mb-12">
              How It Works
            </TSerif>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="p-6 text-center border border-muted-foreground/20">
                <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center mb-4">
                  <TSerif className="text-xl font-bold text-primary-600">1</TSerif>
                </div>
                <TSerif className="text-xl font-bold mb-4">Register</TSerif>
                <T className="text-muted-foreground">
                  Create your profile with your exam, class, and goals
                </T>
              </Card>

              {/* Step 2 */}
              <Card className="p-6 text-center border border-muted-foreground/20">
                <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center mb-4">
                  <TSerif className="text-xl font-bold text-primary-600">2</TSerif>
                </div>
                <TSerif className="text-xl font-bold mb-4">Study</TSerif>
                <T className="text-muted-foreground">
                  Use our timers, join rooms, and track your progress
                </T>
              </Card>

              {/* Step 3 */}
              <Card className="p-6 text-center border border-muted-foreground/20">
                <div className="w-16 h-16 rounded-full bg-primary-600/10 flex items-center justify-center mb-4">
                  <TSerif className="text-xl font-bold text-primary-600">3</TSerif>
                </div>
                <TSerif className="text-xl font-bold mb-4">Improve</TSerif>
                <T className="text-muted-foreground">
                  Review your analytics, join challenges, and reach your goals
                </T>
              </Card>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="text-center py-12 bg-primary-50 rounded-xl">
            <TSerif className="text-3xl font-bold text-primary-600 mb-6">
              Ready to Transform Your Preparation?
            </TSerif>
            <T className="text-lg text-muted-foreground mb-8">
              Join thousands of aspirants who are already achieving their goals with PrepArea
            </T>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  // In a real app, this would navigate to registration
                  alert("Redirecting to registration...");
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  // In a real app, this would navigate to features
                  alert("Redirecting to features...");
                }}
              >
                Learn More
              </Button>
            </div>
            <T className="text-sm text-muted-foreground mt-6">
              No credit card required. Cancel anytime.
            </T>
          </section>
        </div>
      </section>
    </main>
  );
}