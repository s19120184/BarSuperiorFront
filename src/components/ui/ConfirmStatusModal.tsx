'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X, Loader2 } from 'lucide-react';

interface ConfirmStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  itemName: string;
  isActive: boolean; // Estado actual del elemento
  isLoading?: boolean;
  itemType?: string; // 'producto' | 'categoría' | 'insumo'
}

export const ConfirmStatusModal: React.FC<ConfirmStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isActive,
  isLoading = false,
  itemType = 'producto',
}) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  // Si está activo, la acción será desactivarlo (advertencia roja/ámbar)
  // Si está inactivo, la acción será reactivarlo (positiva verde)
  const isDeactivating = isActive;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl border ${
                isDeactivating
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {isDeactivating ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {isDeactivating ? `Desactivar ${itemType}` : `Reactivar ${itemType}`}
              </h3>
              <p className="text-[10px] text-zinc-400">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido / Advertencia de Soft Delete */}
        <div className="p-6 space-y-3 text-xs">
          <p className="text-zinc-300 leading-relaxed">
            ¿Estás seguro de que deseas {isDeactivating ? 'desactivar' : 'reactivar'}{' '}
            <strong className="text-white font-bold">`{itemName}`</strong>?
          </p>

          <div
            className={`p-3 rounded-xl border ${
              isDeactivating
                ? 'bg-zinc-950/70 border-zinc-800 text-zinc-400'
                : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
            }`}
          >
            {isDeactivating ? (
              <p className="text-[11px] leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-0.5">
                  Nota sobre el historial:
                </span>
                El {itemType} <strong>no se eliminará de la base de datos</strong>. Se conservará
                en los registros contables y ventas pasadas, pero{' '}
                <span className="text-zinc-200">dejará de mostrarse en el menú del punto de venta (POS)</span>.
              </p>
            ) : (
              <p className="text-[11px] leading-relaxed">
                El {itemType} volverá a estar disponible inmediatamente en el catálogo y comandas
                del salón.
              </p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-800 bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
              isDeactivating
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isLoading
              ? 'Procesando...'
              : isDeactivating
              ? `Desactivar ${itemType}`
              : `Reactivar ${itemType}`}
          </button>
        </div>
      </div>
    </div>
  );
};