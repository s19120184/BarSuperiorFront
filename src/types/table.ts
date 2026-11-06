// export enum TableStatus {
//   AVAILABLE = 'AVAILABLE',
//   OCCUPIED = 'OCCUPIED',
// }

import { TableStatus } from "../schemas/table.schema";

export interface ActiveOrderSummary {
  id: string;
  orderNumber?: number;
  total: number;
  itemsCount: number;
  openedAt: string;
}

export interface Table {
  id:        string;
  number:    number;
  capacity:  number;
  zone:      string;
  status:    TableStatus;
  activeOrder?: ActiveOrderSummary | null;
}

export interface TableAPI {
  id:        string;
  number:    number;
  capacity:  number;
  zone:      string;
  status:    TableStatus;
  createdAt: Date;
  updatedAt: Date;
}
