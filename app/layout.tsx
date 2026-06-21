import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CarbonCoach AI — Track & Reduce Your Carbon Footprint',
  description:
    'CarbonCoach AI helps individuals understand, track, and reduce their carbon footprint through a personalized calculator, AI-powered coaching, sustainability challenges, and weekly reports.',
  keywords: ['carbon footprint', 'sustainability', 'climate action', 'carbon calculator', 'India', 'AI coach'],
  authors: [{ name: 'CarbonCoach AI' }],
  openGraph: {
    title: 'CarbonCoach AI — Track & Reduce Your Carbon Footprint',
    description: 'Understand your carbon footprint. Take action today with AI-powered insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col bg-[#0B1120] font-sans text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
