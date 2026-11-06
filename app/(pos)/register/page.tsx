'use client';

import { ActiveShiftAudit } from "@/src/components/register/ActiveShiftAudit";
import { ExpenseModal, MovementModal } from "@/src/components/register/Modal";
import { OpenShiftCard } from "@/src/components/register/OpenShiftCard";
import { useRegisterPageController } from "@/src/hooks/useRegisterPageController";




export default function CashRegisterPage() {
  const {
    audit,
    hasActiveShift,
    isLoading,
    isRefetching,
    refetchAudit,
    modals,
    actions,
    pending,
  } = useRegisterPageController();

    

  if (isLoading) {
    return (
      <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Verificando estado de caja...</p>
        </div>
      </div>
    );
  }

  if (!hasActiveShift || !audit) {
    return (
      <OpenShiftCard
        onSubmit={actions.handleOpenShift}
        isPending={pending.isOpenPending}
      />
    );
  }

  return (
    <>
      <ActiveShiftAudit
        audit={audit}
        isRefetching={isRefetching}
        onRefresh={() => refetchAudit()}
        onOpenExpenseModal={() => modals.setIsExpenseModalOpen(true)}
        onOpenMovementModal={() => modals.setIsMovementModalOpen(true)}
      />

      <ExpenseModal
        isOpen={modals.isExpenseModalOpen}
        onClose={() => modals.setIsExpenseModalOpen(false)}
        onSubmit={actions.handleCreateExpense}
        isPending={pending.isExpensePending}
      />

      <MovementModal
        isOpen={modals.isMovementModalOpen}
        onClose={() => modals.setIsMovementModalOpen(false)}
        onSubmit={actions.handleCreateMovement}
        isPending={pending.isMovementPending}
      />
    </>
  );
}