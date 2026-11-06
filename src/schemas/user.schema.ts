import { z } from 'zod';

export enum ValidRoles {
  admin = 'admin',
  bartender = 'bartender',
  waiter = 'waiter',
  cashier = 'cashier',
}

export const userSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 6 && /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(val)),
      {
        message: 'Mínimo 6 caracteres, una mayúscula, una minúscula y un número',
      }
    ),
  roles: z.array(z.enum(ValidRoles)).min(1, 'Selecciona al menos un rol'),
  isActive: z.boolean().default(true),
});

export type UserFormValues = z.infer<typeof userSchema>;

export interface EmployeeUser {
  id: string;
  email: string;
  fullName: string;
  roles: ValidRoles[];
  isActive: boolean;
}