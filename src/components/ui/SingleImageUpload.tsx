'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImageToCloudinary } from '@/src/services/upload.service';
import Image from 'next/image';


interface SingleImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Formato no soportado');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
      toast.success('Imagen asignada');
    } catch (err: any) {
      toast.error(err.message || 'Error al subir imagen');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFile}
      />

      <div
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        className="relative w-20 h-20 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer hover:border-zinc-700 transition-all"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
        ) : value ? (
          <Image src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <UploadCloud className="w-5 h-5 text-zinc-500" />
        )}
      </div>

      <div className="space-y-1 text-xs">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-200"
        >
          {value ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="block text-[11px] text-rose-400 hover:underline"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
};