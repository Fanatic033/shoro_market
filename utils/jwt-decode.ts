// utils/jwt-decode.ts

import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  sub: string;  // теперь это строка с ID, например "14"
  iat: number;
  exp: number;
  // userId больше не существует — удаляем из интерфейса
}

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);

    // Парсим sub как число
    const userId = parseInt(decoded.sub, 10);

    // Проверяем, что получилось число, а не NaN
    return isNaN(userId) ? null : userId;
  } catch (e) {
    console.error("Ошибка декодирования токена", e);
    return null;
  }
}