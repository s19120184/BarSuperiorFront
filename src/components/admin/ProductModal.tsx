"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Image as ImageIcon, Loader2, Package } from "lucide-react";

import { ImageUploadDropzone } from "../ui/ImageUploadDropzone";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ProductFormValues, productSchema } from "@/src/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/actions/products/product-interface";
import { StockQuickInput } from "./StockQuickInput";
import { useProductFormModal } from "@/src/hooks/products/useProductsFormModal";

export interface CategoryOption {
  id: string;
  title: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const {
    register,
    control,
    errors,
    currentSizes,
    isPrepared,
    newSize,
    setNewSize,
    handleAddSize,
    handleRemoveSize,
    handleFormSubmit
  } = useProductFormModal({
    isOpen,
    categories,
    initialData,
    onSubmit
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {initialData ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Registra precios, presentaciones y fotos del artículo
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
        <form
          onSubmit={handleFormSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
        >
          {/* Nombre & Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">
                Nombre del Producto *
              </label>
              <input
                type="text"
                placeholder="Ej. Cerveza Corona 355ml, Mojito Clásico"
                {...register("title")}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none transition-all ${
                  errors.title
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-zinc-800 focus:border-amber-500"
                }`}
              />
              {errors.title && (
                <p className="text-[10px] text-rose-400 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">
                Categoría *
              </label>
              <select
                {...register("categoryId")}
                className={`w-full bg-zinc-950 border rounded-xl px-3.5 py-2.5 text-white focus:outline-none transition-all ${
                  errors.categoryId
                    ? "border-rose-500 focus:border-rose-500"
                    : "border-zinc-800 focus:border-amber-500"
                }`}
              >
                <option value="">Selecciona categoría...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-[10px] text-rose-400 font-medium">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          {/* Precio & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">
                Precio Unitario ($)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="0.00"
                {...register("price")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              {errors.price && (
                <p className="text-[10px] text-rose-400 font-medium">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-300 block">
                Slug / URL
              </label>
              <input
                type="text"
                placeholder="corona-355ml"
                {...register("slug")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              {errors.slug && (
                <p className="text-[10px] text-rose-400 font-medium">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>
          {/* Existencias */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 block">
              Existencias en Barra / Almacén (Piezas)
            </label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <StockQuickInput
                  value={field.value as number}
                  onChange={field.onChange}
                  disabled={isPrepared}
                />
              )}
            />
            {errors.stock && (
              <p className="text-[10px] text-rose-400 font-medium">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Presentaciones / Tamaños */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 block">
              Presentaciones / Tamaños de Venta (sizes)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                placeholder="Ej. Copa 1.5oz, Botella 750ml, Litro"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            {currentSizes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentSizes.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-zinc-800/80 border border-zinc-700 text-zinc-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(idx)}
                      className="text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles: is_prepared & is_active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_prepared")}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <div>
                <span className="font-bold text-white block">
                  Es Producto Preparado
                </span>
                <span className="text-[10px] text-zinc-400">
                  Requiere elaboración en barra/cocina (coctel, botana).
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("is_active")}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <div>
                <span className="font-bold text-white block">
                  Producto Activo
                </span>
                <span className="text-[10px] text-zinc-400">
                  Visible en la pantalla del salón de mesas (POS).
                </span>
              </div>
            </label>
          </div>

          {/* Imágenes subidas a Cloudinary */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 block">
              Fotografías del Producto
            </label>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploadDropzone
                  images={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                  maxFiles={4}
                  disabled={isLoading}
                />
              )}
            />
            {errors.images && (
              <p className="text-[10px] text-rose-400 font-medium">
                {errors.images.message}
              </p>
            )}
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
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isLoading
                ? "Guardando..."
                : initialData
                  ? "Actualizar Producto"
                  : "Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
