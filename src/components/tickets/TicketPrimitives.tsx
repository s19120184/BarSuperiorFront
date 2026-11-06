

import { formatCurrency } from '@/src/lib/utils';




//Piezas modulares para armar cualquier formato de ticket en 3 líneas:
export const TicketHeader = ({
  name,
  address,
  taxId,
  phone,
  title,
}: {
  name: string;
  address?: string;
  taxId?: string;
  phone?: string;
  title?: string;
}) => (
  <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-black">
    <h1 className="text-sm font-black uppercase tracking-wider">{name}</h1>
    {address && <p className="text-[10px]">{address}</p>}
    {taxId && <p className="text-[10px]">RFC: {taxId}</p>}
    {phone && <p className="text-[10px]">Tel: {phone}</p>}
    {title && (
      <div className="pt-1">
        <span className="text-xs font-black uppercase tracking-widest inline-block border-y border-black py-0.5 w-full">
          {title}
        </span>
      </div>
    )}
  </div>
);

export const TicketRow = ({
  label,
  value,
  bold = false,
  small = false,
}: {
  label: string;
  value: string | number;
  bold?: boolean;
  small?: boolean;
}) => (
  <div
    className={`flex justify-between items-center ${
      bold ? 'font-black' : 'font-normal'
    } ${small ? 'text-[10px] text-zinc-600' : 'text-xs'}`}
  >
    <span>{label}</span>
    <span>{typeof value === 'number' ? formatCurrency(value) : value}</span>
  </div>
);

export const TicketDivider = () => (
  <div className="my-1.5 border-b border-dashed border-black" />
);

export const TicketFooter = ({ notes }: { notes?: string }) => (
  <div className="text-center pt-2 space-y-1 text-[9px] text-zinc-600">
    <p className="font-bold text-black text-[10px]">¡GRACIAS POR SU PREFERENCIA!</p>
    <p>{notes || 'Comprobante simplificado sin validez fiscal'}</p>
  </div>
);