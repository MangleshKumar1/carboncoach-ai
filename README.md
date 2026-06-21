# 🌍 CarbonCoach AI

**Empowering individuals to understand, track, and reduce their carbon footprint through AI-powered insights.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

---

## 🌱 Problem Statement

Climate change is a global crisis, yet most individuals lack awareness of their personal carbon footprint and actionable ways to reduce it. **The average Indian emits 1.9 tons of CO₂ per year** — while lower than the global average, there's still significant room for improvement through everyday choices.

**CarbonCoach AI** solves this by providing:
- A **personalized carbon footprint calculator** tailored for Indian lifestyles
- **AI-powered coaching** that gives contextual, actionable sustainability tips
- **30-day challenges** to build eco-friendly habits with streak tracking
- **Weekly AI reports** that analyze your progress and recommend next steps

---

## ✨ Features

### 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Hero section with CTA, feature cards, and statistics |
| **Calculator** | `/calculator` | Multi-category carbon footprint calculator with validation |
| **Dashboard** | `/dashboard` | Donut chart breakdown, score gauge, India avg comparison |
| **AI Coach** | `/ai-coach` | Chat interface powered by Gemini AI for personalized tips |
| **Challenges** | `/challenges` | 12 eco-challenges with streak tracking and category filters |
| **Report** | `/report` | AI-generated weekly sustainability reports |

### 🧮 Carbon Calculation Methodology

| Category | Formula | Source Factor |
|----------|---------|---------------|
| Transport | `km/week × 52 × factor` | Car: 0.21, Bus: 0.089, Train: 0.041 kg CO₂/km |
| Electricity | `units/month × 12 × 0.82` | India grid emission factor (kg CO₂/unit) |
| Food | Fixed annual value | Vegan: 1.5t, Veg: 2.5t, Non-veg: 4.5t |
| Flights | `flights × 0.255 tons` | Average CO₂ per flight |
| Shopping | `₹/month × 12 × 0.0025 kg` | Per rupee emission factor (2.5 kg per ₹1,000 spent) |

### Carbon Score Categories
- 🟢 **Low** — Under 2,000 kg CO₂/year
- 🟡 **Medium** — 2,000–5,000 kg CO₂/year
- 🔴 **High** — Above 5,000 kg CO₂/year

### 🎨 Design
- **Dark-first** design with emerald green accents
- **Glassmorphism** cards with backdrop-blur effects
- **Micro-animations** — fade-ins, hover scales, staggered entries
- **Fully responsive** — mobile-first design
- **Accessible** — aria-labels, keyboard navigation, screen reader support

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | App Router, server/client components |
| **TypeScript** | Strict mode, full type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Recharts** | Donut chart for emissions breakdown |
| **Gemini AI API** | AI coaching and report generation |
| **localStorage** | Client-side data persistence |
| **Jest + React Testing Library** | Unit testing (14 tests) |
| **ESLint** | Code quality enforcement |

---

## 📁 Folder Structure

```
carboncoach-ai/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with Navbar/Footer
│   ├── page.tsx                  # Home page
│   ├── calculator/page.tsx       # Carbon calculator form
│   ├── dashboard/page.tsx        # Emissions dashboard
│   ├── ai-coach/page.tsx         # AI chat interface
│   ├── challenges/page.tsx       # 30-day challenge cards
│   └── report/page.tsx           # Weekly AI report
├── components/                   # Reusable UI components
│   ├── Navbar.tsx                # Responsive navigation
│   ├── Footer.tsx                # Site footer
│   ├── CarbonDonutChart.tsx      # Recharts pie chart
│   ├── ChallengeCard.tsx         # Challenge card with streak
│   ├── ChatBubble.tsx            # Chat message bubbles
│   ├── ScoreGauge.tsx            # Score visualization gauge
│   ├── InputField.tsx            # Validated form input
│   └── LoadingSpinner.tsx        # Loading indicator
├── lib/                          # Utility functions
│   ├── carbon-calculations.ts    # Pure calculation functions
│   ├── storage.ts                # localStorage wrapper
│   ├── gemini.ts                 # Gemini API integration
│   └── challenges-data.ts       # Challenge definitions
├── types/                        # TypeScript interfaces
│   ├── carbon.ts                 # Domain types
│   └── index.ts                  # Barrel exports
├── __tests__/                    # Jest test files
│   └── carbon-calculations.test.ts
├── vercel.json                   # Deployment config
├── jest.config.ts                # Jest configuration
└── .env.example                  # Environment variables template
```

---

## 🚀 How to Run

### Prerequisites
- Node.js 18+ and npm
- An [OpenRouter API key](https://openrouter.ai/) (primary) and/or a [Gemini API key](https://makersuite.google.com/app/apikey) (fallback)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/carboncoach-ai.git
cd carboncoach-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your API keys:
# OPENROUTER_API_KEY=your_key
# GEMINI_API_KEY=your_key

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage report |

### Security
- All API keys server-side only (never in client bundle)
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, X-XSS-Protection, Referrer-Policy, and Permissions-Policy
- Input validation and sanitization on all API routes
- Rate limiting: 10 requests/day per session

### Accessibility
WCAG 2.1 AA compliant:
- Skip to main content link
- All form inputs have associated labels
- aria-live regions for dynamic content updates
- Full keyboard navigation support
- Focus-visible indicators on all interactive elements
- Semantic heading hierarchy (h1→h2→h3)

### Testing
Run: npm test
Covers:
- All carbon calculation functions + edge cases
- Input validation (negative values, zero values)
- API route: success, failure, validation
- AI provider fallback: OpenRouter → Gemini verified
- Separation of concerns: route tests vs provider tests

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `GEMINI_API_KEY` in Environment Variables
4. Deploy

The included `vercel.json` configures the Next.js framework automatically.

---

## 🎯 Alignment with Problem Statement

### AI Architecture
- All AI calls are server-side only
- Primary: OpenRouter (configurable model via env)
- Fallback: Google Gemini Direct
- Zero API key exposure to browser

### Problem Statement Mapping
| Requirement | Feature | Page |
|-------------|---------|------|
| Understand carbon footprint | Calculator + breakdown chart | /calculator, /dashboard |
| Track carbon footprint | Carbon Journey timeline + history table | /history |
| Reduce carbon footprint | AI Coach with personalized plan | /ai-coach |
| Personalized insights | OpenRouter/Gemini using user's actual data | /ai-coach, /report |
| Simple actions | 30-Day Challenges with streak tracking | /challenges |

---

## 🌍 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💚 for a greener planet 🌍<br/>
  <strong>CarbonCoach AI</strong> — Every action counts.
</p>
