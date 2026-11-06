import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import Providers from '@/src/lib/providers';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bar Superior | Punto de Venta',
  description: 'Sistema de control operativo y comandas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen antialiased select-none`}
      >
        <Providers>{children}</Providers>
        <Toaster position = 'top-right' />
      </body>
    </html>
  );
}