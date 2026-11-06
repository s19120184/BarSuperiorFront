'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/useAuthStore';


interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
  variant?: 'ghost' | 'sidebar' | 'danger';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  showText = true,
  variant = 'sidebar',
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Limpiar estado de Zustand, localStorage y cookies
      logout();

      // 2. Limpiar toda la caché en memoria de TanStack Query
      queryClient.clear();

      // 3. Redirigir al login
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setIsLoggingOut(false);
    }
  };

  // Variantes de diseño
  const variantStyles = {
    sidebar:
      'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors',
    ghost:
      'p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-850 transition-colors',
    danger:
      'flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors',
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      title="Cerrar Sesión"
      className={`${variantStyles[variant]} ${className}`}
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {showText && (
        <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
      )}
    </button>
  );
};