
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTables } from "@/src/hooks/useTables";
import { Table } from "@/src/types/table";
import { TableCard } from "@/src/components/tables/TableCard";
import { useRegisterPageController } from "@/src/hooks/useRegisterPageController";
import Loader from "@/src/components/common/Loader";
import { TableStatus } from "@/src/schemas/table.schema";


export default function TablesPage() {
  const router = useRouter();

  const { audit, hasActiveShift } = useRegisterPageController();
  const { data: tables = [], isLoading, isError, refetch } = useTables();

  //  const { tables = [], isLoading, isError, refetch } = useAdminTables();


  const [filter, setFilter] = useState<"ALL" | TableStatus>("ALL");

  // Métricas completas para los 4 estatus
  const metrics = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => t.status === TableStatus.AVAILABLE).length;
    const occupied = tables.filter((t) => t.status === TableStatus.OCCUPIED).length;
    const reserved = tables.filter((t) => t.status === TableStatus.RESERVED).length;
    const inactive = tables.filter((t) => t.status === TableStatus.INACTIVE).length;

    return { total, available, occupied, reserved, inactive };
  }, [tables]);

  // Filtrado reactivo en memoria
  const filteredTables = useMemo(() => {
    if (filter === "ALL") return tables;
    return tables.filter((t) => t.status === filter);
  }, [tables, filter]);

  // Manejo de clic según estatus y caja
  const handleSelectTable = (table: Table) => {
    // 1. Validar que la mesa esté operativa
    if (table.status === TableStatus.INACTIVE) {
      toast.warning(`La Mesa ${table.number} se encuentra fuera de servicio (Inactiva).`);
      return;
    }

    // 2. Validar turno de caja abierto
    if (!hasActiveShift || !audit) {
      toast.error("Debes realizar la apertura de turno antes de tomar comandas.");
      router.push("/register");
      return;
    }

    // 3. Mesa reservada: advertencia previa informativa
    if (table.status === TableStatus.RESERVED) {
      toast.info(`Mesa ${table.number} reservada. Se abrirá la comanda.`);
    }

    // 4. Redirigir al POS
    router.push(`/orders/${table.id}`);
  };

  if (isLoading) {
    return <Loader msg="Cargando estado de mesas..." />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-base text-rose-400 font-semibold">
          Error al conectar con el servidor del bar.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Barra superior con filtros y contadores */}
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Plano de Mesas
          </h1>
          <p className="text-xs text-zinc-400">
            Monitoreo en tiempo real: disponibles, ocupadas con comanda, reservadas y fuera de servicio.
          </p>
        </div>

        {/* Botones de filtro rápido para todos los estados */}
        <div className="flex flex-wrap items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "ALL"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Todas ({metrics.total})
          </button>

          <button
            onClick={() => setFilter(TableStatus.AVAILABLE)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === TableStatus.AVAILABLE
                ? "bg-emerald-600 text-white shadow"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
          >
            Libres ({metrics.available})
          </button>

          <button
            onClick={() => setFilter(TableStatus.OCCUPIED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === TableStatus.OCCUPIED
                ? "bg-amber-600 text-white shadow"
                : "text-zinc-400 hover:text-amber-400"
            }`}
          >
            Ocupadas ({metrics.occupied})
          </button>

          <button
            onClick={() => setFilter(TableStatus.RESERVED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === TableStatus.RESERVED
                ? "bg-purple-600 text-white shadow"
                : "text-zinc-400 hover:text-purple-400"
            }`}
          >
            Reservadas ({metrics.reserved})
          </button>

          {metrics.inactive > 0 && (
            <button
              onClick={() => setFilter(TableStatus.INACTIVE)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === TableStatus.INACTIVE
                  ? "bg-zinc-700 text-zinc-200 shadow"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Inactivas ({metrics.inactive})
            </button>
          )}
        </div>
      </header>

      {/* Grid de mesas */}
      {filteredTables.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-sm text-zinc-500">
            No se encontraron mesas con el filtro seleccionado.
          </p>
        </div>
      ) : (
        <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTables.map((table: Table) => (
            <TableCard
              key={table.id}
              table={table}
              onSelect={handleSelectTable}
            />
          ))}
        </main>
      )}
    </div>
  );
}