import './globals.css';

export const metadata = {
  title: 'XV Años - Sofía Becerra Martínez',
  description: 'Acompáñanos a celebrar los XV años de Sofía Becerra Martínez',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
