import { ProductFormValues } from "@/src/schemas/product.schema";
import { Product } from "./product-interface";
import { api } from "@/src/lib/api-client";



// 3. Crear un nuevo producto (CreateProductDto)
export const createProduct = async (payload: ProductFormValues) => {



  // Limpieza previa al envío: no enviar string vacío en slug si no se especificó
  const cleanPayload = {
    ...payload,
    slug: payload.slug?.trim() ? payload.slug.trim() : undefined,
    price: payload.price !== undefined && !isNaN(payload.price) ? payload.price : undefined,
    stock: payload.stock !== undefined && !isNaN(payload.stock) ? payload.stock : undefined,
  };

  console.log(cleanPayload)
  
  

  const { data } = await api.post<Product>('/catalogo-inventario/product', cleanPayload);
  return data;
};