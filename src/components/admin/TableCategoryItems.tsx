"use client"



import { Category } from "@/actions/categories/getCategories";
import { Edit2, Trash2 } from "lucide-react";


type Props = {
    filteredCategories: Category[]
    handleOpenEdit: (category: Category) => void
    renderTypeBadge: (type: "PRODUCT" | "EXPENSE" | "BOTH") => React.JSX.Element
}

export default function TableCategoryItems({filteredCategories, handleOpenEdit, renderTypeBadge}:Props) {

     
  return (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-400 uppercase font-black text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Propósito</th>
                <th className="px-4 py-3.5">Productos Vinculados</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-zinc-500">
                    No se encontraron categorías con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white text-sm">{cat.title}</div>
                      {cat.description && (
                        <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">{renderTypeBadge(cat.type)}</td>
                    <td className="px-4 py-3.5 font-semibold text-zinc-300">
                      {cat.productsCount !== undefined ? `${cat.productsCount} items` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right flex space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2  rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    
  )
}
