'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  Trash2,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import GlobalHeaders from '@/src/components/ui/GlobalHeaders';
import { ConfirmStatusModal } from '@/src/components/ui/ConfirmStatusModal';
import { UserModal } from '@/src/components/admin/UserModal';
import { useAdminUsers } from '@/src/hooks/users/useAdminUsers';
import { EmployeeUser, UserFormValues } from '@/src/schemas/user.schema';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EmployeeUser | null>(null);
  const [statusModalUser, setStatusModalUser] = useState<EmployeeUser | null>(null);

  const {
    users,
    isLoading,
    isError,
    refetch,
    createUser,
    updateUser,
    isCreating,
    isUpdating,
  } = useAdminUsers();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      const matchName = u.fullName?.toLowerCase().includes(term);
      const matchEmail = u.email?.toLowerCase().includes(term);
      return matchName || matchEmail;
    });
  }, [users, searchTerm]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: EmployeeUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = async (data: UserFormValues) => {
    if (editingUser) {
      const payload: Partial<UserFormValues> = { ...data };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      await updateUser({ id: editingUser.id, payload });
    } else {
      await createUser(data);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleStatus = async () => {
    if (!statusModalUser) return;
    await updateUser({
      id: statusModalUser.id,
      payload: { isActive: !statusModalUser.isActive },
    });
    setStatusModalUser(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span key={role} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Admin
          </span>
        );
      case 'cashier':
        return (
          <span key={role} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Caja
          </span>
        );
      case 'bartender':
        return (
          <span key={role} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Barra
          </span>
        );
      default:
        return (
          <span key={role} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Mesero
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlobalHeaders
          title="Gestión de Empleados y Accesos"
          description="Control de personal, asignación de roles, contraseñas y bajas del sistema"
        />

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo Empleado
        </button>
        
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Tabla */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Empleado</th>
                <th className="px-4 py-3.5">Correo Electrónico</th>
                <th className="px-4 py-3.5">Roles Asignados</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Cargando listado de empleados...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-rose-400">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                    Error al cargar empleados.
                    <button
                      onClick={() => refetch()}
                      className="block mx-auto mt-2 text-xs text-amber-400 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-zinc-600 stroke-[1.5]" />
                    No se encontraron empleados registrados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white text-sm">{user.fullName}</td>
                    <td className="px-4 py-3.5 text-zinc-400">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((r) => getRoleBadge(r))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                          <XCircle className="w-3.5 h-3.5" /> De baja
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Editar empleado"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatusModalUser(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? 'bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400'
                            : 'bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400'
                        }`}
                        title={user.isActive ? 'Dar de baja' : 'Reactivar'}
                      >
                        {user.isActive ? (
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

      {/* Modal Soft-Delete / Reactivación */}
      <ConfirmStatusModal
        isOpen={Boolean(statusModalUser)}
        onClose={() => setStatusModalUser(null)}
        onConfirm={handleToggleStatus}
        title="Acceso al sistema y comandas"
        itemName={statusModalUser?.fullName ?? ''}
        isActive={statusModalUser?.isActive ?? true}
        itemType="empleado"
        isLoading={isUpdating}
      />

      {/* Modal Crear / Editar */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingUser}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}