'use client';

import { DENOMINATIONS } from '@/src/hooks/useCloseShift';
import { formatCurrency } from '@/src/lib/utils';
import React from 'react';

interface CashCounterGridProps {
  counts: Record<number, number>;
  onChange: (denom: number, count: number) => void;
}

export const CashCounterGrid: React.FC<CashCounterGridProps> = ({ counts, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
        Conteo Físico por Denominación
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DENOMINATIONS.map(({ label, value }) => {
          const count = counts[value] || 0;
          const subtotal = count * value;

          return (
            <div
              key={value}
              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800"
            >
              <div>
                <span className="text-sm font-bold text-white block">{label}</span>
                <span className="text-[11px] text-zinc-500">
                  Subtotal: {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={count === 0 ? '' : count}
                  placeholder="0"
                  onChange={(e) => onChange(value, parseInt(e.target.value, 10) || 0)}
                  className="w-16 bg-zinc-950 border border-zinc-700/80 rounded-xl px-2.5 py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-zinc-500 font-medium w-6 text-left">pzs</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};