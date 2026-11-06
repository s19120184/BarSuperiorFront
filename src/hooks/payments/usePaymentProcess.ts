"use client"


import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/src/lib/api-client";
import { Order } from "@/src/types/pos";
import { Pyramid } from "lucide-react";

export type PaymentMethod = "CASH" | "CARD" | "TRANSFER";

export interface ProcessPaymentPayload {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  tip?: number;
  receivedAmount?: number;
}

export const usePaymentProcess = (tableId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  let orderId:string 

  // Estados de formulario de cobro
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>("");
  const [cashReceived, setCashReceived] = useState<string>("");

  // 1. Obtener la orden activa asociada a la mesa
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", "active", tableId],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/table/${tableId}`);
      return data;
    }
  });

  // 2. Cálculos financieros
  const subtotal = Number(order?.total || 0);

  const tipAmount = useMemo(() => {
    if (customTip !== "") {
      return Math.max(0, Number(customTip) || 0);
    }
    return tipPercentage > 0 ? (subtotal * tipPercentage) / 100 : 0;
  }, [subtotal, tipPercentage, customTip]);

  const totalToPay = subtotal + tipAmount;
  const numCashReceived = Number(cashReceived) || 0;
  const changeDue = Math.max(0, numCashReceived - totalToPay);
  const isCashSufficient = method !== "CASH" || numCashReceived >= totalToPay;

  // Sugerencias de billetes rápidos redondeados hacia arriba
  const quickCashAmounts = useMemo(() => {
    if (totalToPay <= 0) return [];
    const ceil100 = Math.ceil(totalToPay / 100) * 100;
    const ceil200 = Math.ceil(totalToPay / 200) * 200;
    const ceil500 = Math.ceil(totalToPay / 500) * 500;
    return Array.from(new Set([totalToPay, ceil100, ceil200, ceil500]))
      .filter((amt) => amt >= totalToPay)
      .slice(0, 4);
  }, [totalToPay]);

  // 3. Mutación de liquidación
  const paymentMutation = useMutation({
    mutationFn: async (payload: ProcessPaymentPayload) => {
      try {
        const { data } = await api.post("/payments", payload);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
   
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["table", tableId] });
      queryClient.invalidateQueries({ queryKey: ["order", "active", tableId] });
      queryClient.invalidateQueries({ queryKey: ["shift", "audit"] });

     
      toast.success("Pago procesado con éxito. Mesa liberada.");

    //   console.log(data.orderId)

    //  console.log(`/tickets/${data.orderId}`, '_blank', 'width=400,height=650')
     //. Abrir el ticket en una pestaña emergente para impresión rápida
    window.open(`/print/receipt/${data.orderId}`, '_blank', 'width=400,height=650');

      router.push("/tables");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Error al procesar el cobro");
    }
  });

  // 4. Handlers
  const handleSelectTipPercentage = (percentage: number) => {
    setCustomTip("");
    setTipPercentage(percentage);
  };

  const handleCustomTipChange = (value: string) => {
    setTipPercentage(0);
    setCustomTip(value);
  };

  const handleClearTip = () => {
    setTipPercentage(0);
    setCustomTip("");
  };

  const handleProcessPayment = async () => {
    if (!order) return;

    if (method === "CASH" && numCashReceived < totalToPay) {
      toast.error("El efectivo recibido es menor al total a liquidar");
      return;
    }

    // Construimos el payload alineado exactamente a tu CreatePaymentDto
    const payload: ProcessPaymentPayload = {
      orderId: order.id,
      method,
      amount: subtotal,
      tip: tipAmount > 0 ? tipAmount : undefined,
      // Solo enviamos receivedAmount si el pago es en efectivo y el valor es mayor a 0
      ...(method === "CASH" && numCashReceived > 0
        ? { receivedAmount: numCashReceived }
        : {})
    };

   
    await paymentMutation.mutateAsync(payload);

    // await paymentMutation.mutateAsync({
    //   orderId: order.id,
    //   method,
    //   amount: subtotal,
    //   tip: tipAmount,
    //   receivedAmount: method === 'CASH' ? numCashReceived : undefined,
    // });
  };

  const handlePrintPrecuenta = () => {
    if (!order) return;
    window.open(`/print/precheck/${order.id}`, '_blank', 'width=400,height=650');
  };

  return {
    order,
    isLoading,
    isProcessing: paymentMutation.isPending,
    financials: {
      subtotal,
      tipAmount,
      totalToPay,
      numCashReceived,
      changeDue,
      isCashSufficient,
      quickCashAmounts
    },
    form: {
      method,
      setMethod,
      tipPercentage,
      customTip,
      cashReceived,
      setCashReceived
    },
    actions: {
      selectTipPercentage: handleSelectTipPercentage,
      setCustomTip: handleCustomTipChange,
      clearTip: handleClearTip,
      processPayment: handleProcessPayment,
      printPrecuenta: handlePrintPrecuenta,
      goBackToOrder: () => router.push(`/orders/${tableId}`),
      goToTables: () => router.push("/tables")
    }
  };
};
