import { PAYMENT_METHOD_MAP, PAYMENT_METHODS } from '@/utils/constants/paymentMethods';
import axiosApi from '@/utils/instance';
import { getUserIdFromToken } from '@/utils/jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from "./authStore";
import { CartItem } from './cartStore';


export interface Order {
  id: string;
  products: CartItem[];
  deliveryAddress: string;
  customerName: string;
  contactPhone: string;
  description?: string;
  deliveryDate: string;
  // status: 'В ожидании' | 'Завершен' | 'Обрабатывается' | 'В пути' | 'Доставлен' | 'Отменен';
  createdAt: Date;
  estimatedDelivery?: Date;
}

// Новый тип для создания заказа — status не обязателен
export type OrderCreateData = Omit<Order, 'id' | 'createdAt'> & {
  payment: typeof PAYMENT_METHODS[number]['id']; 
  // status?: Order['status']; // опционально
};
interface OrderState {
  orders: Order[];
  
  // Actions
  createOrder: (orderData:OrderCreateData ) => Promise<string | undefined>;
  getOrderById: (orderId: string) => Order | undefined;
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: async (orderData) => {
        const user = useAuthStore.getState().user;
        console.log('Текущий пользователь:', user)
        
        if (!user) {
          console.warn("Пользователь не авторизован — заказ не может быть создан");
          return undefined;
        }
      
        // Получаем userId — сначала из токена, fallback на user.id
        if (!user?.accessToken) return;
        const userId = getUserIdFromToken(user.accessToken);
        if (!userId) return;
      
      
        if (!userId) {
          console.warn("Не удалось определить userId");
          return undefined;
        }
      
        // Формируем client — guid из профиля, если есть
        const client = {
          guid: user.clientGuid || null,
          name: orderData.customerName,
          address: orderData.deliveryAddress,
          phone: orderData.contactPhone,
        };
      
        // Маппинг товаров
        const products = orderData.products.map((item) => ({
          guid: item.guid,
          price: item.price,
          quantity: item.quantity,
        }));
      
        
        const payment = PAYMENT_METHOD_MAP[orderData.payment] || 0;
      
        // Формируем payload для API
        const payload = {
          userId: userId,
          client,
          date: orderData.deliveryDate,
          payment: payment,
          description: orderData.description || undefined,
          contactPhone: orderData.contactPhone,
          deliveryAddress: orderData.deliveryAddress,
          products: products,
        };
      
        try {
          console.log("📤 Отправляем заказ на сервер:", payload);
      
          const response = await axiosApi.post("/orders/create", payload);
          console.log("✅ Заказ успешно создан:", response.data);
      
          // Создаём локальную запись
          const newOrder: Order = {
            ...orderData,
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };
      
          set((state) => ({
            orders: [newOrder, ...state.orders],
          }));
      
          return newOrder.id;
        } catch (error) {
          console.error("❌ Ошибка создания заказа:", error);
          throw new Error("Не удалось оформить заказ. Проверьте соединение.");
        }
      },
      

      getOrderById: (orderId) => {
        return get().orders.find(order => order.id === orderId);
      },

      getRecentOrders: (limit = 5) => {
        return get().orders
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, limit);
      },
    }),
    {
      name: 'order-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ orders: state.orders }),
    }
  )
)