'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Loader2, PackageCheck } from 'lucide-react';

interface CancelOrderItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemTitle: string;
  tableNumber?: number;
  quantity?: number;
  isLoading: boolean;
}

export const CancelOrderItemModal: React.FC<CancelOrderItemModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
  tableNumber,
  quantity = 1,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Cancelar Producto de Comanda
              </h3>
              <p className="text-[11px] text-zinc-400">
                {tableNumber ? `Mesa #${tableNumber}` : 'Orden activa'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-zinc-300 leading-relaxed">
            ¿Estás seguro de que deseas retirar{' '}
            <strong className="text-white font-bold">
              {quantity}x {itemTitle}
            </strong>{' '}
            de la comanda activa?
          </p>

          {/* Aviso sobre inventario */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-zinc-400">
            <PackageCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-zinc-200 block text-[11px]">
                Restitución automática de stock
              </span>
              <span className="text-[11px] text-zinc-400 leading-tight block">
                Las unidades se devolverán al inventario disponible y el balance total de la mesa se recalculará al instante.
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-800 bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center gap-1.5 shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Confirmar Cancelación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};