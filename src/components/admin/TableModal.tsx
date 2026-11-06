'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Armchair, Hash, Users, MapPin } from 'lucide-react';
import {
  tableSchema,
  TableFormValues,
  TableFormInput,
  TableStatus,
  TableItem,
} from '@/src/schemas/table.schema';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormValues) => Promise<void>;
  initialData: TableItem | null;
  isLoading: boolean;
  existingZones: string[];
}

const COMMON_ZONES = ['Salón Principal', 'Barra', 'Privado', 'Planta Alta'];

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  existingZones,
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm< TableFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tableSchema) as any,
    defaultValues: {
      number: 1,
      capacity: 4,
      zone: 'Salón Principal',
      status: TableStatus.AVAILABLE,
    },
  });

  const selectedZone = watch('zone');

  useEffect(() => {
    if (initialData) {
      reset({
        number: initialData.number,
        capacity: initialData.capacity,
        zone: initialData.zone,
        status: initialData.status,
      });
    } else {
      reset({
        number: undefined,
        capacity: 4,
        zone: 'Salón Principal',
        status: TableStatus.AVAILABLE,
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const allZones = Array.from(new Set([...COMMON_ZONES, ...existingZones].filter(Boolean)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {isEditing ? `Editar Mesa #${initialData?.number}` : 'Nueva Mesa'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isEditing
                  ? 'Modifica la zona, comensales o número de mesa'
                  : 'Registra una mesa física para asignación de comandas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-xs">
          {/* Número de Mesa */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-500" /> Número de Mesa *
            </label>
            <input
              type="number"
              min={1}
              placeholder="Ej. 1, 2, 10"
              {...register('number', {valueAsNumber:true}) }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
            {errors.number && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.number.message}</p>
            )}
          </div>

          {/* Capacidad */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-500" /> Capacidad Sugerida (Personas)
            </label>
            <input
              type="number"
              min={1}
              placeholder="Ej. 4"
              {...register('capacity' , {valueAsNumber:true})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
            {errors.capacity && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.capacity.message}</p>
            )}
          </div>

          {/* Zona o Área */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Área / Zona del Establecimiento
            </label>
            <input
              type="text"
              placeholder="Escribe o selecciona abajo..."
              {...register('zone')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
            {/* Chips rápidos de selección */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {allZones.map((z) => (
                <button
                  type="button"
                  key={z}
                  onClick={() => setValue('zone', z, { shouldValidate: true })}
                  className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                    selectedZone === z
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
            {errors.zone && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.zone.message}</p>
            )}
          </div>

          {/* Estado Inicial / Actual */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 block">Estatus de Operación</label>
            <select
              {...register('status')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value={TableStatus.AVAILABLE}>Disponible (Libre para comensales)</option>
              <option value={TableStatus.OCCUPIED}>Ocupada (Con comanda en curso)</option>
              <option value={TableStatus.RESERVED}>Reservada</option>
              <option value={TableStatus.INACTIVE}>Inactiva (Fuera de servicio)</option>
            </select>
          </div>

          {/* Botones de acción */}
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
              {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Mesa' : 'Crear Mesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};