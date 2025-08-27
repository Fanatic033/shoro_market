import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  inpackage?: number | null;
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
  addItemsFromOrder: (items: CartItem[]) => void;
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
        const subtotal = state.items.reduce((sum, item) => {
          const packSize = item.inpackage && item.inpackage > 1 ? item.inpackage : 1;
          return sum + (item.price * packSize * item.quantity);
        }, 0);
        const deliveryCost = subtotal > 50000 ? 0 : 500; // Бесплатная доставка от 50000 сом
        const total = subtotal + deliveryCost;
        
        set({ totalItems, subtotal, deliveryCost, total });
      },

      // Добавляет товары из прошлого заказа, суммируя количество с текущей корзиной
      addItemsFromOrder: (orderItems) => {
        const resolveImageForTitle = (title?: string) => {
          const name = (title || '').toLowerCase();
          try {
            if (name.includes('квас')) return require('../assets/images/shoro.png');
            if (name.includes('тан')) return require('../assets/images/shoro1.png');
            if (name.includes('вода') || name.includes('легенда')) return require('../assets/images/shoro2.png');
            if (name.includes('стакан')) return require('../assets/images/shoro1.png');
            return require('../assets/images/shoro.png');
          } catch {
            return undefined as any;
          }
        };

        set((state) => {
          const nextItems = [...state.items];

          for (const orderItem of orderItems) {
            const existingIndex = nextItems.findIndex(i => i.id === orderItem.id);
            const image = orderItem.image || resolveImageForTitle(orderItem.title);
            if (existingIndex >= 0) {
              nextItems[existingIndex] = {
                ...nextItems[existingIndex],
                quantity: nextItems[existingIndex].quantity + orderItem.quantity,
                image: nextItems[existingIndex].image || image,
              };
            } else {
              nextItems.push({
                id: orderItem.id,
                title: orderItem.title,
                price: orderItem.price,
                originalPrice: orderItem.originalPrice,
                image,
                isNew: orderItem.isNew,
                isHit: orderItem.isHit,
                discount: orderItem.discount,
                inpackage: orderItem.inpackage,
                quantity: orderItem.quantity,
              });
            }
          }

          return { items: nextItems };
        });

        get().updateCalculations();
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => AsyncStorage),
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
