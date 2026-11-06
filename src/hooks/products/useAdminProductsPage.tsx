'use client';

import { useState, useMemo } from 'react';
import { useProducts, useProductMutations } from '@/src/hooks/products/useProductsAdmin';
import { useCategories } from '@/src/hooks/categories/useCategories';
import { Product } from '@/actions/products/product-interface';
import { ProductFormValues } from '@/src/schemas/product.schema';


const PAGE_LIMIT = 8;

export const useAdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [offset, setOffset] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [statusModalProduct, setStatusModalProduct] = useState<Product | null>(null);

  // 1. Categorías disponibles para el selector
  const { data: rawCategories = [] } = useCategories();
  const categories = useMemo(() => {
    return Array.isArray(rawCategories)
      ? rawCategories
      : ((rawCategories as any)?.data ?? []);
  }, [rawCategories]);

  // 2. Consulta paginada con filtros aplicados en el servidor
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    limit: PAGE_LIMIT,
    offset,
    search: searchTerm.trim() || undefined,
    categoryId: selectedCat !== 'ALL' ? selectedCat : undefined,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  // 3. Mutaciones
  const {
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
  } = useProductMutations();

  // Resetear paginación al cambiar filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOffset(0);
  };

  const handleCategoryChange = (catId: string) => {
    setSelectedCat(catId);
    setOffset(0);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (formValues: ProductFormValues) => {
    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, payload: formValues });
    } else {
      await createProduct(formValues);
    }
    handleCloseModal();
  };

  const handleToggleStatus = async () => {
    if (!statusModalProduct) return;

    await updateProduct({
      id: statusModalProduct.id,
      payload: {
        is_active: !statusModalProduct.is_active,
      },
    });

    setStatusModalProduct(null);
  };

  return {
    // Filtros y Paginación
    searchTerm,
    handleSearchChange,
    selectedCat,
    handleCategoryChange,
    offset,
    setOffset,
    limit: PAGE_LIMIT,
    total,

    // Datos y Estado
    categories,
    products,
    isLoading,
    isError,
    refetch,

    // Modales
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    statusModalProduct,
    setStatusModalProduct,

    // Acciones
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleToggleStatus,
    isCreating,
    isUpdating,
  };
};