import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api-client';
import { ShiftAuditResponse } from '../types/cash-register';


export const useCashRegister = () => {
  const queryClient = useQueryClient();

  
  const auditQuery = useQuery({
  queryKey: ['shift', 'audit'],
  queryFn: async (): Promise<ShiftAuditResponse | null> => {
    try {
      const { data } = await api.get<ShiftAuditResponse>('/cash-register/audit');
      return data;
    } catch (err: any) {
      if (
        err.response?.status === 404 ||
        err.response?.data?.message?.includes('abierto')
      ) {
        return null;
      }
      throw err;
    }
  },
  staleTime: 1000 * 30, // 30s de frescura
  // Polling condicional: solo cada 60s si hay un turno activo detectado
  refetchInterval: (query) => {
    return query.state.data ? 1000 * 120 : false;
  },
  refetchIntervalInBackground: false, // 🛑 No consultar si la pestaña está en segundo plano
  refetchOnWindowFocus: true, // Revalida únicamente cuando el cajero regresa a la pestaña
});

  // 2. Abrir turno
  const openShiftMutation = useMutation({
    mutationFn: async ({ initialAmount, shiftName }: { initialAmount: number; shiftName?: string }) => {
      const { data } = await api.post('/cash-register/open', {
        initialAmount,
        shiftName: shiftName || 'Turno Principal',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift', 'audit'] });
      toast.success('Turno de caja abierto correctamente');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error al abrir caja');
    },
  });

  // 3. Registrar inyección de cambio (movimiento manual)
  const addMovementMutation = useMutation({
    mutationFn: async ({ amount, reason }: { amount: number; reason: string }) => {
      
      const { data } = await api.post('/cash-register/movement', {
        // type: 'INJECTION',
         amount:amount,
         reason:reason,
      });

      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift', 'audit'] });
      toast.success('Inyección de efectivo registrada');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error al registrar inyección');
    },
  });

  // 4. Registrar gasto operativo de caja chica
  const addExpenseMutation = useMutation({
    mutationFn: async ({
      description,
      amount,
      supplier,
      categoryId
    }: {
      description: string;
      amount: number;
      supplier?: string;
      categoryId:string
    }) => {
      const { data } = await api.post('/expenses', {
        description,
        amount,
        supplier,
        paymentMethod: 'CASH',
        categoryId
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift', 'audit'] });
      toast.success('Gasto registrado con cargo a caja chica');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error al registrar gasto');
    },
  });

  return {
    audit: auditQuery.data,
    hasActiveShift: !!auditQuery.data,
    isLoading: auditQuery.isLoading,
    isRefetching: auditQuery.isRefetching,
    refetchAudit: auditQuery.refetch,
    openShift: openShiftMutation,
    addMovement: addMovementMutation,
    addExpense: addExpenseMutation,
  };
};