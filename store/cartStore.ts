import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IProduct } from '@/types/products.interface';

export interface CartItem extends Omit<IProduct, 'inStock'> {
  quantity: number;
  guid: string
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryCost: number;
  total: number;
  
  // Actions
  addItem: (item: IProduct) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  increaseItem: (id: number) => void;
  decreaseItem: (id: number) => void;
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
        console.log('Добавляемый товар:', item); 
        const state = get();
        const existingItem = state.items.find(i => i.productId === item.productId);
        const isCupsCategory = (item.category || '').toLowerCase() === 'стаканы';
        const packageStep = isCupsCategory ? Math.max(1, parseInt(String(item.inPackage || '1')) || 1) : 1;
        
        if (existingItem) {
          // Если товар уже в корзине, увеличиваем количество
          set((state) => ({
            items: state.items.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + packageStep }
                : i
            )
          }));
        } else {
          // Добавляем новый товар
          set((state) => ({
            items: [...state.items, { ...item, quantity: packageStep, guid: item.guid }]
          }));
        }
        
        // Обновляем вычисляемые поля
        get().updateCalculations();
      },

      increaseItem: (id) => {
        const state = get();
        const item = state.items.find(i => i.productId === id);
        if (!item) return;
        const isCupsCategory = (item.category || '').toLowerCase() === 'стаканы';
        const packageStep = isCupsCategory ? Math.max(1, parseInt(String(item.inPackage || '1')) || 1) : 1;
        set((state) => ({
          items: state.items.map(i =>
            i.productId === id ? { ...i, quantity: i.quantity + packageStep } : i
          )
        }));
        get().updateCalculations();
      },

      decreaseItem: (id) => {
        const state = get();
        const item = state.items.find(i => i.productId === id);
        if (!item) return;
        const isCupsCategory = (item.category || '').toLowerCase() === 'стаканы';
        const packageStep = isCupsCategory ? Math.max(1, parseInt(String(item.inPackage || '1')) || 1) : 1;
        const nextQty = item.quantity - packageStep;
        if (nextQty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.productId === id ? { ...i, quantity: nextQty } : i
          )
        }));
        get().updateCalculations();
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== id)
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
            i.productId === id ? { ...i, quantity } : i
          )
        }));
        get().updateCalculations();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, subtotal: 0, deliveryCost: 0, total: 0 });
      },

      getItemQuantity: (id) => {
        const item = get().items.find(i => i.productId === id);
        return item ? item.quantity : 0;
      },

      isInCart: (id) => {
        return get().items.some(i => i.productId === id);
      },

      updateCalculations: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        const deliveryCost = subtotal > 50000 ? 0 : 0;
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
            const existingIndex = nextItems.findIndex(i => i.productId === orderItem.productId);
            const image = orderItem.url || resolveImageForTitle(orderItem.productName);
            if (existingIndex >= 0) {
              nextItems[existingIndex] = {
                ...nextItems[existingIndex],
                quantity: nextItems[existingIndex].quantity + orderItem.quantity,
                url: nextItems[existingIndex].url || image,
              };
            } else {
              nextItems.push({
                productId: orderItem.productId,
                productName: orderItem.productName,
                price: orderItem.price,
                guid: orderItem.guid,
                oldPrice: orderItem.oldPrice,
                category: orderItem.category,
                url: orderItem.url,
                quantity: orderItem.quantity,
                inPackage: orderItem.inPackage
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
