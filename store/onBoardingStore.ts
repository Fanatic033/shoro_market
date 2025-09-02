// store/onBoardingStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnBoardingState {
  hasSeenOnBoarding: boolean;
  setHasSeenOnBoarding: (value: boolean) => void;
  resetOnBoarding: () => void;
}

export const useOnBoardingStore = create<OnBoardingState>()(
  persist(
    (set) => ({
      hasSeenOnBoarding: false,
      setHasSeenOnBoarding: (value: boolean) => set({ hasSeenOnBoarding: value }),
      resetOnBoarding: () => set({ hasSeenOnBoarding: false }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);