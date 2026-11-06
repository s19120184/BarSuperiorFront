'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle } from 'lucide-react';
import { OpenShiftFormValues, openShiftSchema } from '@/src/schemas/cash-register.schema';
import { useAuthLogin } from '@/src/hooks/useAuthLogin';
import { useAuthStore } from '@/src/store/useAuthStore';
import { redirect } from 'next/navigation';


interface OpenShiftCardProps {
  onSubmit: (data: OpenShiftFormValues) => Promise<void>;
  isPending: boolean;
}

export const OpenShiftCard: React.FC<OpenShiftCardProps> = ({ onSubmit, isPending }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpenShiftFormValues>({
    resolver: zodResolver(openShiftSchema) ,
    defaultValues: {
      shiftName: 'Turno Principal',
      initialAmount: 1500,
    },
  });

  const isAuth   = useAuthStore( s => s.isAuthenticated)

  if(!isAuth) {
    redirect('/login')
  }
  

  return (
    <div className="max-w-md mx-auto min-h-[calc(100dvh-5rem)] flex items-center justify-center p-4">
      <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Caja Cerrada</h1>
          <p className="text-xs text-zinc-400">
            Ingresa el fondo inicial de cambio para habilitar cobros y ventas.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Nombre o Identificador del Turno
            </label>
            <input
              type="text"
              {...register('shiftName')}
              className={`w-full bg-zinc-950 border rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors ${
                errors.shiftName ? 'border-rose-500' : 'border-zinc-800 focus:border-amber-500'
              }`}
              placeholder="Ej. Turno de Día"
            />
            {errors.shiftName && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.shiftName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Fondo Inicial en Efectivo ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-500">
                $
              </span>
              <input
                type="number"
                step="any"
                {...register('initialAmount', {valueAsNumber:true})}
                className={`w-full bg-zinc-950 border rounded-xl pl-9 pr-4 py-3 text-2xl font-black text-white focus:outline-none transition-colors ${
                  errors.initialAmount ? 'border-rose-500' : 'border-zinc-800 focus:border-amber-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.initialAmount && (
              <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.initialAmount.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {[1000, 1500, 2000].map((amt) => (
              <button
                type="button"
                key={amt}
                onClick={() => setValue('initialAmount', amt, { shouldValidate: true })}
                className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 border border-zinc-700/50 transition-colors"
              >
                ${amt}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all disabled:opacity-50 mt-2 shadow-lg shadow-amber-500/20 active:scale-[0.99]"
          >
            {isPending ? 'Abriendo caja...' : 'Abrir Turno de Caja'}
          </button>
        </form>
      </div>
    </div>
  );
};