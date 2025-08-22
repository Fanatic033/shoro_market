import { IUpdateTokens } from '@/types/auth.interface';
import { IUser } from '@/types/user.interface';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  updateTokens: (tokens: IUpdateTokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateTokens: (tokens) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, jwtToken: tokens.accessToken, refreshToken: tokens.refreshToken }
            : null,
        })),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', 
      storage: createJSONStorage(() =>  AsyncStorage)
    }
  )
);
