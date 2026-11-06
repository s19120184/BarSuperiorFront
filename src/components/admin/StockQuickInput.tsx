'use client';

import React from 'react';
import { Minus, Plus, AlertTriangle, Package } from 'lucide-react';

interface StockQuickInputProps {
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}

export const StockQuickInput: React.FC<StockQuickInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const currentStock = Number.isNaN(value) || value < 0 ? 0 : value;

  const handleAdjust = (delta: number) => {
    if (disabled) return;
    const nextVal = Math.max(0, currentStock + delta);
    onChange(nextVal);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    onChange(Number.isNaN(parsed) || parsed < 0 ? 0 : parsed);
  };

  if (disabled) {
    return (
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2">
          <Package className="w-4 h-4 text-zinc-600" />
          Producto de coctelería / preparado
        </span>
        <span className="italic text-[11px]">No aplica stock por pieza</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Decrementadores rápidos */}
        <button
          type="button"
          onClick={() => handleAdjust(-5)}
          disabled={currentStock <= 0}
          className="px-2.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-[11px] font-bold active:scale-95 transition-all"
          title="Restar 5"
        >
          -5
        </button>
        <button
          type="button"
          onClick={() => handleAdjust(-1)}
          disabled={currentStock <= 0}
          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
          title="Restar 1"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Input Central */}
        <div className="relative flex-1">
          <input
            type="number"
            min={0}
            value={currentStock}
            onChange={handleChangeInput}
            className={`w-full bg-zinc-950 border text-center font-black text-sm rounded-xl py-2 px-3 text-white focus:outline-none transition-colors ${
              currentStock === 0
                ? 'border-rose-500/50 text-rose-400 focus:border-rose-500'
                : currentStock < 5
                ? 'border-amber-500/50 text-amber-300 focus:border-amber-500'
                : 'border-zinc-800 focus:border-amber-500'
            }`}
          />
        </div>

        {/* Incrementadores rápidos */}
        <button
          type="button"
          onClick={() => handleAdjust(1)}
          className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white active:scale-95 transition-all"
          title="Sumar 1"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleAdjust(6)}
          className="px-2.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-amber-400 hover:text-amber-300 text-[11px] font-bold active:scale-95 transition-all"
          title="Sumar Six-pack (+6)"
        >
          +6
        </button>
        <button
          type="button"
          onClick={() => handleAdjust(12)}
          className="px-2.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold active:scale-95 transition-all"
          title="Sumar Cartón/Caja (+12)"
        >
          +12
        </button>
      </div>

      {/* Mensaje de advertencia dinámico dentro del modal */}
      {currentStock === 0 ? (
        <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          El producto figurará como agotado en el POS.
        </p>
      ) : currentStock < 5 ? (
        <p className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Stock por debajo del umbral mínimo de seguridad.
        </p>
      ) : null}
    </div>
  );
};