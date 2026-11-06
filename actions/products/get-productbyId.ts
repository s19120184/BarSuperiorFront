import { api } from "@/src/lib/api-client";
import { Product } from "./product-interface";



// 2. Obtener un producto por ID o Slug
export const getProductById = async (term: string): Promise<Product> => {
  const { data } = await api.get<Product>(`/catalogo-inventario/product/${term}`);
  return data;
};