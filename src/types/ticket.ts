

export interface TicketItemDto {
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
}

export interface TicketPaymentDto {
  method: string;
  amount: number;
  tip: number;
  receivedAmount?: number;
  change?: number;
}

export interface TicketDataDto {
  business: {
    name: string;
    taxId: string;
    address: string;
    phone: string;
  };
  order: {
    id: string;
    shortId: string;
    tableNumber: number;
    zone: string;
    waiter: string;
    openedAt: string | Date;
    closedAt?: string | Date;
  };
  items: TicketItemDto[];
  totals: {
    subtotal: number;
    total: number;
    suggestedTips?: {
      tip10: number;
      tip15: number;
      tip20: number;
    };
  };
  payments?: TicketPaymentDto[];
}

export interface ShiftTicketResponse {
  business: {
    name: string;
    branch: string;
    ticketType: 'CORTE_X' | 'CORTE_Z';
  };
  shift: {
    id: string;
    name: string;
    openedAt: string | Date;
    closedAt?: string | Date;
    openedBy: string;
    closedBy?: string;
  };
  salesSummary: {
    cashSales: number;
    cardSales: number;
    transferSales: number;
    totalSales: number;
    totalTips: number;
    totalTransactions: number;
  };
  cashMovements: {
    initialAmount: number;
    injections: number;
    expenses: number;
  };
  cashReconciliation: {
    expectedInDrawer: number;
    actualReported?: number;
    difference?: number;
    status: string; // 'EN_CURSO' | 'CUADRADA' | 'SOBRANTE' | 'FALTANTE'
  };
  breakdown: {
    expenses: Array<{
      description: string;
      amount: number;
      supplier?: string;
    }>;
  };
}