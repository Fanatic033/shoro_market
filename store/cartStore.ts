import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: any;
  quantity: number;
  isNew?: boolean;
  isHit?: boolean;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryCost: number;
  total: number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: number) => number;
  isInCart: (id: number) => boolean;
  updateCalculations: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      deliveryCost: 0,
      total: 0,

      addItem: (item) => {
        const state = get();
        const existingItem = state.items.find(i => i.id === item.id);
        
        if (existingItem) {
          // Если товар уже в корзине, увеличиваем количество
          set((state) => ({
            items: state.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }));
        } else {
          // Добавляем новый товар
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }]
          }));
        }
        
        // Обновляем вычисляемые поля
        get().updateCalculations();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
        get().updateCalculations();
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set((state) => ({
          items: state.items.map(i => 
            i.id === id ? { ...i, quantity } : i
          )
        }));
        get().updateCalculations();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, subtotal: 0, deliveryCost: 0, total: 0 });
      },

      getItemQuantity: (id) => {
        const item = get().items.find(i => i.id === id);
        return item ? item.quantity : 0;
      },

      isInCart: (id) => {
        return get().items.some(i => i.id === id);
      },

      updateCalculations: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryCost = subtotal > 50000 ? 0 : 500; // Бесплатная доставка от 50000 сом
        const total = subtotal + deliveryCost;
        
        set({ totalItems, subtotal, deliveryCost, total });
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        subtotal: state.subtotal,
        deliveryCost: state.deliveryCost,
        total: state.total
      }),
    }
  )
);
