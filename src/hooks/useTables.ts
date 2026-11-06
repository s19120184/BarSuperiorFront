
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import { Table } from '../types/table';

export const fetchTables = async (): Promise<Table[]> => {
  const { data } = await api.get<Table[]>('/tables');
  return Array.isArray(data) ? data : [];
};

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: fetchTables,
   // Mantiene los datos vigentes durante 1 minuto sin refetch inmediato en cada montaje
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,

    // Elimina peticiones cada vez que el usuario hace clic en la app o cambia de pestaña
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    // Sondeo relajado a 30 segundos que se pausa por completo si la ventana está minimizada o en segundo plano
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: false,
  });
};