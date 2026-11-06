'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { TableItem, TableFormValues, TableStatus } from '@/src/schemas/table.schema';
import { api } from '@/src/lib/api-client';

export const tableKeys = {
  all: ['tables'] as const,
  lists: () => [...tableKeys.all, 'list'] as const,
};

export const useAdminTables = () => {
  const queryClient = useQueryClient();

  // 1. Obtener todas las mesas sin filtros restrictivos
  const tablesQuery = useQuery({
    queryKey: tableKeys.lists(),
    queryFn: async (): Promise<TableItem[]> => {
      const { data } = await api.get<TableItem[]>('/tables');
      return Array.isArray(data) ? data : [];
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: tableKeys.all });
  };

  // 2. Crear nueva mesa
  const createMutation = useMutation({
    mutationFn: async (payload: TableFormValues) => {
      const { data } = await api.post<TableItem>('/tables', payload);
      return data;
    },
    onSuccess: () => invalidate(),
  });

  // 3. Editar mesa
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<TableFormValues> }) => {
      const { data } = await api.patch<TableItem>(`/tables/${id}`, payload);
      return data;
    },
    onSuccess: () => invalidate(),
  });

  // 4. Cambiar estado directamente (ej. marcar disponible o dar de baja)
  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TableStatus }) => {
      const { data } = await api.patch<TableItem>(`/tables/${id}/status`, { status });
      return data;
    },
    onSuccess: () => invalidate(),
  });

  return {
    tables: tablesQuery.data ?? [],
    isLoading: tablesQuery.isLoading,
    isError: tablesQuery.isError,
    refetch: tablesQuery.refetch,
    createTable: createMutation.mutateAsync,
    updateTable: updateMutation.mutateAsync,
    changeStatus: changeStatusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending || changeStatusMutation.isPending,
  };
};