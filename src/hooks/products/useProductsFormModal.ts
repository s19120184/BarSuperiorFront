import { Product, ProductImage } from "@/actions/products/product-interface";
import { CategoryOption } from "@/src/components/admin/ProductModal";
import {
  ProductFormInput,
  ProductFormValues,
  productSchema
} from "@/src/schemas/product.schema";
import { Category } from "@/src/types/pos";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface UseProductFormModalProps {
  isOpen: boolean;
  categories: CategoryOption[];
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => Promise<void> | void;
}

export const useProductFormModal = ({
  isOpen,
  categories,
  initialData,
  onSubmit
}: UseProductFormModalProps) => {
  const [newSize, setNewSize] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ProductFormInput, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      price: undefined,
      slug: "",
      sizes: [],
      is_prepared: false,
      is_active: true,
      stock: undefined,
      categoryId: "",
      images: []
    }
  });

  const currentSizes = watch("sizes") ?? [];

  const isPrepared = useWatch({
    control,
    name: "is_prepared",
    defaultValue: initialData?.is_prepared ?? false
  });

  // Sincronizar formulario cada vez que abre o cambia el producto seleccionado
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const normalizedImages = Array.isArray(initialData.images)
        ? initialData.images.map((img: ProductImage | string) =>
            typeof img === "string" ? img : (img as ProductImage).url
          )
        : [];

      reset({
        title: initialData.title,
        price: initialData.price ? Number(initialData.price) : undefined,
        slug: initialData.slug || "",
        sizes: initialData.sizes || [],
        is_prepared: initialData.is_prepared ?? false,
        is_active: initialData.is_active ?? true,
        stock: initialData.stock ? Number(initialData.stock) : undefined,
        categoryId: initialData.category?.id || "",
        images: normalizedImages
      });
    } else {
      reset({
        title: "",
        price: undefined,
        slug: "",
        sizes: [],
        is_prepared: false,
        is_active: true,
        stock: undefined,
        categoryId: categories[0]?.id || "",
        images: []
      });
    }
    setNewSize("");
  }, [initialData, reset, isOpen, categories]);

  // Manejo de tamaños / presentaciones
  const handleAddSize = () => {
    const trimmed = newSize.trim();
    if (trimmed && !currentSizes.includes(trimmed)) {
      setValue("sizes", [...currentSizes, trimmed], { shouldValidate: true });
      setNewSize("");
    }
  };

  const handleRemoveSize = (index: number) => {
    setValue(
      "sizes",
      currentSizes.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data as ProductFormValues);
  });

  return {
    register,
    control,
    errors,
    currentSizes,
    isPrepared,
    newSize,
    setNewSize,
    handleAddSize,
    handleRemoveSize,
    handleFormSubmit
  };
};
