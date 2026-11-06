'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import Image from 'next/image';
import { uploadImageToCloudinary } from '@/src/services/upload.service';

interface ImageUploadDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  images,
  onChange,
  maxFiles = 4,
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`Solo puedes subir un máximo de ${maxFiles} imágenes`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validación de tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error(`El archivo ${file.name} no es una imagen válida`);
        }
        // Validación de peso (ej. máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`La imagen ${file.name} excede el límite de 5MB`);
        }

        return await uploadImageToCloudinary(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
      toast.success('Imágenes cargadas correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al subir imagen a Cloudinary');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Zona de Drop & Selección */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (!disabled && !isUploading) handleProcessFiles(e.dataTransfer.files);
        }}
        onClick={() => {
          if (!disabled && !isUploading && images.length < maxFiles) {
            fileInputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          isDragOver
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
        } ${disabled || isUploading || images.length >= maxFiles ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled || isUploading || images.length >= maxFiles}
          onChange={(e) => handleProcessFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span className="text-xs font-bold text-zinc-300">
              Optimizando y subiendo a Cloudinary...
            </span>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200">
                {images.length >= maxFiles
                  ? 'Límite de imágenes alcanzado'
                  : 'Arrastra imágenes aquí o haz clic para explorar'}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                PNG, JPG o WEBP (Máx. 5MB por archivo • {images.length}/{maxFiles})
              </p>
            </div>
          </>
        )}
      </div>

      {/* Grid de Previsualización y Eliminación */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md"
            >
              <Image
                src={url}
                alt={`Imagen producto ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                width={400}
                height={400}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(idx);
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-all"
                title="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-black uppercase text-amber-400">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};