

'use client';

import React, { useEffect, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrderTicketContent } from '@/src/components/tickets/OrderTicketContent';
import { ShiftTicketContent } from '@/src/components/tickets/ShiftTicketContent';
import { ThermalShell } from '@/src/components/tickets/ThermalShell';
import { api } from '@/src/lib/api-client';
import { TicketDataDto, ShiftTicketResponse } from '@/src/types/ticket';


interface PrintParams {
  type: 'precheck' | 'receipt' | 'corte-z';
  id: string;
}

export default function GenericThermalPrintPage({
  params,
}: {
  params: Promise<PrintParams>;
}) {
  const { type, id } = use(params);

  // Mapeo directo a los endpoints de tu NestJS
  const getEndpoint = () => {
    switch (type) {
      case 'precheck':
        return `/tickets/precheck/${id}`;
      case 'receipt':
        return `/tickets/receipt/${id}`;
      case 'corte-z':
        return `/tickets/corte-z/${id}`;
      default:
        throw new Error('Tipo de ticket no soportado');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['print-ticket', type, id],
    queryFn: async () => {
      const { data } = await api.get(getEndpoint());
      return data;
    },
  });

  // Lanzar la ventana nativa de impresión una vez cargados los datos
  useEffect(() => {
    if (data && !isLoading) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs text-zinc-500">
        Preparando impresión de ticket...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col h-screen items-center justify-center font-mono text-xs text-rose-500 gap-2 p-4 text-center">
        <p>No se pudo cargar la información para imprimir.</p>
        <button
          onClick={() => window.close()}
          className="px-3 py-1 bg-zinc-800 text-white rounded text-[11px]"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }

  return (
    <ThermalShell>
      {(type === 'precheck' || type === 'receipt') && (
        <OrderTicketContent data={data as TicketDataDto} />
      )}
      {type === 'corte-z' && <ShiftTicketContent data={data as ShiftTicketResponse} />}
    </ThermalShell>
  );
}