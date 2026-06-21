import Link from 'next/link';

const FEATURES = [
  {
    icon: '🧮',
    title: 'Carbon Calculator',
    description: 'Calculate your annual carbon footprint across transport, electricity, food, flights, and shopping.',
    href: '/calculator',
    iconBg: 'bg-emerald-50',
    border: 'border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/60',
  },
  {
    icon: '📊',
    title: 'Visual Dashboard',
    description: "See your emissions breakdown with beautiful charts and compare to India's national average.",
    href: '/dashboard',
    iconBg: 'bg-blue-50',
    border: 'border-blue-100 hover:border-blue-300 hover:shadow-blue-100/60',
  },
  {
    icon: '🤖',
    title: 'AI Coach',
    description: 'Get personalized reduction tips and answers from our Gemini-powered sustainability coach.',
    href: '/ai-coach',
    iconBg: 'bg-purple-50',
    border: 'border-purple-100 hover:border-purple-300 hover:shadow-purple-100/60',
  },
  {
    icon: '🏆',
    title: '30-Day Challenges',
    description: 'Take on eco-challenges like Meatless Monday and track your streaks for real impact.',
    href: '/challenges',
    iconBg: 'bg-amber-50',
    border: 'border-amber-100 hover:border-amber-300 hover:shadow-amber-100/60',
  },
  {
    icon: '📋',
    title: 'Weekly Reports',
    description: 'AI-generated sustainability reports with wins, losses, and actionable recommendations.',
    href: '/report',
    iconBg: 'bg-rose-50',
    border: 'border-rose-100 hover:border-rose-300 hover:shadow-rose-100/60',
  },
  {
    icon: '🌱',
    title: 'Track Progress',
    description: 'Monitor your sustainability journey with persistent data tracking across sessions.',
    href: '/dashboard',
    iconBg: 'bg-teal-50',
    border: 'border-teal-100 hover:border-teal-300 hover:shadow-teal-100/60',
  },
];

const IMPACT_STATS = [
  { value: '10K+', label: 'People Engaged', icon: '👥' },
  { value: '50K', label: 'Tons CO₂ Tracked', icon: '🌍' },
  { value: '23%', label: 'Avg Reduction', icon: '📉' },
  { value: '100K+', label: 'AI Tips Generated', icon: '🤖' },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: '🧮',
    title: 'Calculate',
    desc: 'Enter your transport, electricity, food, and shopping habits.',
  },
  {
    step: 2,
    icon: '📊',
    title: 'Analyze',
    desc: 'AI breaks down your emissions across every lifestyle category.',
  },
  {
    step: 3,
    icon: '💡',
    title: 'Recommend',
    desc: 'Get a personalized, actionable plan to cut your footprint.',
  },
  {
    step: 4,
    icon: '📈',
    title: 'Track Progress',
    desc: 'Watch your impact shrink over time with trend charts.',
  },
];

const DASHBOARD_PREVIEW = [
  { icon: '🌿', label: 'Your Carbon Score', value: '1,240 kg', sub: 'CO₂/year · Low Impact', accent: 'border-l-emerald-400' },
  { icon: '📊', label: 'vs India Average', value: '−34%', sub: 'Well below national avg', accent: 'border-l-teal-400' },
  { icon: '🏆', label: 'Active Challenges', value: '7 Streaks', sub: 'Challenges running', accent: 'border-l-amber-400' },
  { icon: '🤖', label: 'AI Coach Tips', value: '12 Tips', sub: 'Personalised this week', accent: 'border-l-purple-400' },
  { icon: '✈️', label: 'Flights Impact', value: '320 kg', sub: 'CO₂ this year', accent: 'border-l-blue-400' },
  { icon: '🛍️', label: 'Shopping Impact', value: '180 kg', sub: 'CO₂ this month', accent: 'border-l-rose-400' },
];

export default function HomePage() {
  return (
    <div className="relative">

      {/* ── Hero Section ── */}
      <section className="hero-gradient relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:pb-24 lg:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                AI-Powered Sustainability Coach
              </div>

              <h1
                className="animate-fade-in-up mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
                style={{ animationDelay: '0.1s' }}
              >
                Understand Your{' '}
                <span className="gradient-text">Carbon Footprint.</span>
                <br />
                Take Action Today.
              </h1>

              <p
                className="animate-fade-in-up mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0"
                style={{ animationDelay: '0.2s' }}
              >
                CarbonCoach AI helps you calculate your environmental impact, get personalised reduction tips from AI, and track your journey towards a sustainable lifestyle — all tailored for India.
              </p>

              <div
                className="animate-fade-in-up flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                style={{ animationDelay: '0.3s' }}
              >
                <Link
                  href="/calculator"
                  className="animate-pulse-glow inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
                  aria-label="Calculate my carbon footprint"
                >
                  🧮 Calculate My Footprint
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  aria-label="View my dashboard"
                >
                  📊 View Dashboard
                </Link>
              </div>

              <div
                className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 lg:justify-start"
                style={{ animationDelay: '0.4s' }}
              >
                {['Free to use', 'Tailored for India', 'Gemini AI powered'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dashboard Preview Card */}
            <div
              className="animate-fade-in-up relative flex justify-center lg:justify-end"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative w-full max-w-sm">
                {/* Glow halo */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-emerald-100/70 to-teal-100/50 blur-2xl" />

                {/* Card */}
                <div className="relative rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-100/60">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg">
                      🌍
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Your Carbon Score</p>
                      <p className="text-base font-bold text-slate-900">Low Impact 🟢</p>
                    </div>
                  </div>

                  <div className="mb-5 rounded-2xl bg-emerald-50 p-4">
                    <div className="mb-1 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">1,240</span>
                      <span className="text-sm text-slate-500">kg CO₂/year</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/70">
                      <div className="h-full w-[24%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-emerald-700">34% below India average 🎉</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { icon: '🚗', label: 'Transport', pct: 32, color: 'bg-blue-400' },
                      { icon: '⚡', label: 'Electricity', pct: 18, color: 'bg-amber-400' },
                      { icon: '🍽️', label: 'Food', pct: 40, color: 'bg-emerald-400' },
                    ].map((cat) => (
                      <div key={cat.label} className="flex items-center gap-2">
                        <span className="text-sm">{cat.icon}</span>
                        <div className="flex-1">
                          <div className="mb-0.5 flex justify-between text-xs">
                            <span className="text-slate-600">{cat.label}</span>
                            <span className="text-slate-500">{cat.pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating chips */}
                <div className="absolute -right-4 -top-4 animate-float rounded-2xl border border-emerald-100 bg-white px-3 py-2 shadow-lg">
                  <p className="text-xs font-bold text-emerald-600">🤖 AI Coach Active</p>
                </div>
                <div
                  className="absolute -bottom-3 -left-4 animate-float rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-lg"
                  style={{ animationDelay: '1.5s' }}
                >
                  <p className="text-xs font-bold text-slate-700">🏆 7-day streak!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact Stats ── */}
      <section className="border-y border-slate-100 bg-white px-4 py-14 sm:px-6" aria-label="Platform impact statistics">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-widest text-emerald-600">
            Trusted by sustainability-conscious Indians
          </p>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {IMPACT_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="animate-count-up text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="mb-2 text-3xl">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="px-4 py-20 sm:px-6" aria-label="Features">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-600">Everything you need</p>
            <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Your Complete{' '}
              <span className="gradient-text">Sustainability Toolkit</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-600">
              From calculating your footprint to AI coaching, challenges, and reports — CarbonCoach AI is your complete sustainability companion.
            </p>
          </div>

          <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${feature.border}`}
                aria-label={`Go to ${feature.title}`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-soft px-4 py-20 sm:px-6" aria-label="How CarbonCoach AI works">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-600">Simple process</p>
            <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-600">
              From your first calculation to lasting habit change — in four clear steps.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4">
            {/* Connector line — desktop only */}
            <div
              className="absolute hidden h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 lg:block"
              style={{ top: '28px', left: '14%', right: '14%' }}
            />

            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className="animate-fade-in-up relative text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-200 bg-white text-2xl shadow-md shadow-emerald-100/60">
                  {step.icon}
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Coach Preview ── */}
      <section className="px-4 py-20 sm:px-6" aria-label="AI Coach preview">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Text */}
            <div className="animate-fade-in-up text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                🤖 Powered by Gemini AI
              </div>
              <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Your Personal{' '}
                <span className="gradient-text">AI Coach</span>
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                Ask anything about your carbon footprint. Get instant, personalised recommendations tailored to your lifestyle and location in India.
              </p>
              <ul className="mb-8 space-y-3 text-left">
                {[
                  'Personalised reduction strategies',
                  'Local alternatives & eco-products',
                  'Track impact of your daily choices',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/ai-coach"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40"
                aria-label="Try AI Coach"
              >
                🤖 Try AI Coach
              </Link>
            </div>

            {/* Mock Chat */}
            <div
              className="animate-fade-in-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100/50"
              style={{ animationDelay: '0.15s' }}
            >
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-base">
                  🤖
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">CarbonCoach AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-emerald-600">Online · Gemini AI</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm">🤖</div>
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    Hi! I&apos;m your personal sustainability coach. How can I help you reduce your footprint today?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-3 text-sm text-white">
                    How can I reduce my transport emissions?
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm">🤖</div>
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <p className="mb-2 font-semibold text-slate-900">Great question! Here are 3 quick wins:</p>
                    <ul className="space-y-1.5">
                      <li className="flex gap-2"><span className="font-bold text-emerald-500">•</span>Switch to public transit 2×/week — saves ~200 kg/yr</li>
                      <li className="flex gap-2"><span className="font-bold text-emerald-500">•</span>Combine errands into single trips</li>
                      <li className="flex gap-2"><span className="font-bold text-emerald-500">•</span>Consider an EV for your next vehicle</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <span className="flex-1 text-sm text-slate-400">Ask me anything about sustainability...</span>
                  <Link
                    href="/ai-coach"
                    className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-bold text-white"
                  >
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ── */}
      <section className="section-soft px-4 py-20 sm:px-6" aria-label="Dashboard preview">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-600">Powerful insights</p>
            <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything in One{' '}
              <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-600">
              A comprehensive view of your carbon footprint — by category, over time, and compared to national benchmarks.
            </p>
          </div>

          <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DASHBOARD_PREVIEW.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.accent}`}
              >
                <div className="mb-3 text-2xl">{card.icon}</div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900">{card.value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label="View full dashboard"
            >
              📊 View Full Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="px-4 py-20 sm:px-6" aria-label="Call to action">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-10 text-center shadow-2xl shadow-emerald-500/25 sm:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-10">
              <div className="absolute right-8 top-8 text-8xl">🌍</div>
              <div className="absolute bottom-8 left-8 text-6xl">🌿</div>
            </div>

            <div className="relative">
              <h2 className="mb-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                Start Your Sustainability Journey Today
              </h2>
              <p className="mb-8 text-base text-emerald-100 sm:text-lg">
                Measure your impact. Reduce emissions. Create positive change.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-emerald-700 shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                aria-label="Start carbon footprint calculator"
              >
                🧮 Calculate My Footprint
              </Link>
              <p className="mt-5 text-xs text-emerald-200">Free · No signup required · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
