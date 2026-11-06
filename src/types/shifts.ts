export enum ShiftStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type BalanceStatus = 'EN_CURSO' | 'CUADRADA' | 'SOBRANTE' | 'FALTANTE';

export interface ShiftFinancials {
  initialAmount: number;
  expectedAmount: number;
  actualAmount: number | null;
  difference: number | null;
  balanceStatus: BalanceStatus;
}

export interface ShiftHistoryItem {
  id: string;
  name: string;
  status: ShiftStatus;
  openedAt: string;
  closedAt: string | null;
  openedBy: string;
  closedBy: string;
  financials: ShiftFinancials;
  notes: string | null;
}

export interface ShiftHistoryResponse {
  total: number;
  limit: number;
  offset: number;
  shifts: ShiftHistoryItem[];
}

export interface QueryShiftsParams {
  startDate?: string;
  endDate?: string;
  status?: ShiftStatus;
  limit?: number;
  offset?: number;
}