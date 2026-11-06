This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Dependecias usadas
 1. clsx
 2. tailwind-merge
 3. sonner
 4. lucide-react
 5. zustand
 6. axios
 7. zod

# Providers
1. tanStack Query


```
  pnpm add @tanstack/react-query axios zustand clsx tailwind-merge lucide-react sonner

  pnpm add zod react-hook-form @hookform/resolvers
```

```
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

  const handleActionAndCloseDrawer = async () => {
    await handleConfirmRound();
    setIsMobileCartOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
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
```


```
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Send,
  DollarSign,
  Coffee
} from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
//import { useProducts } from "@/src/hooks/useProducts";
import Loader from "@/src/components/common/Loader";
import { useProducts } from "@/src/hooks/useProducts";

export default function OrderPosPage({
  params
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = use(params);
  const router = useRouter();

  const {
    table,
    categories,
    isLoading,
    addProduct,
    removeProduct,
    updateQuantity,
    setSearchTerm,
    setSelectedCategory,
    filteredProducts,
    grandTotal,
    handleConfirmRound,
    searchTerm,
    selectedCategory,
    products,
    activeOrder,
    draftItems,
    clearDraft,
    sendRound,
    draftTotal,
    servedTotal
  } = useProducts(tableId);

  if (isLoading) {
    return <Loader msg=" Cargando comanda y menú..." />;
  }

 

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-zinc-950">
      {/* ======================================================== */}
      {/* COLUMNA IZQUIERDA: CATÁLOGO Y BUSCADOR (70%)             */}
      {/* ======================================================== */}
      <section className="flex-1 flex flex-col border-r border-zinc-800 bg-zinc-900/40">
        {/* Barra de cabecera con botón volver y buscador */}
        <header className="p-3 border-b border-zinc-800 flex items-center gap-3 bg-zinc-900/90">
          <button
            onClick={() => router.push("/tables")}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Volver a mesas"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar producto (ej. Corona, Mojito, Alitas)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </header>

        {/* Pestañas de categorías con scroll horizontal */}
        <div className="p-2 border-b border-zinc-800/80 bg-zinc-950/60 overflow-x-auto flex gap-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === "ALL"
                ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Grid táctil de productos */}
        <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2  sm:grid-cols-3 md:grid-cols-3  gap-2.5">
          {filteredProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => addProduct(prod)}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/90 hover:border-amber-500/60 hover:bg-zinc-800/60 transition-all text-left active:scale-[0.98] select-none h-28"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-500/90 uppercase tracking-wider block truncate">
                  {prod.category?.title || "Bar"}
                </span>
                <h4 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug">
                  {prod.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
                <span className="text-base font-black text-white">
                  {formatCurrency(prod.price)}
                </span>
                <span className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-amber-500 group-hover:text-zinc-950">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>


      </section>

      {/* ======================================================== */}
      {/* COLUMNA DERECHA: RESUMEN DE COMANDA EN VIVO (30%)        */}
      {/* ======================================================== */}
      <aside className="w-96 flex flex-col bg-zinc-950 border-l border-zinc-800">
        {/* Cabecera de la comanda */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <span className="text-xs font-semibold text-zinc-500 tracking-wider uppercase">
              Mesa de atención
            </span>
            <h2 className="text-xl font-black text-white">
              #{table?.number || tableId.slice(0, 4)}
            </h2>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
              activeOrder
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {activeOrder ? "Ocupada" : "Apertura"}
          </span>
        </div>

        {/* Lista con scroll: Servido + Nueva Ronda */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* A. Ítems ya confirmados y servidos */}
          {activeOrder?.status === 'OPEN' && activeOrder.items.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
                Servido / En barra ({activeOrder.items.length})
              </span>
              <div className="space-y-1.5 opacity-80">
                {activeOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-zinc-900 border border-zinc-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-400">
                        {item.quantity}x
                      </span>
                      <span className="text-zinc-200 font-medium truncate max-w-[140px]">
                        {item.product.title}
                      </span>
                    </div>
                    <span className="font-semibold text-zinc-300">
                      {formatCurrency((item.product.price * item.quantity))}
                      
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. Nueva ronda (Borrador en curso) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                Nueva Ronda ({draftItems.length})
              </span>
              {draftItems.length > 0 && (
                <button
                  onClick={clearDraft}
                  className="text-[10px] text-zinc-500 hover:text-rose-400 font-medium"
                >
                  Limpiar
                </button>
              )}
            </div>

            {draftItems.length === 0 ? (
              <div className="p-6 border border-dashed border-zinc-800/80 rounded-xl text-center">
                <Coffee className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">
                  Toca productos a la izquierda para armar la siguiente ronda.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {draftItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 truncate">
                      <p className="text-xs font-semibold text-zinc-100 truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {formatCurrency(item.product.price)} c/u
                      </p>
                    </div>

                    {/* Controles de incremento y decremento */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeProduct(item.product.id)}
                        className="w-6 h-6 rounded bg-rose-950/40 hover:bg-rose-900/60 flex items-center justify-center text-rose-400 ml-1"
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

        {/* Panel inferior fijo con totales y botones de acción */}
        <footer className="p-4 border-t border-zinc-800 bg-zinc-900/80 space-y-3">
          <div className="space-y-1">
            {activeOrder?.table.status  && (
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
              <span className="text-sm font-bold text-zinc-300">
                Total Mesa
              </span>
              <span className="text-2xl font-black text-white">
                { activeOrder?.table.status === 'OCCUPIED' ? formatCurrency(grandTotal) : formatCurrency(0)}
              </span>
            </div>
          </div>

          {/* Botones táctiles principales */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Si ya hay comanda abierta, permitimos imprimir precuenta o cobrar */}
            {activeOrder?.status ==="OPEN" ? (
              <>
                <button
                  disabled={sendRound.isPending || draftItems.length === 0}
                  onClick={handleConfirmRound}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Mandar Ronda
                </button>

                <button
                  onClick={() => router.push(`/orders/${tableId}/payment`)}
                  className="flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Cobrar Mesa
                </button>
              </>
            ) : (
              /* Si la mesa estaba libre, un botón a ancho completo para abrir comanda */
              <button
                disabled={sendRound.isPending || draftItems.length === 0}
                onClick={handleConfirmRound}
                className="col-span-2 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                {sendRound.isPending
                  ? "Abriendo mesa..."
                  : "Abrir Mesa y Mandar"}
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>
  );
}

```#   B a r S u p e r i o r F r o n t  
 