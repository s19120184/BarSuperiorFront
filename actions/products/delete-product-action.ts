import { api } from "@/src/lib/api-client";


// 5. Eliminar o desactivar un producto
export const deleteProduct = async (id: string): Promise<void> => {
 
    console.log(id)
  await api.delete(`/catalogo-inventario/product/${id}`);
};