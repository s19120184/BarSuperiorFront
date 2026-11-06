'use client';

import React from 'react';

import { TicketHeader, TicketRow, TicketDivider } from './TicketPrimitives';
import { ShiftTicketResponse } from '@/src/types/ticket';
import { formatCurrency } from '@/src/lib/utils';


export const ShiftTicketContent: React.FC<{ data: ShiftTicketResponse }> = ({ data }) => {
  const { business, shift, salesSummary, cashMovements, cashReconciliation, breakdown } = data;

  const formatDate = (date?: string | Date) => {
    if (!date) return '---';
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isClosed = business.ticketType === 'CORTE_Z';

  return (
    <>
      <TicketHeader
        name={business.name}
        address={business.branch}
        title={isClosed ? '*** CORTE Z (CIERRE FINAL) ***' : '*** CORTE X (ARQUEO EN CURSO) ***'}
      />

      {/* METADATOS DEL TURNO */}
      <div className="py-1.5 text-[11px] space-y-0.5">
        <div className="flex justify-between font-black">
          <span>TURNO: {shift.name.toUpperCase()}</span>
          <span>#{shift.id.slice(0, 6)}</span>
        </div>
        <div className="flex justify-between text-zinc-600 text-[10px]">
          <span>Apertura:</span>
          <span>{formatDate(shift.openedAt)}</span>
        </div>
        <div className="flex justify-between text-zinc-600 text-[10px]">
          <span>Abierto por:</span>
          <span>{shift.openedBy}</span>
        </div>

        {shift.closedAt && (
          <>
            <div className="flex justify-between text-zinc-600 text-[10px]">
              <span>Cierre:</span>
              <span>{formatDate(shift.closedAt)}</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[10px]">
              <span>Cerrado por:</span>
              <span>{shift.closedBy || 'N/A'}</span>
            </div>
          </>
        )}
      </div>

      <TicketDivider />

      {/* RESUMEN DE VENTAS */}
      <div className="space-y-1">
        <span className="font-black text-[10px] uppercase block">Resumen de Ventas:</span>
        <TicketRow label="(+) Ventas Efectivo:" value={salesSummary.cashSales} />
        <TicketRow label="(+) Ventas Tarjeta:" value={salesSummary.cardSales} />
        <TicketRow label="(+) Ventas Transfer:" value={salesSummary.transferSales} />
        <TicketDivider />
        <TicketRow label="TOTAL VENTAS:" value={salesSummary.totalSales} bold />
        {salesSummary.totalTips > 0 && (
          <TicketRow label="Propinas Recibidas:" value={salesSummary.totalTips} small />
        )}
        <div className="flex justify-between text-[10px] text-zinc-600 pt-0.5">
          <span>Transacciones / Cobros:</span>
          <span>{salesSummary.totalTransactions} ops</span>
        </div>
      </div>

      <TicketDivider />

      {/* MOVIMIENTOS DE CAJA */}
      <div className="space-y-1">
        <span className="font-black text-[10px] uppercase block">Movimientos de Cajón:</span>
        <TicketRow label="(+) Fondo Inicial:" value={cashMovements.initialAmount} />
        <TicketRow label="(+) Inyecciones Cambio:" value={cashMovements.injections} />
        <TicketRow label="(-) Gastos Caja Chica:" value={cashMovements.expenses} />
        <TicketDivider />
        <TicketRow
          label="EFECTIVO ESPERADO:"
          value={cashReconciliation.expectedInDrawer}
          bold
        />

        {isClosed && cashReconciliation.actualReported !== undefined && (
          <>
            <TicketRow
              label="EFECTIVO CONTADO:"
              value={cashReconciliation.actualReported}
              bold
            />
            <div className="flex justify-between items-center text-xs font-black pt-1">
              <span>ESTADO / BALANCE:</span>
              <span>
                {cashReconciliation.status}{' '}
                {cashReconciliation.difference !== undefined &&
                  `(${cashReconciliation.difference >= 0 ? '+' : ''}${formatCurrency(
                    cashReconciliation.difference
                  )})`}
              </span>
            </div>
          </>
        )}
      </div>

      {/* DESGLOSE DE GASTOS SI HUBO */}
      {breakdown.expenses.length > 0 && (
        <>
          <TicketDivider />
          <div className="space-y-1">
            <span className="font-black text-[10px] uppercase block">
              Desglose de Gastos ({breakdown.expenses.length}):
            </span>
            {breakdown.expenses.map((exp, idx) => (
              <div key={idx} className="flex justify-between text-[10px] align-top py-0.5">
                <div className="pr-1">
                  <div>- {exp.description}</div>
                  {exp.supplier && exp.supplier !== 'N/A' && (
                    <span className="text-[9px] text-zinc-500">Prov: {exp.supplier}</span>
                  )}
                </div>
                <span className="font-semibold">{formatCurrency(exp.amount)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-center pt-3 text-[9px] text-zinc-600">
        --- {isClosed ? 'CIERRE DEFINITIVO' : 'ARQUEO PRELIMINAR'} ---
      </div>
    </>
  );
};