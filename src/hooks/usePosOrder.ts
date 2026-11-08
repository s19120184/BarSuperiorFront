

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Product, Category, Order, DraftItem, AdminOrderOpen } from '../types/pos';
import { Table } from '../types/table';
import { api } from '../lib/api-client';
import { toast } from 'sonner';


export const usePosOrder = (tableId?: string) => {
  const queryClient = useQueryClient();

  // 1. Obtener información de la mesa y comanda activa
  const tableQuery = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const { data } = await api.get<Table>(`/tables/${tableId}`);
      return data;
    },
    enabled: Boolean(tableId), // 🛑 Bloquea peticiones /tables/undefined
    staleTime: 1000 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  //obtener las ordenes abiertas
  const openOrders = useQuery({
    queryKey:['openOrders'],
    queryFn:async()=>{
      const {data} = await api.get<AdminOrderOpen[]>('/orders?status=OPEN')
      return data
    },
     staleTime: 1000 * 60 * 2, // ⏱️ Considera los datos frescos por 2 minutos
    gcTime: 1000 * 60 * 5,
    refetchOnMount: false, // 🛑 No dispara GET cada vez que entras a la pantalla si los datos están frescos
    refetchOnWindowFocus: false, // 🛑 Evita peticiones al alternar pestañas
  })

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
    enabled: Boolean(tableId), // 🛑 Bloquea peticiones /orders/undefined/table
    staleTime: 1000 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 2. Obtener categorías y productos
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/catalogo-inventario');
      return data;
    },
    enabled: Boolean(tableId), // 🛑 No pide categorías en la pantalla de administración de órdenes
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });


 // 6. Mutación para cancelar producto de la comanda
  const cancelItemMutation = useMutation({
    mutationFn: async ({
      orderId,
      itemId,
    }: {
      orderId: string;
      itemId: string;
    }) => {
      const { data } = await api.delete(`/orders/${orderId}/items/${itemId}`);
      return data;
    },
    onSuccess: () => {
      // Invalida la lista de órdenes activas para que se actualice la vista
      queryClient.invalidateQueries({ queryKey: ['openOrders'] });
      if (tableId) {
        queryClient.invalidateQueries({ queryKey: ['table', tableId] });
        queryClient.invalidateQueries({ queryKey: ['order', 'active', tableId] });
      }
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Producto cancelado correctamente');
    },
    onError: (err:string) => {
      toast.error(
       'Error al cancelar el producto de la orden'
      );
    },
  });

  const productsQuery = useQuery({
    queryKey: ['pos', 'products'],
    queryFn: async () => {
      // Endpoint dedicado sin paginación que devuelve únicamente productos activos
      const { data } = await api.get<Product[]>('/catalogo-inventario/product/pos');
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(tableId), // 🛑 No pide productos en la pantalla de administración de órdenes
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
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
     queryClient.invalidateQueries({ queryKey: ['openOrders'] });
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
    openOrders:openOrders.data,
    cancelItem:cancelItemMutation,
    isLoading:
      tableQuery.isLoading ||
      categoriesQuery.isLoading ||
      productsQuery.isLoading,
    sendRound: sendRoundMutation,
    refetchOpenOrders: openOrders.refetch,
  };
};