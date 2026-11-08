import { useMemo, useState } from "react";
import { usePosOrder } from "./usePosOrder";
import { useDraftOrderStore } from "../store/useDraftOrderStore";
import { toast } from "sonner";

export const useProducts = (tableId: string) => {
  const { table, activeOrder, categories, products, isLoading, sendRound } =
    usePosOrder(tableId);

  //console.log(activeOrder);

  const { draftItems, addProduct, removeProduct, updateQuantity, clearDraft } =
    useDraftOrderStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  //Filtrado reactivo de productos por categoría y texto
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCat =
        selectedCategory === "ALL" || prod.category?.id === selectedCategory;

      const matchText = prod.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCat && matchText;
    });
  }, [products, selectedCategory, searchTerm]);

  // Cálculos de totales
  const draftTotal = useMemo(() => {
   
    //console.log( draftItems.map(item=> item.product ) )

    
    return draftItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [draftItems]);

  const servedTotal = Number(activeOrder?.total || 0);
  const grandTotal = servedTotal + draftTotal;

  // Confirmar y enviar la ronda
  const handleConfirmRound = async () => {
   
    if (draftItems.length === 0) return;

    try {
      await sendRound.mutateAsync({
        tableId,
        orderId: activeOrder?.id || '',
        items: draftItems
      });
      clearDraft();
      toast.success("Ronda enviada a preparación");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Error al enviar ronda de comanda"
      );
    }
  };

  return {
    table,
    categories,
    isLoading,
    addProduct,
    removeProduct,
    updateQuantity,
    setSelectedCategory,
    setSearchTerm,
    filteredProducts,
    grandTotal,
    handleConfirmRound,
    searchTerm,
    selectedCategory,
    products,
    activeOrder,
    draftItems,
    clearDraft,
    sendRound,
    draftTotal,
    servedTotal
  };
};
