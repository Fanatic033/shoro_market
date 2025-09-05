import { IUpdateTokens } from "@/types/auth.interface";
import { IUser } from "@/types/user.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  restoreToken: string | null;
  setUser: (user: IUser) => void;
  updateTokens: (tokens: IUpdateTokens) => void;
  setRestoreToken: (token: string) => void;
  clearRestoreToken: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      restoreToken: null,
      setUser: (user) => set({ user }),
      updateTokens: (tokens) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
              }
            : null,
        })),
      setRestoreToken: (token) => set({ restoreToken: token }),
      clearRestoreToken: () => set({ restoreToken: null }),
      logout: () => {
        // Очищаем только авторизацию, корзину сохраняем
        set({ user: null, restoreToken: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
