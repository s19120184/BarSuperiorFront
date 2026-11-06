// 'use client';

// import React from 'react';
// import {
//   Plus,
//   Search,
//   Filter,
//   Edit2,
//   CheckCircle2,
//   XCircle,
//   Trash2,
//   Package,
//   AlertCircle,
//   Loader2,
// } from 'lucide-react';
// import Image from 'next/image';
// import { ProductModal } from '@/src/components/admin/ProductModal';
// import GlobalHeaders from '@/src/components/ui/GlobalHeaders';
// import { ConfirmStatusModal } from '@/src/components/ui/ConfirmStatusModal';
// import { PaginationBar } from '@/src/components/ui/PaginationBar';
// import { useAdminProductsPage } from '@/src/hooks/products/useAdminProductsPage';
// import { Category } from '@/src/types/pos';
// import { ProductImage } from '@/actions/products/product-interface';

// export default function AdminProductsPage() {
//   const {
//     searchTerm,
//     handleSearchChange,
//     selectedCat,
//     handleCategoryChange,
//     offset,
//     setOffset,
//     limit,
//     total,
//     categories,
//     products,
//     isLoading,
//     isError,
//     refetch,
//     isCreating,
//     isUpdating,
//     isModalOpen,
//     editingProduct,
//     statusModalProduct,
//     setStatusModalProduct,
//     handleOpenCreate,
//     handleOpenEdit,
//     handleCloseModal,
//     handleSave,
//     handleToggleStatus,
//   } = useAdminProductsPage();

//   return (
//     <div className="space-y-6">
//       {/* Encabezado */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <GlobalHeaders
//           title="Catálogo de Productos"
//           description="Administra precios, presentaciones, preparación y disponibilidad para venta"
//         />

//         <button
//           onClick={handleOpenCreate}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-transform active:scale-95"
//         >
//           <Plus className="w-4 h-4" />
//           Nuevo Producto
//         </button>
//       </div>

//       {/* Barra de Filtros y Búsqueda */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
//           <input
//             type="text"
//             placeholder="Buscar por nombre..."
//             value={searchTerm}
//             onChange={(e) => handleSearchChange(e.target.value)}
//             className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <Filter className="w-4 h-4 text-zinc-400" />
//           <select
//             value={selectedCat}
//             onChange={(e) => handleCategoryChange(e.target.value)}
//             className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
//           >
//             <option value="ALL">Todas las Categorías</option>
//             {categories.map((cat: Category) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.title}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Tabla de Productos */}
//       <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs">
//             <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
//               <tr>
//                 <th className="px-5 py-3.5">Producto</th>
//                 <th className="px-4 py-3.5">Categoría</th>
//                 <th className="px-4 py-3.5">Precio Base</th>
//                 <th className="px-4 py-3.5">Stock</th>
//                 <th className="px-4 py-3.5">Elaboración</th>
//                 <th className="px-4 py-3.5">Estado</th>
//                 <th className="px-4 py-3.5 text-right">Acciones</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
//                     <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
//                     Cargando catálogo de productos...
//                   </td>
//                 </tr>
//               ) : isError ? (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-8 text-center text-rose-400">
//                     <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
//                     Error al cargar los productos.
//                     <button
//                       onClick={() => refetch()}
//                       className="block mx-auto mt-2 text-xs text-amber-400 underline"
//                     >
//                       Reintentar
//                     </button>
//                   </td>
//                 </tr>
//               ) : products.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
//                     <Package className="w-8 h-8 mx-auto mb-2 text-zinc-600 stroke-[1.5]" />
//                     No se encontraron productos registrados.
//                   </td>
//                 </tr>
//               ) : (
//                 products.map((prod) => (
//                   <tr key={prod.id} className="hover:bg-zinc-800/30 transition-colors">
//                     {/* Producto */}
//                     <td className="px-5 py-3.5">
//                       <div className="flex items-center gap-3">
//                         {prod.images && prod.images.length > 0 ? (
//                           <Image
//                             width={40}
//                             height={40}
//                             src={
//                               typeof prod.images[0] === 'string'
//                                 ? prod.images[0]
//                                 : (prod.images[0] as ProductImage).url
//                             }
//                             alt={prod.title}
//                             className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 text-zinc-500">
//                             <Package className="w-4 h-4" />
//                           </div>
//                         )}
//                         <div>
//                           <div className="font-bold text-white text-sm">{prod.title}</div>
//                           {prod.sizes && prod.sizes.length > 0 && (
//                             <div className="text-[10px] text-zinc-400 mt-0.5">
//                               {prod.sizes.join(' • ')}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Categoría */}
//                     <td className="px-4 py-3.5 font-semibold text-zinc-300">
//                       {prod.category?.title ?? 'Sin categoría'}
//                     </td>

//                     {/* Precio */}
//                     <td className="px-4 py-3.5 font-black text-white">
//                       {prod.price !== undefined && prod.price !== null
//                         ? `$${Number(prod.price).toFixed(2)}`
//                         : '—'}
//                     </td>

//                     {/* Stock */}
//                     <td className="px-4 py-3.5 font-medium">
//                       {prod.stock !== undefined && prod.stock > 0 ? (
//                         <span>{prod.stock} uds</span>
//                       ) : (
//                         <span className="text-zinc-500 italic">N/A</span>
//                       )}
//                     </td>

//                     {/* Elaboración */}
//                     <td className="px-4 py-3.5">
//                       {prod.is_prepared ? (
//                         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
//                           Preparado
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
//                           Sellado
//                         </span>
//                       )}
//                     </td>

//                     {/* Estado */}
//                     <td className="px-4 py-3.5">
//                       {prod.is_active ? (
//                         <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
//                           <CheckCircle2 className="w-3.5 h-3.5" /> Activo
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500">
//                           <XCircle className="w-3.5 h-3.5" /> Inactivo
//                         </span>
//                       )}
//                     </td>

//                     {/* Acciones */}
//                     <td className=" flex px-4 py-3.5 text-right space-x-1">
//                       <button
//                         onClick={() => handleOpenEdit(prod)}
//                         className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
//                         title="Editar producto"
//                       >
//                         <Edit2 className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         onClick={() => setStatusModalProduct(prod)}
//                         className={`p-2 rounded-lg transition-colors ${
//                           prod.is_active
//                             ? 'bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400'
//                             : 'bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400'
//                         }`}
//                         title={prod.is_active ? 'Desactivar producto' : 'Activar producto'}
//                       >
//                         {prod.is_active ? (
//                           <Trash2 className="w-3.5 h-3.5" />
//                         ) : (
//                           <CheckCircle2 className="w-3.5 h-3.5" />
//                         )}
//                       </button>
//                     </td>

//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Componente Reutilizable de Paginación */}
//         <PaginationBar
//           total={total}
//           limit={limit}
//           offset={offset}
//           onOffsetChange={setOffset}
//           currentCount={products.length}
//           isLoading={isLoading}
//           resourceName="productos"
//         />
//       </div>

//       {/* Modal Confirmación de Estado */}
//       <ConfirmStatusModal
//         isOpen={Boolean(statusModalProduct)}
//         onClose={() => setStatusModalProduct(null)}
//         onConfirm={handleToggleStatus}
//         title="Control de visibilidad en el POS"
//         itemName={statusModalProduct?.title ?? ''}
//         isActive={statusModalProduct?.is_active ?? true}
//         itemType="producto"
//         isLoading={isUpdating}
//       />

//       {/* Modal Creación / Edición */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         initialData={editingProduct}
//         onSubmit={handleSave}
//         categories={categories}
//         isLoading={isCreating || isUpdating}
//       />
//     </div>
//   );
// }

'use client';

import React, { useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  CheckCircle2,
  XCircle,
  Trash2,
  Package,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { ProductModal } from '@/src/components/admin/ProductModal';
import GlobalHeaders from '@/src/components/ui/GlobalHeaders';
import { ConfirmStatusModal } from '@/src/components/ui/ConfirmStatusModal';
import { PaginationBar } from '@/src/components/ui/PaginationBar';
import { useAdminProductsPage } from '@/src/hooks/products/useAdminProductsPage';
import { Category } from '@/src/types/pos';
import { ProductImage } from '@/actions/products/product-interface';

const LOW_STOCK_THRESHOLD = 5;

export default function AdminProductsPage() {
  const {
    searchTerm,
    handleSearchChange,
    selectedCat,
    handleCategoryChange,
    offset,
    setOffset,
    limit,
    total,
    categories,
    products,
    isLoading,
    isError,
    refetch,
    isCreating,
    isUpdating,
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    statusModalProduct,
    setStatusModalProduct,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleToggleStatus,
  } = useAdminProductsPage();

  // Detectar productos sellados activos con stock bajo en la página actual
  const lowStockProducts = useMemo(() => {
    return products.filter(
      (p) => !p.is_prepared && p.is_active && (p.stock ?? 0) < LOW_STOCK_THRESHOLD
    );
  }, [products]);

  // Renderizador condicional para la columna de stock
  const renderStockBadge = (stock?: number, isPrepared?: boolean) => {
    if (isPrepared) {
      return <span className="text-zinc-500 italic">N/A</span>;
    }

    const currentStock = stock ?? 0;

    if (currentStock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-3 h-3" />
          Agotado (0)
        </span>
      );
    }

    if (currentStock < LOW_STOCK_THRESHOLD) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          {currentStock} uds (Bajo)
        </span>
      );
    }

    return (
      <span className="font-semibold text-zinc-300">
        {currentStock} uds
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <GlobalHeaders
          title="Catálogo de Productos"
          description="Administra precios, presentaciones, preparación y disponibilidad para venta"
        />

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 self-start sm:self-auto transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Alerta Global de Stock Crítico */}
      {lowStockProducts.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Atención: Tienes <strong>{lowStockProducts.length}</strong> producto(s) con menos de {LOW_STOCK_THRESHOLD} unidades disponibles en inventario.
            </span>
          </div>
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-400/80 hidden sm:inline-block">
            Reabastecimiento sugerido
          </span>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            value={selectedCat}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Todas las Categorías</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Producto</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Precio Base</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Elaboración</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Cargando catálogo de productos...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-rose-400">
                    <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-500" />
                    Error al cargar los productos.
                    <button
                      onClick={() => refetch()}
                      className="block mx-auto mt-2 text-xs text-amber-400 underline"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-zinc-600 stroke-[1.5]" />
                    No se encontraron productos registrados.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr
                    key={prod.id}
                    className={`hover:bg-zinc-800/30 transition-colors ${
                      !prod.is_prepared && (prod.stock ?? 0) < LOW_STOCK_THRESHOLD
                        ? 'bg-amber-500/[0.02]'
                        : ''
                    }`}
                  >
                    {/* Producto */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {prod.images && prod.images.length > 0 ? (
                          <Image
                            width={40}
                            height={40}
                            src={
                              typeof prod.images[0] === 'string'
                                ? prod.images[0]
                                : (prod.images[0] as ProductImage).url
                            }
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover border border-zinc-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 text-zinc-500">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{prod.title}</div>
                          {prod.sizes && prod.sizes.length > 0 && (
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              {prod.sizes.join(' • ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3.5 font-semibold text-zinc-300">
                      {prod.category?.title ?? 'Sin categoría'}
                    </td>

                    {/* Precio Base */}
                    <td className="px-4 py-3.5 font-black text-white">
                      {prod.price !== undefined && prod.price !== null
                        ? `$${Number(prod.price).toFixed(2)}`
                        : '—'}
                    </td>

                    {/* Stock con Alerta */}
                    <td className="px-4 py-3.5 font-medium">
                      {renderStockBadge(prod.stock, prod.is_prepared)}
                    </td>

                    {/* Elaboración */}
                    <td className="px-4 py-3.5">
                      {prod.is_prepared ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Preparado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Sellado
                        </span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5">
                      {prod.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                          <XCircle className="w-3.5 h-3.5" /> Inactivo
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className=" flex px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Editar producto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStatusModalProduct(prod)}
                        className={`p-2 rounded-lg transition-colors ${
                          prod.is_active
                            ? 'bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400'
                            : 'bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400'
                        }`}
                        title={prod.is_active ? 'Desactivar producto' : 'Activar producto'}
                      >
                        {prod.is_active ? (
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

        {/* Paginación */}
        <PaginationBar
          total={total}
          limit={limit}
          offset={offset}
          onOffsetChange={setOffset}
          currentCount={products.length}
          isLoading={isLoading}
          resourceName="productos"
        />
      </div>

      {/* Modal Confirmación de Estado */}
      <ConfirmStatusModal
        isOpen={Boolean(statusModalProduct)}
        onClose={() => setStatusModalProduct(null)}
        onConfirm={handleToggleStatus}
        title="Control de visibilidad en el POS"
        itemName={statusModalProduct?.title ?? ''}
        isActive={statusModalProduct?.is_active ?? true}
        itemType="producto"
        isLoading={isUpdating}
      />

      {/* Modal Creación / Edición */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingProduct}
        onSubmit={handleSave}
        categories={categories}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}