

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore, UserSession } from '../store/useAuthStore';
import { api } from '../lib/api-client';
import { LoginWithPasswordValues, LoginWithPinValues } from '../schemas/auth.schema';

interface AuthResponse {
  userData: UserSession;
  token: string;
}

export const useAuthLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [authMode, setAuthMode] = useState<'PIN' | 'PASSWORD'>('PIN');
  const [pinValue, setPinValue] = useState<string>('');

  const loginPasswordMutation = useMutation({
    mutationFn: async (data: LoginWithPasswordValues) => {
      const res = await api.post<AuthResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      
      setAuth(data.userData, data.token);
      
      toast.success(`Bienvenido, ${data.userData.fullName}`);
      router.push('/tables');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    },
  });

  const loginPinMutation = useMutation({
    mutationFn: async (data: LoginWithPinValues) => {
      const res = await api.post<AuthResponse>('/auth/login-pin', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuth(data.userData, data.token);
      toast.success(`Sesión iniciada: ${data.userData.fullName}`);
      router.push('/tables');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'PIN incorrecto o no asignado');
      setPinValue('');
    },
  });

  const handlePinInput = (digit: string) => {
    if (pinValue.length < 6) {
      const nextPin = pinValue + digit;
      setPinValue(nextPin);
      if (nextPin.length === 4) {
        // Disparo automático al completar 4 dígitos (o puedes dejarlo manual)
        loginPinMutation.mutate({ pin: nextPin });
      }
    }
  };

  const handlePinDelete = () => {
    setPinValue((prev) => prev.slice(0, -1));
  };

  const handlePinClear = () => {
    setPinValue('');
  };

  return {
    authMode,
    setAuthMode,
    pin: {
      value: pinValue,
      handleInput: handlePinInput,
      handleDelete: handlePinDelete,
      handleClear: handlePinClear,
      isPending: loginPinMutation.isPending,
    },
    password: {
      login: loginPasswordMutation.mutateAsync,
      isPending: loginPasswordMutation.isPending,
    },
  };
};