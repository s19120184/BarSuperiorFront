"use client";

import { TableStatus } from "@/src/schemas/table.schema";
import { Table } from "@/src/types/table";
import React from "react";

interface TableCardProps {
  table: Table;
  onSelect: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
  const isOccupied = table.status === TableStatus.OCCUPIED;

  const statusBadgeMap = {
    OCCUPIED: {
      container: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      dot: "bg-rose-400 animate-pulse",
      label: "Ocupada"
    },
    RESERVED: {
      container: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      dot: "bg-purple-400",
      label: "Reservada"
    },
    INACTIVE: {
      container: "bg-zinc-800 text-zinc-500 border-zinc-700",
      dot: "bg-zinc-600",
      label: "Inactiva"
    },
    AVAILABLE: {
      container: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      dot: "bg-emerald-400",
      label: "Libre"
    }
  }[table.status] ?? {
    container: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Libre"
  };

  console.log(table);

  return (
    <button
      onClick={() => onSelect(table)}
      className={`relative flex flex-col justify-between p-5 rounded-2xl border-2 transition-all duration-150 active:scale-95 text-left h-44 select-none ${
        isOccupied
          ? "bg-rose-950/20 border-rose-500/50 hover:border-rose-500 shadow-lg shadow-rose-950/30"
          : "bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500 shadow-lg shadow-emerald-950/20"
      }`}
    >
      {/* Cabecera de la mesa */}
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
            {table.zone || "Mesa"}
          </span>
          <h3 className="text-2xl font-black text-white">#{table.number}</h3>
        </div>

        {/* Badge de estado */}
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${statusBadgeMap.container}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadgeMap.dot}`}
          />
          {statusBadgeMap.label}
        </span>
      </div>

      {/* Información operativa inferior */}
      <div className="w-full pt-3 border-t border-zinc-800/80">
        {isOccupied && table.activeOrder ? (
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-zinc-400">
                {table.activeOrder.itemsCount || 0} productos
              </p>
              <p className="text-xs text-rose-300/80">Consumo activo</p>
            </div>
            <p className="text-xl font-bold text-white tracking-tight">
              ${Number(table.activeOrder.total || 0).toFixed(2)}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs">
              Capacidad: {table.capacity || 4} pers.
            </span>
            <span className="text-xs font-medium text-emerald-400 group-hover:underline">
              Toca para abrir →
            </span>
          </div>
        )}
      </div>
    </button>
  );
};
