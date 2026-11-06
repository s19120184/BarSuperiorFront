import { api } from "@/src/lib/api-client";

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/catalogo-inventario/${id}`);
};