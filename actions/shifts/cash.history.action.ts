


import { api } from '@/src/lib/api-client';
import { QueryShiftsParams, ShiftHistoryResponse } from '@/src/types/shifts';

export const getShiftsHistory = async (
  params: QueryShiftsParams
): Promise<ShiftHistoryResponse> => {
  const { data } = await api.get<ShiftHistoryResponse>('/cash-register/history', {
    params,
  });
  return data;
};