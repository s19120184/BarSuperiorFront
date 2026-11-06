import { z } from 'zod';

// Helper reutilizable para campos numéricos en formularios
const numericField = (errorMessage = 'Ingresa un monto válido') =>
  z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .pipe(
      z.number({ error: errorMessage })
    );

// 1. Apertura de turno
export const openShiftSchema = z.object({
  shiftName: z
    .string()
    .min(3, 'El nombre del turno debe tener al menos 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  initialAmount: z
    .number({ error: 'Ingresa un monto válido' })
    .min(0, 'El fondo inicial no puede ser negativo')
    .max(50000, 'El monto excede el límite permitido'),
});

// 2. Gastos de caja chica
export const expenseSchema = z.object({
  description: z
    .string({ error: 'El concepto es obligatorio' })
    .min(3, 'El concepto debe tener al menos 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),

  amount: z
    .number({ error: 'Ingresa un monto válido' })
    .positive('El monto del gasto debe ser mayor a 0')
    .max(20000, 'Monto fuera de rango de caja chica'),

  supplier: z
    .string()
    .max(80, 'Máximo 80 caracteres')
    .optional()
    .or(z.literal('')),

  categoryId: z
    .string({ error: 'Selecciona una categoría de gasto' })
    .uuid('La categoría seleccionada no es válida'),
});

// 3. Inyección de efectivo
export const movementSchema = z.object({
  amount: z
    .number({ error: 'Ingresa un monto válido' })
    .positive('La inyección debe ser mayor a 0'),
  reason: z
    .string()
    .min(4, 'Describe el motivo (ej. Billetes de 50 para cambio)')
    .max(120, 'Máximo 120 caracteres'),
});

// 4. Cierre de turno
export const closeShiftSchema = z.object({
  finalCashReported: z
    .number({ error: 'Ingresa el efectivo contado' })
    .min(0, 'El conteo no puede ser negativo'),
  notes: z
    .string()
    .max(255, 'Máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
});

// Inferencia exacta para React Hook Form
export type OpenShiftFormValues = z.infer<typeof openShiftSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
export type MovementFormValues = z.infer<typeof movementSchema>;
export type CloseShiftFormValues = z.infer<typeof closeShiftSchema>;