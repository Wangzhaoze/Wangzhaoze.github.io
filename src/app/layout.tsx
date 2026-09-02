import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zhaoze Wang — Radar · Generative AI · Autonomous Driving',
  description:
    'Personal research portfolio of Zhaoze Wang, PhD researcher working on automotive radar, generative AI, robotics and autonomous driving.',
  metadataBase: new URL('https://wangzhaoze.github.io'),
  openGraph: {
    title: 'Zhaoze Wang',
    description: 'Radar · Generative AI · Autonomous Driving',
    url: 'https://wangzhaoze.github.io',
    type: 'website',
  },
  icons: { icon: '/favicon-32.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0b0a',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
