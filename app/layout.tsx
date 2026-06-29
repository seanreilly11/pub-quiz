import type { Metadata } from 'next';
import { Oswald, Inter } from 'next/font/google';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Round Two — London Pub Quiz Nights',
  description: 'Find accurate, verified pub quiz nights in London. Every listing checked with the pub.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Round Two — London Pub Quiz Nights',
    description: 'Find accurate, verified pub quiz nights in London.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-ink text-chalk antialiased">
        {children}
      </body>
    </html>
  );
}
