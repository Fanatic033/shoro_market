import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  userId?: number; // ⚡️ именно так в твоём токене
  id?: number;   
  iat: number;
  exp: number;
  sub: string;
}

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    const extractedUserId = decoded.userId ?? decoded.id ?? null;
    return extractedUserId;
  } catch (e) {
    console.error("Ошибка декодирования токена", e);
    return null;
  }
}
