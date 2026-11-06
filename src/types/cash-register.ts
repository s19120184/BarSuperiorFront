import { Expense } from "./expense";


export interface ShiftAuditResponse {
    shiftInfo:      ShiftInfo;
    income:         Income;
    cashInjections: Cash;
    cashExpenses:   Cash;
    financials:     Financials;
    reconciliation: null;
}

export interface Cash {
    total: number;
    count: number;
    items: Expense[];
}

export interface Financials {
    initialAmount:        number;
    totalCashIncome:      number;
    totalCashInjections:  number;
    totalCashExpenses:    number;
    expectedCashInDrawer: number;
}

export interface Income {
    cash:              number;
    card:              number;
    transfer:          number;
    totalSales:        number;
    totalTips:         number;
    totalTransactions: number;
}

export interface ShiftInfo {
    id:            string;
    name:          string;
    openedAt:      Date;
    openedBy:      string;
    initialAmount: number;
}

// export interface ShiftAuditResponse {
//   business: {
//     name: string;
//     branch: string;
//     ticketType: 'CORTE_X' | 'CORTE_Z';
//   };
//   shift: {
//     id: string;
//     name: string;
//     openedAt: string;
//     closedAt?: string | null;
//     openedBy: string;
//     closedBy?: string | null;
//   };
//   salesSummary: {
//     cashSales: number;
//     cardSales: number;
//     transferSales: number;
//     totalSales: number;
//     totalTips: number;
//     totalTransactions: number;
//   };
//   cashMovements: {
//     initialAmount: number;
//     injections: number;
//     expenses: number;
//   };
//   cashReconciliation: {
//     expectedInDrawer: number;
//     actualReported?: number | null;
//     difference?: number | null;
//     status: 'EN_CURSO' | 'CUADRADA' | 'SOBRANTE' | 'FALTANTE';
//   };
//   breakdown: {
//     expenses: Array<{
//       description: string;
//       amount: number;
//       supplier?: string;
//     }>;
//   };
// }