'use client';

import { createProduct } from '@/actions/products/create-Product_action';
import { deleteProduct } from '@/actions/products/delete-product-action';
import { getProductById } from '@/actions/products/get-productbyId';
import { getProducts } from '@/actions/products/getProducts';
import { Product, ProductsFilterParams } from '@/actions/products/product-interface';
import { updateProduct } from '@/actions/products/update-product-action';
import { ProductFormValues } from '@/src/schemas/product.schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


// Fábrica jerárquica de claves de caché para TanStack Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductsFilterParams) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (idOrSlug: string) => [...productKeys.details(), idOrSlug] as const,
};


// Hook para listar productos administrables
export const useProducts = (filters: ProductsFilterParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => getProducts(filters),
    placeholderData: (previousData) => previousData, // Mantiene la vista fluida entre páginas

    // 🔒 CONFIGURACIÓN CERO PETICIONES REDUNDANTES:
    staleTime: Infinity,          // Los datos nunca caducan por tiempo
    gcTime: 1000 * 60 * 30,       // Conserva la caché en memoria por 30 minutos
    refetchOnWindowFocus: false,  // No recargar al cambiar de ventana/pestaña
    refetchOnMount: false,        // Si ya está en memoria, no vuelve a pedirlo al montar
    refetchOnReconnect: false,    // No recargar ante micro-cortes de red
  });
};

// 2. Hook para obtener el detalle de un solo producto
export const useProductDetail = (idOrSlug: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: () => getProductById(idOrSlug),
    enabled: Boolean(idOrSlug) && enabled,
  });
};

// 3. Hook unificado de mutaciones (Creación, Actualización y Eliminación)
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  // Invalidación total del árbol de listas de productos
  const invalidateProductLists = () => {
    queryClient.invalidateQueries({ queryKey: productKeys.lists() });
  };

  // Mutación: Crear Producto
  const createMutation = useMutation({
    mutationFn: (payload: ProductFormValues) => createProduct(payload),
    onSuccess: (newProduct: Product) => {
      invalidateProductLists();
      toast.success(`Producto "${newProduct.title}" registrado con éxito`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al registrar el producto';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // Mutación: Actualizar Producto
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductFormValues> }) =>
      updateProduct(id, payload),
    
    onSuccess: (updatedProduct: Product) => {
      // Invalida la lista y refresca la vista detallada específica
      invalidateProductLists();
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.id) });
      if (updatedProduct.slug) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.slug) });
      }
      toast.success(`Producto "${updatedProduct.title}" actualizado`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Error al actualizar el producto';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  // Mutación: Eliminar Producto
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      invalidateProductLists();
      toast.success('Producto eliminado del catálogo');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'No se pudo eliminar el producto';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};