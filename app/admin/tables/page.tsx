'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Armchair,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Clock,
  Ban,
  Users,
} from 'lucide-react';
import GlobalHeaders from '@/src/components/ui/GlobalHeaders';
import { ConfirmStatusModal } from '@/src/components/ui/ConfirmStatusModal';
import { TableModal } from '@/src/components/admin/TableModal';
import { useAdminTables } from '@/src/hooks/tables/useAdminTables';
import { TableItem, TableFormValues, TableStatus } from '@/src/schemas/table.schema';

export default function AdminTablesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableItem | null>(null);
  const [statusModalTable, setStatusModalTable] = useState<TableItem | null>(null);

  const {
    tables,
    isLoading,
    isError,
    refetch,
    createTable,
    updateTable,
    changeStatus,
    isCreating,
    isUpdating,
  } = useAdminTables();

  // Listado único de zonas para el filtro
  const zones = useMemo(() => {
    return Array.from(new Set(tables.map((t) => t.zone).filter(Boolean)));
  }, [tables]);

  // Filtrado reactivo en memoria
  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchSearch =
        !searchTerm.trim() ||
        t.number.toString().includes(searchTerm.trim()) ||
        t.zone.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchZone = selectedZone === 'ALL' || t.zone === selectedZone;
      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;

      return matchSearch && matchZone && matchStatus;
    });
  }, [tables, searchTerm, selectedZone, selectedStatus]);

  // Estadísticas rápidas superiores
  const stats = useMemo(() => {
    const activeTables = tables.filter((t) => t.status !== TableStatus.INACTIVE);
    const totalCapacity = activeTables.reduce((acc, t) => acc + (t.capacity || 0), 0);
    const occupiedCount = tables.filter((t) => t.status === TableStatus.OCCUPIED).length;

    return {
      total: tables.length,
      active: activeTables.length,
      occupied: occupiedCount,
      capacity: totalCapacity,
    };
  }, [tables]);

  const handleOpenCreate = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (table: TableItem) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleSave = async (data: TableFormValues) => {
    if (editingTable) {
      await updateTable({ id: editingTable.id, payload: data });
    } else {
      await createTable(data);
    }
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleToggleStatus = async () => {
    if (!statusModalTable) return;
    const nextStatus =
      statusModalTable.status === TableStatus.INACTIVE
        ? TableStatus.AVAILABLE
        : TableStatus.INACTIVE;

    await changeStatus({ id: statusModalTable.id, status: nextStatus });
    setStatusModalTable(null);
  };

  const renderStatusBadge = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Disponible
          </span>
        );
      case TableStatus.OCCUPIED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Armchair className="w-3 h-3" /> Ocupada
          </span>
        );
      case TableStatus.RESERVED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-3 h-3" /> Reservada
          </span>
        );
      case TableStatus.INACTIVE:
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-500 border border-zinc-700">
            <Ban className="w-3 h-3" /> Inactiva
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlobalHeaders
          title="Gestión de Mesas y Áreas"
          description="Configura el número de mesas físicas, capacidad de comensales y distribución por zonas"
        />

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nueva Mesa
        </button>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-black uppercase text-zinc-500 block">Total Registradas</span>
          <span className="text-xl font-black text-white">{stats.total} mesas</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-black uppercase text-emerald-500/80 block">Operativas / Activas</span>
          <span className="text-xl font-black text-emerald-400">{stats.active} mesas</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-black uppercase text-amber-500/80 block">Con Comanda Activa</span>
          <span className="text-xl font-black text-amber-400">{stats.occupied} mesas</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] font-black uppercase text-purple-500/80 block">Capacidad Simultánea</span>
          <span className="text-xl font-black text-purple-400">{stats.capacity} comensales</span>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por número o zona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filtro por Zona */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todas las Zonas</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="ALL">Todos los Estados</option>
            <option value={TableStatus.AVAILABLE}>Disponibles</option>
            <option value={TableStatus.OCCUPIED}>Ocupadas</option>
            <option value={TableStatus.RESERVED}>Reservadas</option>
            <option value={TableStatus.INACTIVE}>Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Mesas */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Mesa</th>
                <th className="px-4 py-3.5">Área / Zona</th>
                <th className="px-4 py-3.5">Capacidad Sugerida</th>
                <th className="px-4 py-3.5">Estatus Operativo</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Cargando configuración de mesas...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-rose-400">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                    Error al cargar las mesas del establecimiento.
                    <button
                      onClick={() => refetch()}
                      className="block mx-auto mt-2 text-xs text-amber-400 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : filteredTables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Armchair className="w-8 h-8 mx-auto mb-2 text-zinc-600 stroke-[1.5]" />
                    No se encontraron mesas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTables.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Número de Mesa */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-black text-white text-sm">
                          {t.number}
                        </div>
                        <span className="font-bold text-white text-sm">Mesa {t.number}</span>
                      </div>
                    </td>

                    {/* Zona */}
                    <td className="px-4 py-3.5 font-semibold text-zinc-300">
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px]">
                        {t.zone || 'Sin área asignada'}
                      </span>
                    </td>

                    {/* Capacidad */}
                    <td className="px-4 py-3.5 font-medium text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        {t.capacity ? `${t.capacity} personas` : 'No definida'}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5">{renderStatusBadge(t.status)}</td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Editar mesa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatusModalTable(t)}
                        className={`p-2 rounded-lg transition-colors ${
                          t.status !== TableStatus.INACTIVE
                            ? 'bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400'
                            : 'bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400'
                        }`}
                        title={t.status !== TableStatus.INACTIVE ? 'Desactivar mesa' : 'Reactivar mesa'}
                      >
                        {t.status !== TableStatus.INACTIVE ? (
                          <Trash2 className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Desactivar / Reactivar */}
      <ConfirmStatusModal
        isOpen={Boolean(statusModalTable)}
        onClose={() => setStatusModalTable(null)}
        onConfirm={handleToggleStatus}
        title="Disponibilidad en el plano de mesas"
        itemName={statusModalTable ? `Mesa #${statusModalTable.number} (${statusModalTable.zone})` : ''}
        isActive={statusModalTable?.status !== TableStatus.INACTIVE}
        itemType="mesa"
        isLoading={isUpdating}
      />

      {/* Modal Crear / Editar */}
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingTable}
        isLoading={isCreating || isUpdating}
        existingZones={zones}
      />
    </div>
  );
}