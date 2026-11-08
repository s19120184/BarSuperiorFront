'use client';

import React from 'react';
import Link from 'next/link';
import {
  Receipt,
  UtensilsCrossed,
  ArrowRight,
  Search,
  DollarSign,
  Trash2,
} from 'lucide-react';
import GlobalHeaders from '@/src/components/ui/GlobalHeaders';
import { useAdminOrders } from '@/src/hooks/orders/useAdminOrders';
import { CancelOrderItemModal } from '@/src/components/ui/CancelOrderItemModal';


export default function OrdersAdminPage() {
  const {
    orders,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    targetItem,
    openCancelModal,
    closeCancelModal,
    handleConfirmCancel,
    isCancelling,
  } = useAdminOrders();

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlobalHeaders
          title="Comandas Activas en Salón"
          description="Monitoreo de órdenes en curso, productos servidos y balances pendientes de cobro"
        />

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por mesa o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              Comandas en Curso
            </span>
            <span className="text-xl font-black text-white">
              {stats.totalOrders} mesas activas
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-zinc-500 block">
              Artículos Servidos
            </span>
            <span className="text-xl font-black text-zinc-200">
              {stats.totalItems} productos
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-500/80 block">
              Balance Pendiente
            </span>
            <span className="text-xl font-black text-emerald-400">
              ${stats.totalRevenue.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid de Comandas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <Receipt className="w-10 h-10 text-zinc-600 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-zinc-300">
            No hay comandas activas
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Todas las cuentas se encuentran saldadas o no se encontraron comandas con el filtro aplicado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => {
            const itemsCount =
              order.items?.reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0
              ) || 0;

            return (
              <div
                key={order.id}
                className="group flex flex-col justify-between rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700/80 transition-all shadow-xl overflow-hidden"
              >
                {/* Cabecera */}
                <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-black text-sm">
                      #{order.table?.number}
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-white">
                        Mesa {order.table?.number}
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    {order.status || 'Abierta'}
                  </span>
                </div>

                {/* Lista de productos desglosados */}
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 mb-2">
                    <span>Detalle de Consumo</span>
                    <span className="text-zinc-500 font-medium">{itemsCount} art.</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/40 hover:border-zinc-700/60 transition-colors group/item"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded px-1 text-[11px] font-black bg-zinc-800 text-amber-400">
                            {item.quantity}x
                          </span>
                          <span className="truncate text-zinc-300 font-medium">
                            {item.product?.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-zinc-400 text-[11px]">
                            $
                            {(
                              Number(item.product?.price || 0) *
                              Number(item.quantity || 1)
                            ).toFixed(2)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              openCancelModal({
                                orderId: order.id,
                                itemId: item.id,
                                itemTitle: item.product?.title || 'este producto',
                                tableNumber: +order.table.number,
                                tableId: order.table?.id, // <-- Enviar el id de la mesa
                                quantity: item.quantity,
                              })
                            }
                            title="Cancelar este producto"
                            className="p-1 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie con Total y Enlace al Cobro */}
                <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-zinc-500 block">
                      Total a Liquidar
                    </span>
                    <span className="text-lg font-black text-white font-mono">
                      ${Number(order.total || 0).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order.table?.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    Ver Comanda
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmación de Cancelación */}
      <CancelOrderItemModal
        isOpen={Boolean(targetItem)}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
        itemTitle={targetItem?.itemTitle || ''}
        tableNumber={targetItem?.tableNumber}
        quantity={targetItem?.quantity}
        isLoading={isCancelling}
      />
    </div>
  );
}