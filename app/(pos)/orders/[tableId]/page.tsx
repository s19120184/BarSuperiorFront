"use client"

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Plus, Receipt, ChevronUp } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import Loader from "@/src/components/common/Loader";
import { useProducts } from "@/src/hooks/useProducts";
import { OrderContent } from "@/src/components/pos/OrderContent";

export default function OrderPosPage({
  params
}: {
  params: Promise<{ tableId: string }>;
}) {
  const { tableId } = use(params);

  const router = useRouter();

  // Control del drawer/modal de comanda en móviles

  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const {
    table,
    categories,
    isLoading,
    addProduct,
    setSearchTerm,
    setSelectedCategory,
    filteredProducts,
    grandTotal,
    searchTerm,
    selectedCategory,
    products,
    activeOrder,
    draftItems,
    draftTotal
  } = useProducts(tableId);

  if (isLoading) {
    return <Loader msg="Cargando comanda y menú..." />;
  }

  return (
    <div className="relative flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-zinc-950">
      {/* ======================================================== */}
      {/* SECCIÓN CATÁLOGO Y BUSCADOR (IZQUIERDA)                   */}
      {/* ======================================================== */}

      <section className="flex-1 flex flex-col min-w-0 border-r border-zinc-800 bg-zinc-900/40 pb-20 lg:pb-0">
        {/* Cabecera con volver y buscador */}

        <header className="p-2.5 sm:p-3 border-b border-zinc-800 flex items-center gap-2.5 bg-zinc-900/90">
          <button
            onClick={() => router.push("/tables")}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex-shrink-0"
            title="Volver a mesas"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </header>

        {/* Pestañas de categorías con scroll horizontal fluido */}

        <div className="p-2 border-b border-zinc-800/80 bg-zinc-950/60 overflow-x-auto flex gap-1.5 sm:gap-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all ${
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
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Grid adaptable de productos */}

        <div className="flex-1 p-2.5 sm:p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 auto-rows-max">
          {filteredProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => addProduct(prod)}
              className="flex flex-col justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/90 hover:border-amber-500/60 hover:bg-zinc-800/60 transition-all text-left active:scale-[0.97] select-none min-h-[6.5rem] sm:min-h-[7rem]"
            >
              <div>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-500/90 uppercase tracking-wider block truncate">
                  {prod.category?.title || "Bar"}
                </span>

                <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug">
                  {prod.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-800/50">
                <span className="text-sm sm:text-base font-black text-white">
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

      {/* ASIDE ESCRITORIO: COMANDA LATERAL (>= lg)                */}

      {/* ======================================================== */}

      <aside className="hidden lg:flex w-80 xl:w-96 flex-col bg-zinc-950 border-l border-zinc-800 flex-shrink-0">
        <OrderContent
          tableId={tableId}
          setIsMobileCartOpen={setIsMobileCartOpen}
        />
      </aside>

      {/* ======================================================== */}
      {/* BARRA FLOTANTE INFERIOR PARA MÓVILES (< lg)              */}
      {/* ======================================================== */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md flex items-center justify-between z-30">
        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="relative p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Receipt className="w-5 h-5" />

            {draftItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-zinc-950 font-black text-[10px] rounded-full flex items-center justify-center">
                {draftItems.reduce((acc, curr) => acc + curr.quantity, 0)}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] text-zinc-400 font-bold block uppercase">
              Mesa #{table?.number || tableId.slice(0, 4)} • Ver comanda
            </span>

            <span className="text-base font-black text-white">
              {activeOrder?.table?.status === "OCCUPIED"
                ? formatCurrency(grandTotal)
                : formatCurrency(draftTotal)}
            </span>
          </div>
        </button>

        <button
          onClick={() => setIsMobileCartOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <span>Revisar</span>

          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* DRAWER / MODAL DE COMANDA PARA MÓVILES (< lg)            */}
      {/* ======================================================== */}

      {isMobileCartOpen && (
        <div className="lg:hidden w-full fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full h-[88vh] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            <OrderContent
              tableId={tableId}
              setIsMobileCartOpen={setIsMobileCartOpen}
            />
          </div>
        </div>
      )}
    </div>
  );
}
