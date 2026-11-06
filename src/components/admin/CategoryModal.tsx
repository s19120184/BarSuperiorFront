'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Layers, ShoppingBag, Receipt, ArrowLeftRight } from 'lucide-react';
import { CategoryFormValues, categorySchema, CategoryType } from '@/src/schemas/category.schema';


interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: (CategoryFormValues & { id: string }) | null;
  onSubmit: (data: CategoryFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
    
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'PRODUCT',
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        type: initialData.type || 'PRODUCT',
      });
    } else {
      reset({
        title: '',
        description: '',
        type: 'PRODUCT',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const typeOptions: { value: CategoryType; label: string; desc: string; icon: any }[] = [
    {
      value: 'PRODUCT',
      label: 'Solo Productos',
      desc: 'Visible para comandas y catálogo de venta.',
      icon: ShoppingBag,
    },
    {
      value: 'EXPENSE',
      label: 'Solo Gastos',
      desc: 'Para clasificar salidas de caja chica.',
      icon: Receipt,
    },
    {
      value: 'BOTH',
      label: 'Ambos Usos',
      desc: 'Disponible tanto para venta como para compras.',
      icon: ArrowLeftRight,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Organiza artículos de venta o conceptos de caja chica
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 text-xs">
          {/* Título */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 block">Nombre de la Categoría *</label>
            <input
              type="text"
              placeholder="Ej. Cervezas Nacionales, Insumos Barra, Coctelería"
              {...register('title')}
              className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-500/80 focus:border-rose-500'
                  : 'border-zinc-800 focus:border-amber-500'
              }`}
            />
            {errors.title && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Tipo de Categoría (Radio Cards) */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-300 block">Propósito / Clasificación *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setValue('type', opt.value)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500' : 'border-zinc-700'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold block text-[11px]">{opt.label}</span>
                      <span className="text-[9px] text-zinc-500 block leading-tight mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.type && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.type.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 block">
              Descripción <span className="text-zinc-500 font-normal">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Detalles adicionales sobre los productos o gastos agrupados aquí..."
              {...register('description')}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 resize-none transition-all"
            />
            {errors.description && (
              <p className="text-[10px] text-rose-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800/80">
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
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};