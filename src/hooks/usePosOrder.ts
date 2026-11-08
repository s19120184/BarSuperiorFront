import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, Category, Order, DraftItem, AdminOrderOpen } from '../types/pos';
import { Table } from '../types/table';
import { api } from '../lib/api-client';
import { toast } from 'sonner';

export const usePosOrder = (tableId?: string) => {
  const queryClient = useQueryClient();

  // 1. Información de la mesa
  const tableQuery = useQuery({
    queryKey: ['table', tableId],
    queryFn: async () => {
      const { data } = await api.get<Table>(`/tables/${tableId}`);
      return data;
    },
    enabled: Boolean(tableId),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  // 2. Órdenes abiertas para el panel administrativo
  const openOrders = useQuery({
    queryKey: ['openOrders'],
    queryFn: async () => {
      const { data } = await api.get<AdminOrderOpen[]>('/orders?status=OPEN');
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // 3. Comanda activa de la mesa específica
  const activeOrderQuery = useQuery({
    queryKey: ['order', 'active', tableId],
    queryFn: async () => {
      try {
        const { data } = await api.get<Order>(`/orders/${tableId}/table`);
        return data;
      } catch (err) {
        return null;
      }
    },
    enabled: Boolean(tableId),
    staleTime: 0, // 🛑 Siempre debe refrescar al abrir la mesa para no mostrar ítems viejos
    refetchOnMount: 'always', // 🛑 Asegura que al entrar a la comanda pida el estado real
    refetchOnWindowFocus: false,
  });

  // 4. Categorías
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/catalogo-inventario');
      return data;
    },
    //enabled: Boolean(tableId),
    staleTime: 1000 * 40, // 40 segundos infinity anterior,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // 5. Catálogo de productos para el POS
  const productsQuery = useQuery({
    queryKey: ['pos', 'products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/catalogo-inventario/product/pos');
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(tableId),
    staleTime: 1000 * 60 * 5,
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
      tableId?: string;
    }) => {
      const { data } = await api.delete(`/orders/${orderId}/items/${itemId}`);
      return data;
    },
    // ✅ Corregido: extraemos variables del 2do argumento
    onSuccess: async (_data, variables) => {
      const targetTableId = variables.tableId || tableId;

      // Invalida panel de órdenes activas
      await queryClient.invalidateQueries({ queryKey: ['openOrders'] });

      // Invalida y remueve caché vieja de la comanda de la mesa afectada
      if (targetTableId) {
        await queryClient.invalidateQueries({
          queryKey: ['order', 'active', targetTableId],
        });
        await queryClient.invalidateQueries({
          queryKey: ['table', targetTableId],
        });
        // Remueve la entrada anterior para forzar lectura limpia al entrar
        queryClient.removeQueries({
          queryKey: ['order', 'active', targetTableId],
          exact: true,
        });
      }

      // Invalida cualquier query que comience con 'order'
      await queryClient.invalidateQueries({ queryKey: ['order'] });
      await queryClient.invalidateQueries({ queryKey: ['tables'] });

      toast.success('Producto cancelado correctamente');
    },
    onError: (err: string) => {
      toast.error(
         'Error al cancelar el producto de la orden'
      );
    },
  });

  // 7. Mutación para mandar la ronda
  const sendRoundMutation = useMutation({
    mutationFn: async ({
      tableId: targetTableId,
      orderId,
      items,
    }: {
      tableId: string;
      orderId?: string;
      items: DraftItem[];
    }) => {
      const payload = {
        tableId: targetTableId,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          notes: i.notes || '',
        })),
      };

      if (!orderId) {
        const { data } = await api.post<Order>('/orders', payload);
        return data;
      } else {
        const { data } = await api.post<Order>(
          `/orders/${orderId}/items`,
          payload.items
        );
        return data;
      }
    },
    onSuccess: (_, variables) => {
      const targetTableId = variables.tableId || tableId;
      queryClient.invalidateQueries({ queryKey: ['openOrders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      if (targetTableId) {
        queryClient.invalidateQueries({ queryKey: ['table', targetTableId] });
        queryClient.invalidateQueries({ queryKey: ['order', 'active', targetTableId] });
      }
    },
  });

  return {
    table: tableQuery.data,
    activeOrder: activeOrderQuery.data,
    categories: categoriesQuery.data || [],
    products: productsQuery.data || [],
    openOrders: openOrders.data || [],
    cancelItem: cancelItemMutation,
    isLoading: tableId
      ? tableQuery.isLoading || categoriesQuery.isLoading || productsQuery.isLoading
      : openOrders.isLoading,
    sendRound: sendRoundMutation,
    refetchOpenOrders: openOrders.refetch,
    refetchActiveOrder: activeOrderQuery.refetch,
  };
};