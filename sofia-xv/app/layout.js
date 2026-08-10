import './globals.css';
import AudioProvider from './AudioProvider';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'XV Años de Sofía Becerra Martínez',
  description: 'Acompáñanos a celebrar los XV años de Sofía Becerra Martínez — 1 de agosto, 2026',
  openGraph: {
    title: 'XV Años de Sofía Becerra Martínez',
    description: 'Acompáñanos a celebrar los XV años de Sofía',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AudioProvider>{children}</AudioProvider>
        <Analytics />
      </body>
    </html>
  );
}
