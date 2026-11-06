

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Product, Category, Order, DraftItem } from '../types/pos';
import { Table } from '../types/table';
import { api } from '../lib/api-client';


export const usePosOrder = (tableId?: string) => {
  const queryClient = useQueryClient();

  // 1. Obtener información de la mesa y comanda activa
  const tableQuery = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const { data } = await api.get<Table>(`/tables/${tableId}`);
      return data;
    },
  });

  const activeOrderQuery = useQuery({
    queryKey: ['order', 'active', tableId],
    queryFn: async () => {
      // Ajusta este endpoint según tu backend (ej. /orders/table/:tableId/active)
      try {
        const { data } = await api.get<Order>(`/orders/${tableId}/table`);
        
        return data;
      } catch (err) {
        return null;
      }
    },
  });

  // 2. Obtener categorías y productos
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/catalogo-inventario');
      return data;
    },
  });

  // const productsQuery = useQuery({
  //   queryKey: ['products'],
  //   queryFn: async () => {
  //     const { data } = await api.get<Product[]>('catalogo-inventario/product');
    
  //     return data;
  //   },
  // });


  const productsQuery = useQuery({
    queryKey: ['pos', 'products'],
    queryFn: async () => {
      // Endpoint dedicado sin paginación que devuelve únicamente productos activos
      const { data } = await api.get<Product[]>('/catalogo-inventario/product/pos');
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de frescura en la comanda
    refetchOnWindowFocus: false,
  });

  // 3. Mutación para mandar la ronda
  const sendRoundMutation = useMutation({
    mutationFn: async ({
      tableId,
      orderId,
      items,
    }: {
      tableId: string;
      orderId?: string;
      items: DraftItem[];
    }) => {
      const payload = {
        tableId,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          notes: i.notes || '',
        })),
      };

      if (!orderId) {
        // Crear comanda nueva si la mesa estaba libre
        const { data } = await api.post<Order>('/orders', payload);
       
        return data;
      } else {
        // Agregar ronda a la comanda existente
         
         try {
           const { data } = await api.post<Order>(`/orders/${orderId}/items`, 
           payload.items,
         );

           return data
         } catch (error) {
            console.log("error")
         }
       

    
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['order', 'active', tableId] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  return {
    table: tableQuery.data,
    activeOrder: activeOrderQuery.data,
    categories: categoriesQuery.data || [],
    products: productsQuery.data || [],
    isLoading:
      tableQuery.isLoading ||
      categoriesQuery.isLoading ||
      productsQuery.isLoading,
    sendRound: sendRoundMutation,
  };
};