
import { z } from 'zod';

export const loginWithPasswordSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginWithPinSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'El PIN debe ser de 4 a 6 dígitos'),
});

export type LoginWithPasswordValues = z.infer<typeof loginWithPasswordSchema>;
export type LoginWithPinValues = z.infer<typeof loginWithPinSchema>;