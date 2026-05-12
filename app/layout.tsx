import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solitaire: Masters of the Universe',
  description: 'Epic Klondike Solitaire with pixel art and MOTU vibes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
