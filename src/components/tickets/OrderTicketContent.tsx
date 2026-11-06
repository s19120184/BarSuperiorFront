'use client';

import React from 'react';

import { TicketHeader, TicketRow, TicketDivider, TicketFooter } from './TicketPrimitives';
import { TicketDataDto } from '@/src/types/ticket';
import { formatCurrency } from '@/src/lib/utils';


export const OrderTicketContent: React.FC<{ data: TicketDataDto }> = ({ data }) => {
  const { business, order, items, totals, payments } = data;
  
  const isFinalReceipt = payments && payments.length > 0;

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <TicketHeader
        name={business.name}
        address={business.address}
        taxId={business.taxId}
        phone={business.phone}
        title={isFinalReceipt ? 'RECIBO DE PAGO' : '*** PRE-CUENTA ***'}
      />

      {/* METADATOS */}
      <div className="py-1.5 text-[11px] space-y-0.5">
        <div className="flex justify-between font-black text-sm">
          <span>MESA #{order.tableNumber}</span>
          <span>{order.zone?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-zinc-600 text-[10px]">
          <span>Folio: #{order.shortId}</span>
          <span>Mesero: {order.waiter}</span>
        </div>
        <div className="flex justify-between text-zinc-500 text-[9px]">
          <span>Apertura: {formatDate(order.openedAt)}</span>
          {order.closedAt && <span>Cierre: {formatDate(order.closedAt)}</span>}
        </div>
      </div>

      <TicketDivider />

      {/* DETALLE DE PRODUCTOS */}
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="border-b border-black text-[10px] uppercase font-bold">
            <th className="w-7 text-center pb-1">Cant</th>
            <th className="pb-1">Concepto</th>
            <th className="text-right pb-1">Importe</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-zinc-200">
          {items.map((item, idx) => (
            <tr key={idx} className="align-top">
              <td className="text-center font-bold py-1">{item.quantity}</td>
              <td className="py-1 pr-1">
                <div className="font-semibold">{item.name}</div>
                {item.quantity > 1 && (
                  <div className="text-[9px] text-zinc-500">
                    P.U. {formatCurrency(item.unitPrice)}
                  </div>
                )}
                {item.notes && (
                  <div className="text-[9px] italic text-zinc-600 font-sans">* {item.notes}</div>
                )}
              </td>
              <td className="text-right font-semibold py-1">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TicketDivider />

      {/* TOTALES */}
      <div className="space-y-1">
        <TicketRow label="Subtotal:" value={totals.subtotal} />
        <TicketRow label="TOTAL:" value={totals.total} bold />
      </div>

      {/* SI ES RECIBO: MÉTODOS DE PAGO UTILIZADOS */}
      {isFinalReceipt && (
        <>
          <TicketDivider />
          <div className="space-y-1">
            <span className="font-bold text-[10px] uppercase block">Desglose de Pago:</span>
            {payments.map((p, idx) => (
              <div key={idx} className="space-y-0.5 text-[11px]">
                <div className="flex justify-between font-semibold">
                  <span>{p.method}:</span>
                  <span>{formatCurrency(p.amount)}</span>
                </div>
                {p.tip > 0 && <TicketRow label="(+) Propina:" value={p.tip} small />}
                {p.receivedAmount !== undefined && (
                  <TicketRow label="Efectivo Recibido:" value={p.receivedAmount} small />
                )}
                {p.change !== undefined && p.change > 0 && (
                  <TicketRow label="Cambio Devuelto:" value={p.change} bold />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* SI ES PRE-CUENTA: PROPINAS SUGERIDAS */}
      {!isFinalReceipt && totals.suggestedTips && (
        <>
          <TicketDivider />
          <div className="text-[10px] space-y-0.5">
            <span className="font-bold block text-center uppercase text-[9px]">
              Propinas Sugeridas (Voluntarias)
            </span>
            <TicketRow label="10%:" value={totals.suggestedTips.tip10} small />
            <TicketRow label="15%:" value={totals.suggestedTips.tip15} small />
            <TicketRow label="20%:" value={totals.suggestedTips.tip20} small />
          </div>
          <div className="text-center pt-2 text-[9px] text-zinc-500 italic">
            * Comprobante provisional no fiscal *
          </div>
        </>
      )}

      {isFinalReceipt && <TicketFooter />}
    </>
  );
};