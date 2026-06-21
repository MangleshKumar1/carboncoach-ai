import Link from 'next/link';

const FEATURES = [
  {
    icon: '🧮',
    title: 'Carbon Calculator',
    description: 'Calculate your annual carbon footprint across transport, electricity, food, flights, and shopping.',
    href: '/calculator',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/20',
  },
  {
    icon: '📊',
    title: 'Visual Dashboard',
    description: 'See your emissions breakdown with beautiful charts and compare to India\'s national average.',
    href: '/dashboard',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/20',
  },
  {
    icon: '🤖',
    title: 'AI Coach',
    description: 'Get personalized reduction tips and answers from our Gemini-powered sustainability coach.',
    href: '/ai-coach',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: '🏆',
    title: '30-Day Challenges',
    description: 'Take on eco-challenges like Meatless Monday and track your streaks for real impact.',
    href: '/challenges',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/20',
  },
  {
    icon: '📋',
    title: 'Weekly Reports',
    description: 'AI-generated sustainability reports with wins, losses, and actionable recommendations.',
    href: '/report',
    color: 'from-rose-500/20 to-red-500/20',
    borderColor: 'border-rose-500/20',
  },
  {
    icon: '🌱',
    title: 'Track Progress',
    description: 'Monitor your sustainability journey with persistent data tracking across sessions.',
    href: '/dashboard',
    color: 'from-lime-500/20 to-green-500/20',
    borderColor: 'border-lime-500/20',
  },
];

const STATS = [
  { value: '1.9', unit: 'tons/yr', label: 'India Avg CO₂', icon: '🇮🇳' },
  { value: '4.7', unit: 'tons/yr', label: 'Global Avg CO₂', icon: '🌍' },
  { value: '2050', unit: '', label: 'Net Zero Target', icon: '🎯' },
  { value: '30+', unit: 'days', label: 'Challenge Streak', icon: '🔥' },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ── Hero Section ── */}
      <section className="hero-gradient relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute right-10 top-20 text-8xl opacity-10 animate-float select-none">
          🌍
        </div>
        <div className="pointer-events-none absolute left-10 bottom-20 text-6xl opacity-10 animate-float select-none" style={{ animationDelay: '2s' }}>
          🌿
        </div>

        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Sustainability Coach
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.1s' }}>
            Understand Your{' '}
            <span className="gradient-text">Carbon Footprint.</span>
            <br />
            Take Action Today.
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400" style={{ animationDelay: '0.2s' }}>
            CarbonCoach AI helps you calculate your environmental impact, get personalized reduction tips from AI, and track your journey towards a sustainable lifestyle — all tailored for India.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/calculator"
              className="animate-pulse-glow inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
              aria-label="Calculate my carbon footprint"
            >
              🧮 Calculate My Footprint
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10"
              aria-label="View my dashboard"
            >
              📊 View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="border-y border-white/5 bg-slate-900/50 px-4 py-12 sm:px-6" aria-label="Key statistics">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="animate-fade-in-up text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white">
                {stat.value}
                {stat.unit && <span className="ml-1 text-sm font-normal text-slate-400">{stat.unit}</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="px-4 py-20 sm:px-6" aria-label="Features">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Everything You Need to{' '}
              <span className="gradient-text">Go Green</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-400">
              From calculating your footprint to AI coaching, challenges, and reports — CarbonCoach AI is your complete sustainability companion.
            </p>
          </div>

          <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.color} p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl`}
                aria-label={`Go to ${feature.title}`}
              >
                <span className="mb-4 block text-4xl">{feature.icon}</span>
                <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-4 pb-20 sm:px-6" aria-label="Call to action">
        <div className="mx-auto max-w-3xl rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Ready to Make a Difference? 🌱
          </h2>
          <p className="mb-8 text-slate-400">
            Start by calculating your carbon footprint. It takes less than 2 minutes and could change the way you think about your daily choices.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
            aria-label="Start carbon footprint calculator"
          >
            Get Started — It&apos;s Free →
          </Link>
        </div>
      </section>
    </div>
  );
}
