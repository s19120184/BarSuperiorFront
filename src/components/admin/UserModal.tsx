'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, ShieldCheck, User, Mail, Key } from 'lucide-react';
import { userSchema, UserFormValues, ValidRoles, EmployeeUser } from '@/src/schemas/user.schema';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => Promise<void>;
  initialData: EmployeeUser | null;
  isLoading: boolean;
}

const AVAILABLE_ROLES = [
  { id: ValidRoles.admin, label: 'Administrador' },
  { id: ValidRoles.cashier, label: 'Cajero / Caja' },
  { id: ValidRoles.bartender, label: 'Bartender / Barra' },
  { id: ValidRoles.waiter, label: 'Mesero / Salón' },
];

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(userSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      roles: [ValidRoles.waiter],
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        email: initialData.email,
        password: '', // Vacío al editar para no forzar cambio
        roles: initialData.roles || [ValidRoles.waiter],
        isActive: initialData.isActive,
      });
    } else {
      reset({
        fullName: '',
        email: '',
        password: '',
        roles: [ValidRoles.waiter],
        isActive: true,
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div>
            <h3 className="text-sm font-black text-white">
              {isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
            </h3>
            <p className="text-[11px] text-zinc-400">
              {isEditing
                ? 'Actualiza credenciales, roles o información laboral'
                : 'Crea una cuenta de acceso al sistema asignando sus roles'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
          {/* Nombre completo */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-500" /> Nombre Completo
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez López"
              {...register('fullName')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            {errors.fullName && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          {/* Correo electrónico */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="empleado@barsuperior.com"
              {...register('email')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            {errors.email && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" /> Contraseña{' '}
              {isEditing && (
                <span className="text-zinc-500 font-normal text-[10px]">
                  (Dejar vacío para no modificar)
                </span>
              )}
            </label>
            <input
              type="password"
              placeholder={isEditing ? '••••••••' : 'Al menos 1 mayúscula, 1 minúscula y 1 número'}
              {...register('password')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            {errors.password && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Selección de Roles */}
          <div className="space-y-2 pt-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Roles y Permisos Asignados
            </label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const isChecked = field.value?.includes(role.id);
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => {
                          const current = field.value || [];
                          if (isChecked) {
                            if (current.length > 1) {
                              field.onChange(current.filter((r) => r !== role.id));
                            }
                          } else {
                            field.onChange([...current, role.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className="font-bold text-[11px]">{role.label}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-amber-500 border-amber-400 text-zinc-950 font-black text-[9px]'
                              : 'border-zinc-700'
                          }`}
                        >
                          {isChecked && '✓'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.roles && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.roles.message}</p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Datos' : 'Registrar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};