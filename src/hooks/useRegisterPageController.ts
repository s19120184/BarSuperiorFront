import { useState } from 'react';
import { useCashRegister } from './useCashRegister';
import {
  OpenShiftFormValues,
  ExpenseFormValues,
  MovementFormValues,
} from '../schemas/cash-register.schema';


export const useRegisterPageController = () => {
  const {
    audit,
    hasActiveShift,
    isLoading,
    isRefetching,
    refetchAudit,
    openShift,
    addMovement,
    addExpense,
  } = useCashRegister();
              
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const handleOpenShift = async (data: OpenShiftFormValues) => {
    await openShift.mutateAsync(data);
  };

  const handleCreateExpense = async (data: ExpenseFormValues) => {
    await addExpense.mutateAsync({
      description: data.description,
      amount: data.amount,
      supplier: data.supplier || undefined,
      categoryId:data.categoryId
    });
    setIsExpenseModalOpen(false);
  };

  const handleCreateMovement = async (data: MovementFormValues) => {
    
    await addMovement.mutateAsync({
      amount: data.amount,
      reason: data.reason,
    });
    setIsMovementModalOpen(false);
  };

  return {
    audit,
    hasActiveShift,
    isLoading,
    isRefetching,
    refetchAudit,
    modals: {
      isExpenseModalOpen,
      setIsExpenseModalOpen,
      isMovementModalOpen,
      setIsMovementModalOpen,
    },
    actions: {
      handleOpenShift,
      handleCreateExpense,
      handleCreateMovement,
    },
    pending: {
      isOpenPending: openShift.isPending,
      isExpensePending: addExpense.isPending,
      isMovementPending: addMovement.isPending,
    },
  };
};