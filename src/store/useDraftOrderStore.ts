import { create } from 'zustand';
import { DraftItem, Product } from '../types/pos';


interface DraftOrderState {
  draftItems: DraftItem[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearDraft: () => void;
}

export const useDraftOrderStore = create<DraftOrderState>((set) => ({
  draftItems: [],

  addProduct: (product: Product) =>
    set((state) => {
      const existing = state.draftItems.find(
        (item) => item.product.id === product.id,
      );
      if (existing) {
        return {
          draftItems: state.draftItems.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        draftItems: [...state.draftItems, { product, quantity: 1 }],
      };
    }),

  removeProduct: (productId: string) =>
    set((state) => ({
      draftItems: state.draftItems.filter((i) => i.product.id !== productId),
    })),

  updateQuantity: (productId: string, delta: number) =>
    set((state) => ({
      draftItems: state.draftItems
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as DraftItem[],
    })),

  clearDraft: () => set({ draftItems: [] }),
}));