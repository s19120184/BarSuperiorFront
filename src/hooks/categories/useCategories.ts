'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


import { getCategories } from '@/actions/categories/getCategories';
import { CategoryFormValues, CategoryType } from '@/src/schemas/category.schema';
import { createCategory } from '@/actions/categories/createCategory';
import { deleteCategory } from '@/actions/categories/deteteCategory';
import { updateCategory } from '@/actions/categories/updateCategory';

export const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = (type?: CategoryType | 'ALL') => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, type ?? 'ALL'],
    queryFn: () => getCategories(type),
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CategoryFormValues) => createCategory(payload),
    onSuccess: () => {
      invalidate();
      toast.success('Categoría creada correctamente');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al crear la categoría';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryFormValues> }) =>
  
      updateCategory(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success('Categoría actualizada');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al actualizar categoría';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      invalidate();
      toast.success('Categoría eliminada');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'No se pudo eliminar la categoría';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  return {
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};