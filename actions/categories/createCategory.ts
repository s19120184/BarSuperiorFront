import { api } from "@/src/lib/api-client";
import { Category } from "./getCategories";
import { CategoryFormValues } from "@/src/schemas/category.schema";


export const createCategory = async (payload: CategoryFormValues): Promise<Category> => {
  const { data } = await api.post<Category>('/catalogo-inventario', payload);
  return data;
};