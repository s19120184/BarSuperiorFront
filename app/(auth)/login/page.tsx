'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete, KeyRound, Mail, Lock, Wine } from 'lucide-react';
import { useAuthLogin } from '@/src/hooks/useAuthLogin';
import { LoginWithPasswordValues, loginWithPasswordSchema } from '@/src/schemas/auth.schema';




export default function LoginPage() {
  const { authMode, setAuthMode, pin, password } = useAuthLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginWithPasswordValues>({
    resolver: zodResolver(loginWithPasswordSchema),
  });

  const onPasswordSubmit = async (data: LoginWithPasswordValues) => {
    await password.login(data);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm space-y-6">
        {/* Cabecera / Identidad de Marca */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Wine className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">BAR SUPERIOR</h1>
          <p className="text-xs text-zinc-400">Terminal de Punto de Venta y Gestión</p>
        </div>

        {/* Selector de Modo: PIN Rápido vs Clásico */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setAuthMode('PIN')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'PIN'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            PIN Táctil
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('PASSWORD')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              authMode === 'PASSWORD'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contraseña
          </button>
        </div>

        {/* MODALIDAD 1: TECLADO NUMÉRICO TÁCTIL (PIN) */}
        {authMode === 'PIN' ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur">
            {/* Indicador de dígitos */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.value.length > idx
                      ? 'bg-amber-400 border-amber-400 scale-110'
                      : 'border-zinc-700 bg-zinc-950'
                  }`}
                />
              ))}
            </div>

            {/* Teclado numérico 3x4 */}
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={pin.isPending}
                  onClick={() => pin.handleInput(digit)}
                  className="h-16 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-xl font-black text-white active:scale-95 transition-transform flex items-center justify-center border border-zinc-700/40"
                >
                  {digit}
                </button>
              ))}

              <button
                type="button"
                disabled={pin.isPending}
                onClick={pin.handleClear}
                className="h-16 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-xs font-bold text-zinc-400 active:scale-95 transition-transform flex items-center justify-center border border-zinc-800"
              >
                C
              </button>

              <button
                type="button"
                disabled={pin.isPending}
                onClick={() => pin.handleInput('0')}
                className="h-16 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-xl font-black text-white active:scale-95 transition-transform flex items-center justify-center border border-zinc-700/40"
              >
                0
              </button>

              <button
                type="button"
                disabled={pin.isPending}
                onClick={pin.handleDelete}
                className="h-16 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 active:scale-95 transition-transform flex items-center justify-center border border-zinc-800"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {pin.isPending && (
              <p className="text-center text-xs text-amber-400 font-medium animate-pulse">
                Verificando PIN...
              </p>
            )}
          </div>
        ) : (
          /* MODALIDAD 2: FORMULARIO CORREO Y CONTRASEÑA */
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur">
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="admin@barsuperior.com"
                    className={`w-full bg-zinc-950 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-rose-500'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className={`w-full bg-zinc-950 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-rose-500'
                        : 'border-zinc-800 focus:border-amber-500'
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={password.isPending}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all disabled:opacity-50 mt-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                {password.isPending ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}