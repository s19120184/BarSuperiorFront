import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../lib/api-client';
import { CloseShiftFormValues } from '../schemas/cash-register.schema';
import { ShiftAuditResponse } from '../types/cash-register';

export const DENOMINATIONS = [
  { label: '$1,000', value: 1000 },
  { label: '$500', value: 500 },
  { label: '$200', value: 200 },
  { label: '$100', value: 100 },
  { label: '$50', value: 50 },
  { label: '$20', value: 20 },
  { label: 'Monedas', value: 1 },
] as const;

export const useCloseShift = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Conteo de piezas por denominación
  const [counts, setCounts] = useState<Record<number, number>>({
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    1: 0,
  });

  // Obtener estado actual de caja
  const { data: audit, isLoading } = useQuery({
    queryKey: ['shift', 'audit'],
    queryFn: async (): Promise<ShiftAuditResponse | null> => {
      try {
        const { data } = await api.get<ShiftAuditResponse>('/cash-register/audit');
        return data;
      } catch {
        return null;
      }
    },
  });

  // Total calculado por billetes y monedas
  const calculatedTotal = useMemo(() => {
    return Object.entries(counts).reduce((total, [denom, count]) => {
      return total + Number(denom) * (Number(count) || 0);
    }, 0);
  }, [counts]);

  const expectedAmount = audit?.financials.expectedCashInDrawer ?? 0;
  const difference = calculatedTotal - expectedAmount;

  const status = useMemo(() => {
    if (calculatedTotal === 0 && expectedAmount > 0) return 'PENDIENTE';
    if (Math.abs(difference) < 0.01) return 'CUADRADA';
    return difference > 0 ? 'SOBRANTE' : 'FALTANTE';
  }, [difference, calculatedTotal, expectedAmount]);

  // Mutación de cierre
  const closeMutation = useMutation({
    mutationFn: async (data: CloseShiftFormValues) => {
      const { data: res } = await api.post('/cash-register/close', {
        actualCash: data.finalCashReported,
        notes: data.notes || '',
      });
      return res;
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['shift'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast.success('Turno cerrado exitosamente');

      // Si el backend retorna el ID del turno cerrado o ticket, podemos abrirlo
      const shiftId = res?.id || audit?.shiftInfo.id;
      if (shiftId) {
        // Para Corte Z
        window.open(`/print/corte-z/${shiftId}`, '_blank', 'width=380,height=600');
      }

      router.push('/register');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Error al cerrar el turno');
    },
  });

  const handleCountChange = (denom: number, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [denom]: Math.max(0, count || 0),
    }));
  };

  return {
    audit,
    isLoading,
    counts,
    calculatedTotal,
    expectedAmount,
    difference,
    status,
    handleCountChange,
    closeShift: closeMutation,
    isSubmitting: closeMutation.isPending,
  };
};