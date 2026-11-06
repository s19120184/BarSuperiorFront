'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Lock, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useCloseShift } from '@/src/hooks/useCloseShift';
import { CashCounterGrid } from '@/src/components/register/CashCounterGrid';
import { formatCurrency } from '@/src/lib/utils';
import { CloseShiftFormValues, closeShiftSchema } from '@/src/schemas/cash-register.schema';
import { useAuthStore } from '@/src/store/useAuthStore';


export default function CloseShiftPage() {
  const router = useRouter();
  const {
    audit,
    isLoading,
    counts,
    calculatedTotal,
    expectedAmount,
    difference,
    status,
    handleCountChange,
    closeShift,
    isSubmitting,
  } = useCloseShift();

  const {logout} = useAuthStore()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CloseShiftFormValues>({
    resolver: zodResolver(closeShiftSchema),
    defaultValues: {
      finalCashReported: 0,
      notes: '',
    },
  });

  // Mantener sincronizado el input finalCashReported con la calculadora de billetes
  useEffect(() => {
    setValue('finalCashReported', calculatedTotal, { shouldValidate: true });
  }, [calculatedTotal, setValue]);

  const onSubmit = async (data: CloseShiftFormValues) => {
    await closeShift.mutateAsync(data);
    logout()
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex flex-col h-[calc(100dvh-3.5rem)] items-center justify-center bg-zinc-950 gap-4">
        <p className="text-zinc-400">No hay ningún turno activo para cerrar.</p>
        <button
          onClick={() => router.push('/register')}
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm font-semibold"
        >
          Ir a Caja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <button
          onClick={() => router.push('/register')}
          className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Auditoría Final
          </span>
          <h1 className="text-2xl font-black text-white">Cierre de Turno (Corte Z)</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Izquierda: Calculadora de Denominaciones */}
        <div>
          <CashCounterGrid counts={counts} onChange={handleCountChange} />
        </div>

        {/* Columna Derecha: Conciliación, Notas y Acción Final */}
        <div className="space-y-5">
          {/* Tarjeta de Conciliación Matemática */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Conciliación del Cajón
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Efectivo Esperado por Sistema:</span>
                <span className="font-semibold">{formatCurrency(expectedAmount)}</span>
              </div>

              <div className="flex justify-between text-white">
                <span>Efectivo Físico Contado:</span>
                <span className="text-lg font-black text-amber-400">
                  {formatCurrency(calculatedTotal)}
                </span>
              </div>

              {/* Indicador de Diferencia */}
              <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-zinc-400">Resultado:</span>
                <div className="flex items-center gap-2">
                  {status === 'CUADRADA' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cuadrada ($0.00)
                    </span>
                  )}
                  {status === 'SOBRANTE' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Sobrante +{formatCurrency(difference)}
                    </span>
                  )}
                  {status === 'FALTANTE' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/30">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Faltante {formatCurrency(difference)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Cierre con Validación Zod */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Total Reportado a Registrar ($)
              </label>
              <input
                type="number"
                step="any"
                {...register('finalCashReported', { valueAsNumber: true })}
                className={`w-full bg-zinc-950 border rounded-xl px-4 py-3 text-xl font-black text-white focus:outline-none transition-colors ${
                  errors.finalCashReported
                    ? 'border-rose-500'
                    : 'border-zinc-800 focus:border-amber-500'
                }`}
              />
              {errors.finalCashReported && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">
                  {errors.finalCashReported.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Observaciones o Justificación de Cierre
              </label>
              <textarea
                rows={3}
                placeholder="Indica motivos de faltante/sobrante o comentarios de la jornada..."
                {...register('notes')}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-rose-950/30 active:scale-[0.99]"
            >
              <Lock className="w-4 h-4" />
              {isSubmitting ? 'Cerrando y generando ticket...' : 'Confirmar Cierre y Emitir Corte Z'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}