import { z } from 'zod';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  INACTIVE = 'INACTIVE',
}

export const tableSchema = z.object({
  number: z
    .number({ error: 'El número de mesa es obligatorio' })
    .int('Debe ser un número entero')
    .positive('El número debe ser mayor a 0'),
  capacity: z
    .number()
    .int('La capacidad debe ser un entero')
    .positive('La capacidad mínima es de 1 persona')
    .default(4),
  zone: z
    .string()
    .min(2, 'La zona debe tener al menos 2 caracteres')
    .default('Salón'),
  status: z.enum(TableStatus).default(TableStatus.AVAILABLE),
});

export type TableFormValues = z.infer<typeof tableSchema>;
export type TableFormInput = z.input<typeof tableSchema>;

export interface TableItem {
  id: string;
  number: number;
  capacity: number;
  zone: string;
  status: TableStatus;
}