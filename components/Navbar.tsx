'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/calculator', label: 'Calculator', icon: '🧮' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/history', label: 'History', icon: '📈' },
  { href: '/ai-coach', label: 'AI Coach', icon: '🤖' },
  { href: '/challenges', label: 'Challenges', icon: '🏆' },
  { href: '/report', label: 'Report', icon: '📋' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white transition-opacity hover:opacity-80"
          aria-label="CarbonCoach AI Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-sm">
            🌍
          </span>
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            CarbonCoach
          </span>
          <span className="text-xs font-medium text-emerald-400/60">AI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={`Navigate to ${link.label}`}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-label={`Navigate to ${link.label}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
