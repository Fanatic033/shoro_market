import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  userId: number;
  iat: number;
  exp: number;
  sub: string
}

export function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded.userId || null;
  } catch (e) {
    console.error("Ошибка декодирования токена", e);
    return null;
  }
}
