'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Banknote,
  TrendingUp,
  CreditCard,
  QrCode,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Printer,
  RefreshCw,
  User,
  Clock,
} from 'lucide-react';
import { ShiftAuditResponse } from '@/src/types/cash-register';
import { formatCurrency } from '@/src/lib/utils';


interface ActiveShiftAuditProps {
  audit: ShiftAuditResponse;
  isRefetching: boolean;
  onRefresh: () => void;
  onOpenExpenseModal: () => void;
  onOpenMovementModal: () => void;
}

export const ActiveShiftAudit: React.FC<ActiveShiftAuditProps> = ({
  audit,
  isRefetching,
  onRefresh,
  onOpenExpenseModal,
  onOpenMovementModal,
}) => {
  const router = useRouter();
  const {shiftInfo : shift, income, cashInjections, cashExpenses, financials ,reconciliation} = audit;

 
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* 1. Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white tracking-tight">Control de Caja</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Turno Abierto
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              {shift.openedBy}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {new Date(shift.openedAt).toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-medium">{shift.name}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => window.open('/api/tickets/corte-z', '_blank')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span> Corte X
          </button>

          <button
            onClick={() => router.push('/register/close')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-xs font-black text-white transition-all shadow-lg shadow-rose-950/20 active:scale-[0.99]"
          >
            <Lock className="w-4 h-4" />
            Cerrar Turno (Corte Z)
          </button>
        </div>
      </header>

      {/* 2. Tarjeta Principal Arqueo */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-950 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
              Arqueo en Tiempo Real
            </span>
            <p className="text-xs text-zinc-400">
              Fondo inicial + Ventas efectivo + Inyecciones - Gastos
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight pt-1">
              {formatCurrency(financials.expectedCashInDrawer)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMovementModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-emerald-400 border border-emerald-500/20 transition-all active:scale-[0.99]"
            >
              <ArrowDownRight className="w-4 h-4" />
              Inyectar Cambio
            </button>

            <button
              onClick={onOpenExpenseModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-rose-400 border border-rose-500/20 transition-all active:scale-[0.99]"
            >
              <ArrowUpRight className="w-4 h-4" />
              Registrar Gasto
            </button>
          </div>
        </div>
      </section>

      {/* 3. Métricas de Ventas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Efectivo</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white">{formatCurrency(income.cash)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Tarjeta</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-xl font-black text-white">{formatCurrency(income.card)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Transferencia</span>
            <QrCode className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-black text-white">
            {formatCurrency(income.transfer)}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Venta Neta Total</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-black text-amber-400">
            {formatCurrency(income.totalSales)}
          </p>
        </div>
      </section>

      {/* 4. Ecuación y Desglose de Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Ecuación de Efectivo
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-zinc-300">
              <span>(+) Fondo Inicial:</span>
              <span className="font-semibold">{formatCurrency(financials.initialAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>(+) Cobros en Efectivo:</span>
              <span className="font-semibold">+{formatCurrency(financials.totalCashIncome)}</span>
            </div>
            <div className="flex justify-between text-sky-400">
              <span>(+) Inyecciones de Cambio:</span>
              <span className="font-semibold">+{formatCurrency(financials.totalCashInjections)}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>(-) Gastos de Caja Chica:</span>
              <span className="font-semibold">-{formatCurrency(financials.totalCashExpenses)}</span>
            </div>
            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="text-xs font-bold text-zinc-400 uppercase">
                Efectivo Físico Esperado:
              </span>
              <span className="text-2xl font-black text-white">
                {formatCurrency(financials.expectedCashInDrawer)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Salidas de Caja Chica ({cashExpenses.count})
            </h3>
            <span className="text-xs font-bold text-rose-400">
              -{formatCurrency(cashExpenses.total)}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-48 pr-1">
            {cashExpenses.items.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">
                No hay gastos registrados en este turno.
              </p>
            ) : (
              cashExpenses.items.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/60 text-xs"
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold text-zinc-200 truncate">{exp.description}</p>
                    {exp.supplier && (
                      <p className="text-[10px] text-zinc-500">Prov: {exp.supplier}</p>
                    )}
                  </div>
                  <span className="font-bold text-rose-400 shrink-0">
                    -{formatCurrency(+exp.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};