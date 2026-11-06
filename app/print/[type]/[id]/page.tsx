/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { use, useState, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { ThermalShell } from "@/src/components/tickets/ThermalShell";
import { OrderTicketContent } from "@/src/components/tickets/OrderTicketContent";
import { ShiftTicketContent } from "@/src/components/tickets/ShiftTicketContent";
import { api } from "@/src/lib/api-client";
import { TicketDataDto, ShiftTicketResponse } from "@/src/types/ticket";
import { BluetoothThermalPrinter } from "@/src/lib/bluetooth-printer";
import {
  convertOrderTicketToEscPos,
  convertShiftTicketToEscPos
} from "@/src/lib/thermal-ticket-converter";

interface PrintParams {
  type: "precheck" | "receipt" | "corte-z";
  id: string;
}

// Suscripción vacía (la presencia de navigator.bluetooth no cambia dinámicamente)
const subscribe = () => () => {};

// Lector de la API en el cliente
const getSupportsBtSnapshot = () => {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
};

// Snapshot para el servidor (SSR de Next.js)
const getServerSnapshot = () => false;

export default function GenericThermalPrintPage({
  params
}: {
  params: Promise<PrintParams>;
}) {
  const { type, id } = use(params);
  const [isPrintingBt, setIsPrintingBt] = useState(false);

  const supportsBt = useSyncExternalStore(
    subscribe,
    getSupportsBtSnapshot,
    getServerSnapshot
  );

  const getEndpoint = () => {
    switch (type) {
      case "precheck":
        return `/tickets/precheck/${id}`;
      case "receipt":
        return `/tickets/receipt/${id}`;
      case "corte-z":
        return `/tickets/corte-z/${id}`;
      default:
        throw new Error("Tipo de ticket no soportado");
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["print-ticket", type, id],
    queryFn: async () => {
      const { data } = await api.get(getEndpoint());
      return data;
    }
  });

  const handleBluetoothPrint = async () => {
    if (!data) return;
    setIsPrintingBt(true);

    try {
      const payload =
        type === "corte-z"
          ? convertShiftTicketToEscPos(data as ShiftTicketResponse)
          : convertOrderTicketToEscPos(data as TicketDataDto);

      const printer = new BluetoothThermalPrinter();
      await printer.connect();
      await printer.printTicket(payload);
      printer.disconnect();
    } catch (err: any) {
      alert(
        `Error Bluetooth: ${err.message || "No se pudo completar la impresión"}`
      );
    } finally {
      setIsPrintingBt(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center font-mono text-xs text-zinc-500">
        Preparando ticket...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col h-screen items-center justify-center font-mono text-xs text-rose-500 gap-2 p-4 text-center">
        <p>No se pudo cargar la información para imprimir.</p>
        <button
          onClick={() => window.close()}
          className="px-3 py-1 bg-zinc-800 text-white rounded text-[11px]"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pb-12">
      {/* Botones de acción (ocultos al imprimir con window.print() gracias a la clase .no-print de ThermalShell) */}
      <div className="no-print my-4 flex gap-2">
        {supportsBt && (
          <button
            onClick={handleBluetoothPrint}
            disabled={isPrintingBt}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow disabled:opacity-50"
          >
            {isPrintingBt
              ? "Imprimiendo en POS-80..."
              : "Imprimir Bluetooth (POS-80)"}
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white rounded text-xs font-semibold shadow"
        >
          Impresión Estándar
        </button>
      </div>

      {/* Renderizado de tus componentes visuales existentes */}
      <ThermalShell>
        {(type === "precheck" || type === "receipt") && (
          <OrderTicketContent data={data as TicketDataDto} />
        )}
        {type === "corte-z" && (
          <ShiftTicketContent data={data as ShiftTicketResponse} />
        )}
      </ThermalShell>
    </div>
  );
}
