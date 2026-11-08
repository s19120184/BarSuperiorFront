"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  expenseSchema,
  movementSchema,
  ExpenseFormValues,
  MovementFormValues
} from "../../schemas/cash-register.schema";
import { usePosOrder } from "@/src/hooks/usePosOrder";
import { useCategories } from "@/src/hooks/categories/useCategories";
import { CategoryOption } from "../admin/ProductModal";

interface ModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  isPending: boolean;
}

export const ExpenseModal: React.FC<ModalProps<ExpenseFormValues>> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: undefined,
      supplier: "",
      categoryId: ""
    }
  });

  // const {categories} = usePosOrder()

   // 1. Categorías disponibles para el selector
    const { data: rawCategories = [] } = useCategories();
    const categories  = useMemo(() => {
      return Array.isArray(rawCategories)
        ? rawCategories
        : ((rawCategories as any)?.data ?? []);
    }, [rawCategories]);

    

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ExpenseFormValues) => {
    await onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">
            Registrar Gasto de Caja Chica
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Concepto / Insumo
            </label>
            <input
              type="text"
              placeholder="Ej. Limones, Hielo"
              {...register("description")}
              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none mt-1 ${
                errors.description
                  ? "border-rose-500"
                  : "border-zinc-800 focus:border-rose-500"
              }`}
            />
            {errors.description && (
              <p className="text-[10px] text-rose-400 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Monto ($)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none mt-1 ${
                errors.amount
                  ? "border-rose-500"
                  : "border-zinc-800 focus:border-rose-500"
              }`}
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-400 mt-1 font-medium">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Proveedor (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Don Rangel"
              {...register("supplier")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-rose-500 mt-1"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Categoría del Gasto
            </label>
            <select
              {...register("categoryId")}
              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none mt-1 ${
                errors.categoryId
                  ? "border-rose-500"
                  : "border-zinc-800 focus:border-rose-500"
              }`}
            >
              <option value="">Selecciona una categoría...</option>
              {/*  mapear aquí las categorías traídas de tu API de gastos */}
              {categories.map((cat:CategoryOption)=>(
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
              
            </select>
            {errors.categoryId && (
              <p className="text-[10px] text-rose-400 mt-1 font-medium">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Registrar Salida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MovementModal: React.FC<ModalProps<MovementFormValues>> = ({
  isOpen,
  onClose,
  onSubmit,
  isPending
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema)
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: MovementFormValues) => {
    

    await onSubmit(data);
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white">
            Inyectar Efectivo para Cambio
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Monto ($)
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none mt-1 ${
                errors.amount
                  ? "border-rose-500"
                  : "border-zinc-800 focus:border-emerald-500"
              }`}
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-400 mt-1 font-medium">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 uppercase">
              Motivo
            </label>
            <input
              type="text"
              placeholder="Ej. Billetes chicos para cambio"
              {...register("reason")}
              className={`w-full bg-zinc-950 border rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none mt-1 ${
                errors.reason
                  ? "border-rose-500"
                  : "border-zinc-800 focus:border-emerald-500"
              }`}
            />
            {errors.reason && (
              <p className="text-[10px] text-rose-400 mt-1 font-medium">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Inyectar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
