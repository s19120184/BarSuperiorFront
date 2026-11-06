'use client';

import { formatCurrency } from '@/src/lib/utils';
import { TicketDataDto } from '@/src/types/ticket';
import React from 'react';

interface ThermalTicketProps {
  data: TicketDataDto;
  isKitchenView?: boolean;
}

export const ThermalTicket: React.FC<ThermalTicketProps> = ({
  data,
  isKitchenView = false,
}) => {
  const { business, order, items, totals, payments } = data;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="thermal-ticket-container font-mono text-[12px] leading-tight text-black bg-white p-4 max-w-[80mm] mx-auto select-none">
      {/* Estilos CSS exclusivos para impresión en 80mm */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .thermal-ticket-container {
            width: 78mm !important;
            max-width: 78mm !important;
            padding: 4mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* ENCABEZADO: Datos del Bar */}
      {!isKitchenView ? (
        <div className="text-center space-y-1 pb-2 border-b border-dashed border-black">
          <h1 className="text-base font-black uppercase tracking-wider">{business.name}</h1>
          <p className="text-[10px]">{business.address}</p>
          <p className="text-[10px]">RFC: {business.taxId}</p>
          <p className="text-[10px]">Tel: {business.phone}</p>
        </div>
      ) : (
        <div className="text-center pb-2 border-b border-black">
          <h1 className="text-lg font-black uppercase">*** COMANDA BARRA ***</h1>
        </div>
      )}

      {/* METADATOS: Mesa, Mesero, Folio y Fechas */}
      <div className="py-2 border-b border-dashed border-black text-[11px] space-y-0.5">
        <div className="flex justify-between items-center text-sm font-black">
          <span>MESA #{order.tableNumber}</span>
          <span>{order.zone.toUpperCase()}</span>
        </div>
        <div className="flex justify-between">
          <span>Folio: #{order.shortId}</span>
          <span>Mesero: {order.waiter}</span>
        </div>
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>Apertura:</span>
          <span>{formatDate(order.openedAt)}</span>
        </div>
        {order.closedAt && (
          <div className="flex justify-between text-[10px] text-zinc-600">
            <span>Cierre:</span>
            <span>{formatDate(order.closedAt)}</span>
          </div>
        )}
      </div>

      {/* LISTA DE ARTÍCULOS / RONDAS */}
      <div className="py-2 border-b border-dashed border-black">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black text-[10px] uppercase font-bold">
              <th className="w-8 text-center pb-1">Cant</th>
              <th className="pb-1">Concepto</th>
              {!isKitchenView && <th className="text-right pb-1">Importe</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-zinc-200">
            {items.map((item, idx) => (
              <tr key={idx} className="align-top">
                <td className="text-center font-bold py-1.5">{item.quantity}</td>
                <td className="py-1.5 pr-1">
                  <div className="font-semibold">{item.name}</div>
                  {!isKitchenView && item.quantity > 1 && (
                    <div className="text-[10px] text-zinc-500">
                      P.U. {formatCurrency(item.unitPrice)}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[10px] italic font-sans font-bold bg-zinc-100 p-0.5 mt-0.5 rounded">
                      * {item.notes}
                    </div>
                  )}
                </td>
                {!isKitchenView && (
                  <td className="text-right font-bold py-1.5">
                    {formatCurrency(item.subtotal)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTALES Y PAGOS (Solo si no es vista de cocina) */}
      {!isKitchenView && (
        <>
          <div className="py-2 border-b border-dashed border-black space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1 border-t border-black">
              <span>TOTAL:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>

          {/* REGISTRO DE PAGOS / LIQUIDACIÓN */}
          {payments && payments.length > 0 && (
            <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
              <span className="font-bold text-[10px] uppercase block">Forma de Pago:</span>
              {payments.map((p, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span>{p.method}:</span>
                    <span>{formatCurrency(p.amount)}</span>
                  </div>
                  {p.tip > 0 && (
                    <div className="flex justify-between text-zinc-600">
                      <span>(+) Propina:</span>
                      <span>{formatCurrency(p.tip)}</span>
                    </div>
                  )}
                  {p.receivedAmount !== undefined && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Efectivo Recibido:</span>
                      <span>{formatCurrency(p.receivedAmount)}</span>
                    </div>
                  )}
                  {p.change !== undefined && p.change > 0 && (
                    <div className="flex justify-between font-bold">
                      <span>Cambio:</span>
                      <span>{formatCurrency(p.change)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROPINAS SUGERIDAS (Para pre-cuenta / ticket informativo) */}
          {totals.suggestedTips && (!payments || payments.length === 0) && (
            <div className="py-2 border-b border-dashed border-black text-[10px] space-y-1">
              <span className="font-bold block text-center uppercase">Propinas Sugeridas (Voluntarias)</span>
              <div className="flex justify-between">
                <span>10%: {formatCurrency(totals.suggestedTips.tip10)}</span>
                <span>15%: {formatCurrency(totals.suggestedTips.tip15)}</span>
                <span>20%: {formatCurrency(totals.suggestedTips.tip20)}</span>
              </div>
            </div>
          )}

          {/* PIE DE TICKET */}
          <div className="text-center pt-3 space-y-1 text-[10px]">
            <p className="font-bold">¡GRACIAS POR SU PREFERENCIA!</p>
            <p className="text-[9px] text-zinc-500">Este comprobante no es deducible fiscalmente.</p>
          </div>
        </>
      )}
    </div>
  );
};