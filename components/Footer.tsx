import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-teal-600 text-xs">
                🌍
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text font-bold text-transparent">
                CarbonCoach AI
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Empowering individuals to understand, track, and reduce their carbon footprint through AI-powered insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Navigate</h3>
            <ul className="space-y-2">
              {[
                { href: '/calculator', label: 'Calculator' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/ai-coach', label: 'AI Coach' },
                { href: '/challenges', label: 'Challenges' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-emerald-400"
                    aria-label={`Go to ${link.label}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Learn</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Carbon Footprint Basics</li>
              <li>India&apos;s Climate Goals</li>
              <li>Sustainable Living Guide</li>
              <li>Calculation Methodology</li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Did You Know?</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              The average Indian emits{' '}
              <span className="font-semibold text-emerald-400">1.9 tons</span> of CO₂ per year — well below the global average of 4.7 tons. Every action counts! 🌱
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CarbonCoach AI. Built for a greener planet 🌍
          </p>
          <p className="text-xs text-slate-500">
            Powered by Gemini AI · Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
