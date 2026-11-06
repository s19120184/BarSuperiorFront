'use client';

import { useQuery } from '@tanstack/react-query';

import { QueryShiftsParams, ShiftStatus } from '@/src/types/shifts';
import { getShiftsHistory } from '@/actions/shifts/cash.history.action';

export const cashKeys = {
  all: ['cash'] as const,
  shiftsHistory: (params: QueryShiftsParams) => [...cashKeys.all, 'history', params] as const,
};

export const useShiftsHistory = (params: QueryShiftsParams) => {
  // Determinamos si la consulta pide datos históricos cerrados
  const isOnlyClosedHistorical = params.status === ShiftStatus.CLOSED;

  return useQuery({
    queryKey: cashKeys.shiftsHistory(params),
    queryFn: () => getShiftsHistory(params),
    placeholderData: (previousData) => previousData, // Mantiene datos al paginar

    // 🔒 Si son cortes cerrados, no cambian: caché infinita.
    // ⏱️ Si incluye turnos abiertos o activos, refresco cada 2 minutos.
    staleTime: isOnlyClosedHistorical ? Infinity : 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30, // 30 minutos en memoria RAM

    // Evita saturar el servidor al cambiar de pestañas en el navegador
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};