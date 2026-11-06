

// src/schemas/category.schema.ts
import { z } from 'zod';


export const CategoryTypeEnum = z.enum(['PRODUCT', 'EXPENSE', 'BOTH']);
export type CategoryType = z.infer<typeof CategoryTypeEnum>;

export const categorySchema = z.object({
  title: z
    .string({ error: 'El nombre de la categoría es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),

  description: z
    .string()
    .max(255, 'Máximo 255 caracteres')
    .optional()
    .or(z.literal('')),

  // Sin .default(...) en el schema para mantener el tipo de entrada y salida idéntico
  type: CategoryTypeEnum,
});

export type CategoryFormValues = z.infer<typeof categorySchema>;