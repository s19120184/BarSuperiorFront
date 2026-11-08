"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, Layers, ArrowLeft, ShieldAlert, HistoryIcon,User2Icon, LucideTable } from "lucide-react";
import { useAuthStore } from "@/src/store/useAuthStore";

import { LogoutButton } from "@/src/components/auth/LogoutButton";
import { Toaster } from "sonner";
// Tu store de sesión

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  

  // Verificación estricta: Solo admin
  const isAdmin = user?.roles?.includes("admin");
 

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4 animate-pulse" />
        <h1 className="text-xl font-black text-white uppercase tracking-wider">
          Acceso Restringido
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-sm">
          Este módulo está reservado exclusivamente para la administración del
          bar.
        </p>
        <button
          onClick={() => router.push("/tables")}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-zinc-200 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Salón de Mesas
        </button>
      </div>
    );
  }

  const navItems = [
    { label: "Productos", href: "/admin/products", icon: Package },
    { label: "Categorías", href: "/admin/categories", icon: Layers },
    {label:'Historial de ventas', href:'/admin/shifts-history', icon: HistoryIcon},
    {label:'Personal', href:'/admin/users', icon:User2Icon },
    {label:'Mesas', href:'/admin/tables', icon:LucideTable },
    {label:'Ordenes', href:'/admin/orders', icon:LucideTable },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/50 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                Panel Central
              </span>
              <h2 className="text-lg font-black tracking-tight text-white">
                Catálogo & Menú
              </h2>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800/60">
          <Link
            href="/tables"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar a Punto de Venta
          </Link>

          {/* Botón de Cierre de Sesión */}
          <LogoutButton variant="sidebar" />
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
      <Toaster position = 'top-right' />
    </div>
  );
}
