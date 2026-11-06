import { ProductFormValues } from "@/src/schemas/product.schema";
import { Product } from "./product-interface";
import { api } from "@/src/lib/api-client";


// 4. Actualizar un producto existente
export const updateProduct = async (
  id: string,
  payload: Partial<ProductFormValues>
): Promise<Product> => {

  

  const cleanPayload = {
    ...payload,
    slug: payload.slug?.trim() ? payload.slug.trim() : undefined,
  };


  const { data } = await api.patch<Product>(`/catalogo-inventario/product/${id}`, cleanPayload);

  console.log(data)
  return data;
};