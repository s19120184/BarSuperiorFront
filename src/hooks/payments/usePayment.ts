import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { Order } from '../../types/pos';


export interface ProcessPaymentPayload {
  orderId: string;
  method: 'CASH' | 'CARD' | 'TRANSFER';
  amount: number;
  tip?: number;
  receivedAmount?: number;
}

export const usePayment = (tableId: string) => {
  const queryClient = useQueryClient();

  // Traer la orden activa de la mesa
  const activeOrderQuery = useQuery({
    queryKey: ['order', 'active', tableId],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/table/${tableId}`);
      return data;
    },
  });

  // Mutación de cobro
  const payMutation = useMutation({
    mutationFn: async (payload: ProcessPaymentPayload) => {

      console.log('vamos a cobrar')
      const { data } = await api.post('/payments', payload);
      
      return data;
    },
    onSuccess: () => {
      // Invalidar caché de mesas y órdenes para que la mesa pase a AVAILABLE
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['table', tableId] });
      queryClient.invalidateQueries({ queryKey: ['order', 'active', tableId] });
      queryClient.invalidateQueries({ queryKey: ['shift', 'audit'] });
    },
  });

  return {
    order: activeOrderQuery.data,
    isLoading: activeOrderQuery.isLoading,
    processPayment: payMutation,
  };
};