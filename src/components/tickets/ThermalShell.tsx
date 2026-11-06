'use client';

import React from 'react';

interface ThermalShellProps {
  children: React.ReactNode;
  title?: string;
}


//Maneja el ancho exacto de 80mm, el reseteo de márgenes y oculta la UI al imprimir:
export const ThermalShell: React.FC<ThermalShellProps> = ({ children }) => {
  return (
    <div className="thermal-shell font-mono text-[12px] leading-tight text-black bg-white p-4 max-w-[80mm] mx-auto select-none">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .thermal-shell {
            width: 78mm !important;
            max-width: 78mm !important;
            padding: 3mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
};