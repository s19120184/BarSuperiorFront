'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Printer, ArrowLeft, UtensilsCrossed, Receipt, RefreshCw } from 'lucide-react';
import { TicketDataDto } from '@/src/types/ticket';
import { api } from '@/src/lib/api-client';
import { ThermalTicket } from '@/src/components/tickets/ThermalTicket';

export default function TicketViewerPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const router = useRouter();
  const [isKitchenView, setIsKitchenView] = useState(false);

  const { data: ticketData, isLoading, refetch, isRefetching } = useQuery<TicketDataDto>({
    queryKey: ['ticket', orderId],
    queryFn: async () => {
      const { data } = await api.get<TicketDataDto>(`/tickets/receipt/${orderId}`);
      return data;
    },
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-zinc-950 text-zinc-400 gap-4">
        <p>No se encontraron datos para este ticket.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-sm"
        >
          Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 flex flex-col items-center">
      {/* BARRA DE HERRAMIENTAS (Oculta al imprimir gracias a 'no-print') */}
      <div className="no-print w-full max-w-[80mm] mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              title="Refrescar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir Ticket
            </button>
          </div>
        </div>

        {/* Selector de tipo de vista */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsKitchenView(false)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              !isKitchenView ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Cliente / Cobro
          </button>
          <button
            type="button"
            onClick={() => setIsKitchenView(true)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
              isKitchenView ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Comanda Barra
          </button>
        </div>
      </div>

      {/* VISTA PREVIA DEL TICKET (Fondo blanco simulando papel térmico) */}
      <div className="shadow-2xl rounded-sm overflow-hidden border border-zinc-800 bg-white">
        <ThermalTicket data={ticketData} isKitchenView={isKitchenView} />
      </div>
    </div>
  );
}