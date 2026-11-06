import { api } from "@/src/lib/api-client";
import { PaginatedProductsResponse,  Product,  ProductsFilterParams } from "./product-interface";




export const getProducts = async (
  params?: ProductsFilterParams
): Promise<PaginatedProductsResponse> => {
  const { data } = await api.get('/catalogo-inventario/product', { params });

  // Manejo defensivo
  if (data && Array.isArray(data.products)) {
    return data;
  }

  if (Array.isArray(data)) {
    return {
      total: data.length,
      limit: params?.limit || data.length,
      offset: params?.offset || 0,
      products: data,
    };
  }

  return { total: 0, limit: 10, offset: 0, products: [] };
};

export const getPosProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/catalogo-inventario/product/pos');
  return Array.isArray(data) ? data : [];
};