'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { EmployeeUser, UserFormValues } from '@/src/schemas/user.schema';
import { api } from '@/src/lib/api-client';

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  // 1. Obtener empleados
  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<EmployeeUser[]> => {
      const { data } = await api.get<EmployeeUser[]>('/auth/users');
      return data;
    },
    staleTime: Infinity,          // 🔒 Sin peticiones redundantes
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // 2. Crear empleado
  const createMutation = useMutation({
    mutationFn: async (payload: UserFormValues) => {
      const { data } = await api.post('/auth/registrar', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  // 3. Actualizar empleado
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<UserFormValues> }) => {
      const { data } = await api.patch(`/auth/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    refetch: usersQuery.refetch,
    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};