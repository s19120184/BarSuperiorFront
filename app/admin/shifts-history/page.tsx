"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import GlobalHeaders from "@/src/components/ui/GlobalHeaders";
import { PaginationBar } from "@/src/components/ui/PaginationBar";
import { useShiftsHistory } from "@/src/hooks/cash/useShiftsHistory";
import { ShiftStatus, BalanceStatus } from "@/src/types/shifts";

const LIMIT = 8;

export default function ShiftsHistoryPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<ShiftStatus | undefined>(
    ShiftStatus.CLOSED
  );
  const [offset, setOffset] = useState(0);

  // Consulta al backend
  const { data, isLoading, isError, refetch } = useShiftsHistory({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status,
    limit: LIMIT,
    offset
  });

  const shifts = data?.shifts ?? [];
  const total = data?.total ?? 0;

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus(ShiftStatus.CLOSED);
    setOffset(0);
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val === null || val === undefined) return "—";
    return `$${Number(val).toFixed(2)}`;
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const renderBalanceBadge = (
    balanceStatus: BalanceStatus,
    difference: number | null
  ) => {
    switch (balanceStatus) {
      case "CUADRADA":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Cuadrada ($0.00)
          </span>
        );
      case "SOBRANTE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" /> +{formatCurrency(difference)}{" "}
            Sobrante
          </span>
        );
      case "FALTANTE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> {formatCurrency(difference)}{" "}
            Faltante
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Turno Abierto
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlobalHeaders
          title="Historial de Cortes y Turnos"
          description="Auditoría de aperturas, cierres de caja y balances de efectivo por fecha"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-wrap gap-4 items-end">
        {/* Fecha Desde */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 block">
            Fecha Inicio
          </label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setOffset(0);
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 block">
            Fecha Fin
          </label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setOffset(0);
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Estado del Turno */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 block">
            Estado del Turno
          </label>
          <select
            value={status ?? "ALL"}
            onChange={(e) => {
              const val = e.target.value;
              setStatus(val === "ALL" ? undefined : (val as ShiftStatus));
              setOffset(0);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value={ShiftStatus.CLOSED}>Solo Turnos Cerrados</option>
            <option value={ShiftStatus.OPEN}>Solo Turnos Abiertos</option>
            <option value="ALL">Todos los Estados</option>
          </select>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Turno / Responsables</th>
                <th className="px-4 py-3.5">Horario Apertura / Cierre</th>
                <th className="px-4 py-3.5">Fondo Inicial</th>
                <th className="px-4 py-3.5">Esperado en Caja</th>
                <th className="px-4 py-3.5">Reportado en Corte</th>
                <th className="px-4 py-3.5">Resultado Balance</th>
                <th className="px-4 py-3.5">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-zinc-500"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Consultando historial de cortes...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-rose-400"
                  >
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                    Error al cargar el historial.
                    <button
                      onClick={() => refetch()}
                      className="block mx-auto mt-2 text-xs text-amber-400 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-zinc-500"
                  >
                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-zinc-600 stroke-[1.5]" />
                    No se encontraron turnos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                shifts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Nombre del turno y cajeros */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-sm">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        <span className="text-zinc-500">Abre:</span>{" "}
                        {item.openedBy}
                        {item.closedBy !== "N/A" && (
                          <>
                            {" "}
                            • <span className="text-zinc-500">
                              Cierra:
                            </span>{" "}
                            {item.closedBy}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Tiempos */}
                    <td className="px-4 py-3.5 text-zinc-300">
                      <div>
                        <span className="text-zinc-500 text-[10px] block">
                          Apertura:
                        </span>
                        {formatDate(item.openedAt)}
                      </div>
                      {item.closedAt && (
                        <div className="mt-1">
                          <span className="text-zinc-500 text-[10px] block">
                            Cierre:
                          </span>
                          {formatDate(item.closedAt)}
                        </div>
                      )}
                    </td>

                    {/* Fondo inicial */}
                    <td className="px-4 py-3.5 font-medium text-zinc-300">
                      {formatCurrency(item.financials.initialAmount)}
                    </td>

                    {/* Esperado */}
                    <td className="px-4 py-3.5 font-bold text-zinc-200">
                      {formatCurrency(item.financials.expectedAmount)}
                    </td>

                    {/* Reportado */}
                    <td className="px-4 py-3.5 font-black text-white">
                      {formatCurrency(item.financials.actualAmount)}
                    </td>

                    {/* Estado del Balance */}
                    <td className="px-4 py-3.5">
                      {renderBalanceBadge(
                        item.financials.balanceStatus,
                        item.financials.difference
                      )}
                    </td>

                    {/* Notas */}
                    <td className="px-4 py-3.5 max-w-[180px] truncate text-zinc-400 text-[11px]">
                      {item.notes || (
                        <span className="text-zinc-600 italic">
                          Sin observaciones
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Reutilizable */}
        <PaginationBar
          total={total}
          limit={LIMIT}
          offset={offset}
          onOffsetChange={setOffset}
          currentCount={shifts.length}
          isLoading={isLoading}
          resourceName="cortes"
        />
      </div>
    </div>
  );
}
