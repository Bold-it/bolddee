import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  storage: string;
  image_url: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }

        const newItems = get().items;
        const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ total });
      },

      removeItem: (id) => {
        const items = get().items.filter((i) => i.id !== id);
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ items, total });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        const items = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        set({ items, total });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);
