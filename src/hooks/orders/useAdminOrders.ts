'use client';

import { useState, useMemo } from 'react';
import { usePosOrder } from '@/src/hooks/usePosOrder';

export interface CancelTarget {
  orderId: string;
  itemId: string;
  itemTitle: string;
  tableNumber: number;
  tableId?:string;
  quantity?: number;
}

export const useAdminOrders = () => {
  const { openOrders = [], isLoading, cancelItem, refetchOpenOrders } = usePosOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [targetItem, setTargetItem] = useState<CancelTarget | null>(null);

  // Métricas consolidadas
  const stats = useMemo(() => {
    const totalOrders = openOrders.length;
    const totalRevenue = openOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );
    const totalItems = openOrders.reduce(
      (sum, o) =>
        sum +
        (o.items?.reduce((iSum, item) => iSum + Number(item.quantity || 0), 0) || 0),
      0
    );

    return { totalOrders, totalRevenue, totalItems };
  }, [openOrders]);

  // Filtrado reactivo en memoria
  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return openOrders;

    return openOrders.filter((order) => {
      const matchTable = order.table?.number?.toString().includes(query);
      const matchItem = order.items?.some((item) =>
        item.product?.title?.toLowerCase().includes(query)
      );
      return Boolean(matchTable || matchItem);
    });
  }, [openOrders, searchTerm]);



// Apertura del modal
  const openCancelModal = (target: CancelTarget) => {
    setTargetItem(target);
  };

  const closeCancelModal = () => {
    if (!cancelItem.isPending) {
      setTargetItem(null);
    }
  };

  // Confirmación desde el modal
  const handleConfirmCancel = async () => {
    if (!targetItem) return;

    try {
      await cancelItem.mutateAsync({
        orderId: targetItem.orderId,
        itemId: targetItem.itemId,
        tableId: targetItem.tableId,
      });
      setTargetItem(null);
    } catch {
      // El error ya es manejado por el toast en el onError de la mutación
    }
  };

  return {
    orders: filteredOrders,
    rawOrdersCount: openOrders.length,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    targetItem,
    openCancelModal,
    closeCancelModal,
    handleConfirmCancel,
    isCancelling: cancelItem.isPending,
    refetchOrders: refetchOpenOrders,
  };
};