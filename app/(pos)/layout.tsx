'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function PosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // const {time} = useClock();

  const user = useAuthStore((s) => s.user);
  
    // Verificación estricta: Solo admin
  const isAdmin = user?.roles?.includes('admin') ;



  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header Barra POS */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="font-black text-lg tracking-wider text-amber-500">
            BAR SUPERIOR
          </span>

          <nav className="flex items-center gap-2">
            <Link
              href="/tables"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname.startsWith('/tables') || pathname.startsWith('/orders')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mesas
            </Link>
            <Link
              href="/register"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname.startsWith('/register')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Caja / Arqueo
            </Link>
           
            {isAdmin ? (
              <Link
              href="/admin/products"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname.startsWith('/register')
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Administracion
            </Link>

            ): null}

           
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700/50">
            {/* {time || '--:--:--'} */}
          </span>
          <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-300">En línea</span>
          </div>
           
        </div>
      </header>
            
      

      {/* Contenido de la vista */}
      <main className="flex-1">{children}</main>
    </div>
  );
}