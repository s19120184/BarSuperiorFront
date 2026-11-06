import { api } from "@/src/lib/api-client";
import { CategoryFormValues } from "@/src/schemas/category.schema";
import { Category } from "./getCategories";


export const updateCategory = async (
  id: string,
  payload: Partial<CategoryFormValues>
): Promise<Category> => {

  console.log({id, payload})

  const { data } = await api.patch<Category>(`/catalogo-inventario/${id}`, payload);
  return data;
};