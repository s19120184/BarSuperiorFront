'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ShoppingBag,
  Receipt,
  ArrowLeftRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { CategoryModal } from '@/src/components/admin/CategoryModal';
import { useCategories, useCategoryMutations } from '@/src/hooks/categories/useCategories';
import { CategoryFormValues, CategoryType } from '@/src/schemas/category.schema';
import { Category } from '@/src/types/pos';
import GlobalHeaders from '@/src/components/ui/GlobalHeaders';


export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // TanStack Query
  const { data: categories = [], isLoading, isError, refetch } = useCategories(
    typeFilter as CategoryType | 'ALL'
  );

  
  const { createCategory, updateCategory, deleteCategory, isCreating, isUpdating } =
    useCategoryMutations();

  const filteredCategories = categories.filter((cat) => {

    return (
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: CategoryFormValues) => {
    if (editingCategory) {
      await updateCategory({ id: editingCategory.id, payload: data });
    } else {
      await createCategory(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar la categoría "${title}"?`)) {
      await deleteCategory(id);
    }
  };

  const renderTypeBadge = (type: CategoryType) => {
    switch (type) {
      case 'PRODUCT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShoppingBag className="w-3 h-3" /> Solo Productos
          </span>
        );
      case 'EXPENSE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Receipt className="w-3 h-3" /> Solo Gastos
          </span>
        );
      case 'BOTH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ArrowLeftRight className="w-3 h-3" /> Productos & Gastos
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <GlobalHeaders title={'Categorías'} description={'Clasifica productos para el menú del POS y conceptos para caja chica'} />

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Contadores y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
          {(['ALL', 'PRODUCT', 'EXPENSE', 'BOTH'] as const).map((filter) => {
            const labels = {
              ALL: `Todas (${categories.length})`,
              PRODUCT: 'Venta',
              EXPENSE: 'Gastos',
              BOTH: 'Mixtas',
            };
            return (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  typeFilter === filter ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Propósito</th>
                {/* <th className="px-4 py-3.5">Productos Vinculados</th> */}
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Cargando catálogo de categorías...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-rose-400">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                    Error al cargar las categorías.
                    <button
                      onClick={() => refetch()}
                      className="block mx-auto mt-2 text-xs text-amber-400 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-zinc-500">
                    No se encontraron categorías.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-sm">{cat.title}</div>
                      {cat.description && (
                        <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">{renderTypeBadge(cat.type)}</td>
                    {/* <td className="px-4 py-3.5 font-semibold text-zinc-300">
                      {cat.productsCount !== undefined ? `${cat.productsCount} items` : '—'}
                    </td> */}
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.title)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingCategory}
        onSubmit={handleSave}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}