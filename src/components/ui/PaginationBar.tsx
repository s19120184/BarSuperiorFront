'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  total: number;
  limit: number;
  offset: number;
  onOffsetChange: (newOffset: number) => void;
  currentCount: number;
  isLoading?: boolean;
  resourceName?: string; // ej. 'cortes', 'productos', 'categorías'
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  total,
  limit,
  offset,
  onOffsetChange,
  currentCount,
  isLoading = false,
  resourceName = 'registros',
}) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handlePrevPage = () => {
    onOffsetChange(Math.max(0, offset - limit));
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      onOffsetChange(offset + limit);
    }
  };

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-800 bg-zinc-950/40 text-xs">
      <span className="text-zinc-400">
        Mostrando <strong className="text-white">{currentCount}</strong> de{' '}
        <strong className="text-white">{total}</strong> {resourceName} registrados
      </span>

      <div className="flex items-center gap-2">
        <span className="text-zinc-500 mr-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={offset === 0 || isLoading}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={offset + limit >= total || isLoading}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 transition-colors"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};