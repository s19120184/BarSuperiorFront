// src/schemas/product.schema.ts
// import { z } from 'zod';

// export const productSchema = z.object({
//   title: z
//     .string({ error: 'El título es obligatorio' })
//     .trim()
//     .min(3, 'El título debe tener al menos 3 caracteres'),

//   // Para inputs numéricos en HTML: convertir string vacío o valor numérico sin z.coerce.unknown
//   price: z
//     .preprocess(
//       (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
//       z.number({ error: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0').optional()
//     ),

//   slug: z
//     .string()
//     .trim()
//     .toLowerCase()
//     .optional()
//     .or(z.literal('')),

//   sizes: z
//     .array(z.string().trim().min(1, 'El tamaño no puede estar vacío'))
//     .default([]),

//   is_prepared: z.boolean().default(false),

//   is_active: z.boolean().default(true),

//   stock: z
//     .preprocess(
//       (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
//       z.number({ error: 'El stock debe ser un número entero' }).int().min(0).optional()
//     ),

//   categoryId: z
//     .string({ error: 'La categoría es obligatoria' })
//     .uuid('El categoryId debe ser un UUID válido'),

//   images: z
//     .array(z.string())
//     .default([]),
// });

// Tipos explícitos para React Hook Form
//export type ProductFormValues = z.infer<typeof productSchema>;

import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(2, 'El título es obligatorio'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0').optional(),
  slug: z.string().optional(),
  sizes: z.array(z.string()).default([]),
  is_prepared: z.boolean().default(false),
  is_active: z.boolean().default(true),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo').optional(),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
  images: z.array(z.string()).default([]),
});

// Tipo de salida (lo que entrega handleSubmit)
export type ProductFormValues = z.infer<typeof productSchema>;

// Tipo de entrada (lo que acepta el formulario como defaultValues / inputs)
export type ProductFormInput = z.input<typeof productSchema>;