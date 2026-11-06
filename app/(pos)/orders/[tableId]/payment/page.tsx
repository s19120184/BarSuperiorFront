'use client';

import React, { use } from 'react';
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { usePaymentProcess } from '@/src/hooks/payments/usePaymentProcess';
import { formatCurrency } from '@/src/lib/utils';

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = use(params);

  const { order, isLoading, isProcessing, financials, form, actions } =
    usePaymentProcess(tableId);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col h-[calc(100dvh-3.5rem)] items-center justify-center bg-zinc-950 gap-4">
        <p className="text-zinc-400">No hay comanda activa para cobrar en esta mesa.</p>
        <button
          onClick={actions.goToTables}
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
        >
          Volver a mesas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={actions.goBackToOrder}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Cobro y Liquidación
            </span>
            <h1 className="text-2xl font-black text-white">
              Mesa #{order.table?.tableNumber || tableId.slice(0, 3)}
            </h1>
          </div>
        </div>

        <button
          onClick={actions.printPrecuenta}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-bold transition-all"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Imprimir</span> Precuenta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* COLUMNA IZQUIERDA: RESUMEN Y PROPINA                     */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* Desglose de totales */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Resumen de Cuenta
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>Consumo alimentos y bebidas:</span>
                <span className="font-semibold">
                  {formatCurrency(financials.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Propina agregada:</span>
                <span className="font-semibold">
                  +{formatCurrency(financials.tipAmount)}
                </span>
              </div>
              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total a Cobrar:</span>
                <span className="text-3xl font-black text-emerald-400">
                  {formatCurrency(financials.totalToPay)}
                </span>
              </div>
            </div>
          </div>

          {/* Selector de propina */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Propina Sugerida
              </h2>
              {financials.tipAmount > 0 && (
                <button
                  onClick={actions.clearTip}
                  className="text-[11px] text-zinc-500 hover:text-rose-400 font-medium transition-colors"
                >
                  Quitar propina
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  onClick={() => actions.selectTipPercentage(pct)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    form.tipPercentage === pct && form.customTip === ''
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {pct === 0 ? 'Sin prop.' : `${pct}%`}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] text-zinc-500 block mb-1">
                O ingresa un monto personalizado ($):
              </label>
              <input
                type="number"
                placeholder="Ej. 50"
                value={form.customTip}
                onChange={(e) => actions.setCustomTip(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMNA DERECHA: MÉTODO DE PAGO Y CÁLCULO DE CAMBIO      */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {/* Selector de método */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Método de Pago
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => form.setMethod('CASH')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold gap-1.5 transition-all ${
                  form.method === 'CASH'
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5" />
                Efectivo
              </button>

              <button
                onClick={() => form.setMethod('CARD')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold gap-1.5 transition-all ${
                  form.method === 'CARD'
                    ? 'border-sky-500 bg-sky-950/20 text-sky-400'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Tarjeta
              </button>

              <button
                onClick={() => form.setMethod('TRANSFER')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold gap-1.5 transition-all ${
                  form.method === 'TRANSFER'
                    ? 'border-purple-500 bg-purple-950/20 text-purple-400'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="w-5 h-5" />
                Transf.
              </button>
            </div>
          </div>

          {/* Bloque exclusivo para efectivo */}
          {form.method === 'CASH' && (
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Efectivo Recibido
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.cashReceived}
                  onChange={(e) => form.setCashReceived(e.target.value)}
                  className="w-full text-2xl font-black bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Botones rápidos de denominación */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-500">Monto exacto o billetes:</span>
                <div className="flex flex-wrap gap-2">
                  {financials.quickCashAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => form.setCashReceived(amt.toString())}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-zinc-700/60 transition-colors"
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cálculo dinámico de cambio */}
              <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-zinc-300">Cambio a entregar:</span>
                <span
                  className={`text-2xl font-black ${
                    financials.numCashReceived >= financials.totalToPay
                      ? 'text-emerald-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {formatCurrency(financials.changeDue)}
                </span>
              </div>
            </div>
          )}

          {/* Botón de confirmación final */}
          <button
            disabled={!financials.isCashSufficient || isProcessing}
            onClick={actions.processPayment}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950/30"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isProcessing
              ? 'Procesando cobro...'
              : `Liquidar Cuenta (${formatCurrency(financials.totalToPay)})`}
          </button>
        </div>
      </div>
    </div>
  );
}