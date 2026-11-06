import { TicketDataDto, ShiftTicketResponse } from '@/src/types/ticket';
import { formatCurrency } from '@/src/lib/utils';

const WIDTH = 48;

class EscPosBuilder {
  private bytes: number[] = [];
  private encoder = new TextEncoder();

  init() {
    this.bytes.push(0x1b, 0x40); // ESC @
    return this;
  }

  align(alignment: 'left' | 'center' | 'right') {
    const code = alignment === 'center' ? 1 : alignment === 'right' ? 2 : 0;
    this.bytes.push(0x1b, 0x61, code);
    return this;
  }

  bold(enable: boolean) {
    this.bytes.push(0x1b, 0x45, enable ? 1 : 0);
    return this;
  }

  doubleSize(enable: boolean) {
    this.bytes.push(0x1d, 0x21, enable ? 0x11 : 0x00);
    return this;
  }

  text(str: string) {
    this.bytes.push(...Array.from(this.encoder.encode(str)));
    return this;
  }

  line(str: string = '') {
    return this.text(str + '\n');
  }

  divider(char = '-') {
    return this.line(char.repeat(WIDTH));
  }

  twoColumns(left: string, right: string) {
    const spaces = Math.max(1, WIDTH - (left.length + right.length));
    return this.line(`${left}${' '.repeat(spaces)}${right}`);
  }

  cut() {
    this.line('\n\n\n');
    this.bytes.push(0x1d, 0x56, 0x42, 0x00); // GS V B 0 (Avance y autocorte)
    return this;
  }

  build(): Uint8Array {
    return new Uint8Array(this.bytes);
  }
}

const formatDate = (date?: string | Date) => {
  if (!date) return '---';
  return new Date(date).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Conversión idéntica a OrderTicketContent / PrecheckContent
export function convertOrderTicketToEscPos(data: TicketDataDto): Uint8Array {
  const { business, order, items, totals, payments } = data;
  const isFinalReceipt = payments && payments.length > 0;
  const p = new EscPosBuilder().init();

  // Encabezado
  p.align('center')
    .doubleSize(true)
    .line(business.name.toUpperCase())
    .doubleSize(false)
    .line(business.address)
    .line(`RFC: ${business.taxId}`)
    .line(`Tel: ${business.phone}`)
    .bold(true)
    .line(isFinalReceipt ? 'RECIBO DE PAGO' : '*** PRE-CUENTA ***')
    .bold(false)
    .divider('-');

  // Metadatos
  p.align('left')
    .twoColumns(`MESA #${order.tableNumber}`, (order.zone || '').toUpperCase())
    .twoColumns(`Folio: #${order.shortId}`, `Mesero: ${order.waiter}`)
    .twoColumns(`Apertura: ${formatDate(order.openedAt)}`, order.closedAt ? `Cierre: ${formatDate(order.closedAt)}` : '')
    .divider('-');

  // Tabla: CANT(5) | CONCEPTO(23) | P.U.(10) | IMPORTE(10)
  p.line('Cant Concepto                 P.U.      Importe')
    .divider('-');

  items.forEach((item) => {
    const qty = `${item.quantity}x`.padEnd(5, ' ');
    const pu = (item.quantity > 1 ? formatCurrency(item.unitPrice) : '').padStart(10, ' ');
    const sub = formatCurrency(item.subtotal).padStart(10, ' ');
    
    let name = item.name;
    if (name.length > 23) name = name.slice(0, 20) + '...';
    name = name.padEnd(23, ' ');

    p.line(`${qty}${name}${pu}${sub}`);
    if (item.notes) {
      p.line(`     * ${item.notes}`);
    }
  });

  p.divider('-');

  // Totales
  p.twoColumns('Subtotal:', formatCurrency(totals.subtotal))
    .bold(true)
    .twoColumns('TOTAL:', formatCurrency(totals.total))
    .bold(false);

  // Desglose de pagos
  if (isFinalReceipt && payments) {
    p.divider('-')
      .bold(true).line('Desglose de Pago:').bold(false);

    payments.forEach((pay) => {
      p.twoColumns(`${pay.method}:`, formatCurrency(pay.amount));
      if (pay.tip > 0) p.twoColumns('  (+) Propina:', formatCurrency(pay.tip));
      if (pay.receivedAmount !== undefined) p.twoColumns('  Efectivo Recibido:', formatCurrency(pay.receivedAmount));
      if (pay.change !== undefined && pay.change > 0) p.twoColumns('  Cambio Devuelto:', formatCurrency(pay.change));
    });
  }

  // Propinas sugeridas
  if (!isFinalReceipt && totals.suggestedTips) {
    p.divider('-')
      .align('center')
      .line('Propinas Sugeridas (Voluntarias)')
      .align('left')
      .twoColumns('10%:', formatCurrency(totals.suggestedTips.tip10))
      .twoColumns('15%:', formatCurrency(totals.suggestedTips.tip15))
      .twoColumns('20%:', formatCurrency(totals.suggestedTips.tip20));
  }

  p.divider('=')
    .align('center')
    .line('¡GRACIAS POR SU PREFERENCIA!')
    .line(isFinalReceipt ? 'Comprobante simplificado sin validez fiscal' : '* Comprobante provisional no fiscal *')
    .cut();

  return p.build();
}

// Conversión idéntica a ShiftTicketContent
export function convertShiftTicketToEscPos(data: ShiftTicketResponse): Uint8Array {
  const { business, shift, salesSummary, cashMovements, cashReconciliation, breakdown } = data;
  const isClosed = business.ticketType === 'CORTE_Z';
  const p = new EscPosBuilder().init();

  p.align('center')
    .doubleSize(true)
    .line(business.name.toUpperCase())
    .doubleSize(false)
    .line(business.branch)
    .bold(true)
    .line(isClosed ? '*** CORTE Z (CIERRE FINAL) ***' : '*** CORTE X (ARQUEO EN CURSO) ***')
    .bold(false)
    .divider('-');

  p.align('left')
    .twoColumns(`TURNO: ${shift.name.toUpperCase()}`, `#${shift.id.slice(0, 6)}`)
    .twoColumns('Apertura:', formatDate(shift.openedAt))
    .twoColumns('Abierto por:', shift.openedBy);

  if (shift.closedAt) {
    p.twoColumns('Cierre:', formatDate(shift.closedAt))
      .twoColumns('Cerrado por:', shift.closedBy || 'N/A');
  }

  p.divider('-')
    .bold(true).line('Resumen de Ventas:').bold(false)
    .twoColumns('(+) Ventas Efectivo:', formatCurrency(salesSummary.cashSales))
    .twoColumns('(+) Ventas Tarjeta:', formatCurrency(salesSummary.cardSales))
    .twoColumns('(+) Ventas Transfer:', formatCurrency(salesSummary.transferSales))
    .divider('-')
    .bold(true).twoColumns('TOTAL VENTAS:', formatCurrency(salesSummary.totalSales)).bold(false);

  if (salesSummary.totalTips > 0) {
    p.twoColumns('Propinas Recibidas:', formatCurrency(salesSummary.totalTips));
  }
  p.twoColumns('Transacciones / Cobros:', `${salesSummary.totalTransactions} ops`)
    .divider('-')
    .bold(true).line('Movimientos de Cajón:').bold(false)
    .twoColumns('(+) Fondo Inicial:', formatCurrency(cashMovements.initialAmount))
    .twoColumns('(+) Inyecciones Cambio:', formatCurrency(cashMovements.injections))
    .twoColumns('(-) Gastos Caja Chica:', formatCurrency(cashMovements.expenses))
    .divider('-')
    .bold(true).twoColumns('EFECTIVO ESPERADO:', formatCurrency(cashReconciliation.expectedInDrawer)).bold(false);

  if (isClosed && cashReconciliation.actualReported !== undefined) {
    p.bold(true).twoColumns('EFECTIVO CONTADO:', formatCurrency(cashReconciliation.actualReported)).bold(false);
    const diffStr = cashReconciliation.difference !== undefined 
      ? ` (${cashReconciliation.difference >= 0 ? '+' : ''}${formatCurrency(cashReconciliation.difference)})`
      : '';
    p.twoColumns('ESTADO / BALANCE:', `${cashReconciliation.status}${diffStr}`);
  }

  if (breakdown.expenses.length > 0) {
    p.divider('-')
      .bold(true).line(`Desglose de Gastos (${breakdown.expenses.length}):`).bold(false);

    breakdown.expenses.forEach((exp) => {
      const desc = exp.supplier && exp.supplier !== 'N/A' 
        ? `${exp.description} (Prov: ${exp.supplier})` 
        : exp.description;
      p.twoColumns(desc.slice(0, 30), formatCurrency(exp.amount));
    });
  }

  p.divider('=')
    .align('center')
    .line(`--- ${isClosed ? 'CIERRE DEFINITIVO' : 'ARQUEO PRELIMINAR'} ---`)
    .line('\n\n___________________________')
    .line('FIRMA RESPONSABLE')
    .cut();

  return p.build();
}