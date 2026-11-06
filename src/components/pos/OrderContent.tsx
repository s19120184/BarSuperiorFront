

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Coffee, DollarSign, Minus, Plus, Send, Trash2, X } from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";
import { formatCurrency } from "@/src/lib/utils";

interface Props {
  tableId: string;
  setIsMobileCartOpen: Dispatch<SetStateAction<boolean>>;
}

export const OrderContent = ({ tableId, setIsMobileCartOpen }: Props) => {
  const router = useRouter(); // 👈 Hook oficial de Next.js App Router

  const {
    table,
    removeProduct,
    updateQuantity,
    grandTotal,
    handleConfirmRound,
    activeOrder,
    draftItems,
    clearDraft,
    sendRound,
    draftTotal,
    servedTotal,
  } = useProducts(tableId);

  const tableNumber = table?.number || tableId.slice(0, 4);

  const handleActionAndCloseDrawer = () => {
     handleConfirmRound();
    setIsMobileCartOpen(false);
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Cabecera de la comanda */}
      <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div>
          <span className="text-[11px] font-semibold text-zinc-500 tracking-wider uppercase block">
            Mesa de atención
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white">
            #{tableNumber}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${
              activeOrder
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {activeOrder ? "Ocupada" : "Apertura"}
          </span>

          {/* Botón cerrar sólo en drawer móvil */}
          <button
            onClick={() => setIsMobileCartOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista con scroll: Servido + Nueva Ronda */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
        {/* A. Ítems ya confirmados y servidos */}
        {activeOrder?.status === "OPEN" && activeOrder.items.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
              Servido / En barra ({activeOrder.items.length})
            </span>
            <div className="space-y-1.5 opacity-80">
              {activeOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-900 border border-zinc-800/50"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-bold text-zinc-400">
                      {item.quantity}x
                    </span>
                    <span className="text-zinc-200 font-medium truncate">
                      {item.product.title}
                    </span>
                  </div>
                  <span className="font-semibold text-zinc-300 whitespace-nowrap">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* B. Nueva ronda (Borrador en curso) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-500">
              Nueva Ronda ({draftItems.length})
            </span>
            {draftItems.length > 0 && (
              <button
                onClick={clearDraft}
                className="text-[10px] text-zinc-500 hover:text-rose-400 font-medium transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {draftItems.length === 0 ? (
            <div className="p-6 border border-dashed border-zinc-800/80 rounded-xl text-center">
              <Coffee className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
              <p className="text-xs text-zinc-500">
                Toca productos del menú para armar la siguiente ronda.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {draftItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-semibold text-zinc-100 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      {formatCurrency(item.product.price)} c/u
                    </p>
                  </div>

                  {/* Controles de incremento y decremento */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 active:scale-95 transition-transform"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 active:scale-95 transition-transform"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeProduct(item.product.id)}
                      className="w-6 h-6 rounded bg-rose-950/40 hover:bg-rose-900/60 flex items-center justify-center text-rose-400 ml-1 active:scale-95 transition-transform"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel inferior fijo con totales y botones */}
      <footer className="p-3.5 sm:p-4 border-t border-zinc-800 bg-zinc-900/90 space-y-3">
        <div className="space-y-1">
          {activeOrder?.table?.status && (
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Servido acumulado:</span>
              <span>{formatCurrency(servedTotal)}</span>
            </div>
          )}
          {draftItems.length > 0 && (
            <div className="flex justify-between text-xs text-amber-400">
              <span>Ronda en curso:</span>
              <span>+{formatCurrency(draftTotal)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-zinc-800">
            <span className="text-xs sm:text-sm font-bold text-zinc-300">
              Total Mesa
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">
              {activeOrder?.table?.status === "OCCUPIED"
                ? formatCurrency(grandTotal)
                : formatCurrency(draftTotal)}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {activeOrder?.status === "OPEN" ? (
            <>
              <button
                disabled={sendRound.isPending || draftItems.length === 0}
                onClick={handleActionAndCloseDrawer}
                className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Mandar Ronda
              </button>

              <button
                onClick={() => router.push(`/orders/${tableId}/payment`)}
                className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all active:scale-95"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Cobrar Mesa
              </button>
            </>
          ) : (
            <button
              disabled={sendRound.isPending || draftItems.length === 0}
              onClick={handleActionAndCloseDrawer}
              className="col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Send className="w-4 h-4" />
              {sendRound.isPending ? "Abriendo mesa..." : "Abrir Mesa y Mandar"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};