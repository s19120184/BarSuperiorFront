

import React from 'react';

import { TicketHeader, TicketRow, TicketDivider } from './TicketPrimitives';
import { TicketDataDto } from '@/src/types/ticket';
import { formatCurrency } from '@/src/lib/utils';



//Para que el mesero imprima el total acumulado en mesa antes de cobrar:
export const PrecheckContent: React.FC<{ data: TicketDataDto }> = ({ data }) => {
  const { business, order, items, totals } = data;

  return (
    <>
      <TicketHeader name={business.name} phone={business.phone} title="*** PRE-CUENTA ***" />

      <div className="py-1.5 text-[11px] space-y-0.5">
        <div className="flex justify-between font-black text-sm">
          <span>MESA #{order.tableNumber}</span>
          <span>{order.zone.toUpperCase()}</span>
        </div>
        <div className="flex justify-between text-zinc-600 text-[10px]">
          <span>Folio: #{order.shortId}</span>
          <span>Mesero: {order.waiter}</span>
        </div>
      </div>

      <TicketDivider />

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
              <td className="py-1">{item.name}</td>
              <td className="text-right font-semibold py-1">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TicketDivider />

      <div className="space-y-1">
        <TicketRow label="Subtotal:" value={totals.subtotal} />
        <TicketRow label="TOTAL ACUMULADO:" value={totals.total} bold />
      </div>

      {totals.suggestedTips && (
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
        </>
      )}

      <div className="text-center pt-2 text-[9px] text-zinc-500 italic">
        * No es un comprobante de pago definitivo *
      </div>
    </>
  );
};