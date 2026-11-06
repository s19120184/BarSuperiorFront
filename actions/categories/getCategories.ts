import { api } from "@/src/lib/api-client";
import { CategoryType } from "@/src/schemas/category.schema";



export interface Category {
  id: string;
  title: string;
  description?: string;
  type: CategoryType;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  productsCount?: number;
}

export const getCategories = async (type?: CategoryType | 'ALL'): Promise<Category[]> => {
  const params = type && type !== 'ALL' ? { type } : {};
  const { data } = await api.get<Category[]>('/catalogo-inventario', { params });
  return data;
};

