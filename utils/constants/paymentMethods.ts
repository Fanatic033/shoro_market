// constants/paymentMethods.ts

export interface PaymentMethod {
    id: string;      // "cash", "card", "elsom" — для UI и состояния
    title: string;   // "Наличные", "Карта" — для отображения
    icon: string;    // "cash", "card", "wallet" — для Ionicons
    color: string;   // "#10b981", "#3b82f6" — для стилей
    value: number;   // 0, 1, 2 — для отправки на сервер
  }
  
  export const PAYMENT_METHODS: PaymentMethod[] = [
    {
      id: "наличные",
      title: "Наличные",
      icon: "cash",
      color: "#10b981",
      value: 0,
    },
    {
      id: "перечисление",
      title: "Перечисление",
      icon: "card",
      color: "#3b82f6",
      value: 1,
    },
    {
      id: "консигнация",
      title: "Консигнация",
      icon: "wallet",
      color: "#f59e0b",
      value: 2,
    },
  ];
  
  // Создаём маппинг для быстрого доступа: { "наличные": 0, "перечисление": 1, ... }
  export const PAYMENT_METHOD_MAP: Record<string, number> = PAYMENT_METHODS.reduce(
    (acc, method) => {
      acc[method.id] = method.value;
      return acc;
    },
    {} as Record<string, number>
  );
  
  // Создаём обратный маппинг: { 0: "наличные", 1: "перечисление", ... }
  export const PAYMENT_VALUE_MAP: Record<number, string> = PAYMENT_METHODS.reduce(
    (acc, method) => {
      acc[method.value] = method.id;
      return acc;
    },
    {} as Record<number, string>
  );