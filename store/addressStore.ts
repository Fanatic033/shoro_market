import axiosApi from "@/utils/instance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

export interface UserAddress {
  id?: string;
  city: string;
  district: string;
  village: string;
  street: string;
  fullAddress: string;
  isDefault?: boolean;
}

interface AddressState {
  addresses: UserAddress[];
  defaultAddress: UserAddress | null;
  addAddress: (address: Omit<UserAddress, 'id' | 'fullAddress'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => UserAddress | null;
  getFullAddress: (address: Omit<UserAddress, 'id' | 'fullAddress'>) => string;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      defaultAddress: null,
      
      addAddress: async (addressData: Omit<UserAddress, 'id' | 'fullAddress'>) => {
        const fullAddress = get().getFullAddress(addressData);
        const newAddress: UserAddress = {
          ...addressData,
          id: Date.now().toString(),
          fullAddress,
        };
      
        const user = useAuthStore.getState().user;
        if (!user?.id) {
          console.warn("Пользователь не авторизован — адрес сохранен только локально");
          set((state) => {
            const newAddresses = [...state.addresses, newAddress];
            const newDefaultAddress = state.addresses.length === 0 ? newAddress : state.defaultAddress;
            return {
              addresses: newAddresses,
              defaultAddress: newDefaultAddress,
            };
          });
          return;
        }
      
        try {
          // Отправляем PATCH запрос на сервер
          console.log(user.id)
          await axiosApi.patch(`/users/${user.id}`, {
            address: fullAddress,
          });
      
          // Обновляем локальное состояние
          set((state) => {
            const newAddresses = [...state.addresses, newAddress];
            const newDefaultAddress = state.addresses.length === 0 ? newAddress : state.defaultAddress;
            return {
              addresses: newAddresses,
              defaultAddress: newDefaultAddress,
            };
          });
      
          // Обновляем адрес в authStore (если хочешь хранить его и там)
          useAuthStore.setState({
            user: {
              ...user,
              address: fullAddress,
            },
          });
      
          console.log("✅ Адрес успешно сохранен на сервере");
        } catch (error) {
          console.error("❌ Ошибка при сохранении адреса на сервере:", error);
          Toast.error("Не удалось сохранить адрес");
        }
      },
      
      updateAddress: async (id: string, addressData: Partial<UserAddress>) => {
        const user = useAuthStore.getState().user;
        if (!user?.id) {
          console.warn("Пользователь не авторизован — обновление адреса невозможно");
          return;
        }
      
        set((state) => {
          const updatedAddresses = state.addresses.map((addr) => {
            if (addr.id === id) {
              const updated = { ...addr, ...addressData };
              if (addressData.city || addressData.district || addressData.village || addressData.street) {
                updated.fullAddress = get().getFullAddress(updated);
              }
              return updated;
            }
            return addr;
          });
      
          const targetAddress = updatedAddresses.find((addr) => addr.id === id);
          const fullAddress = targetAddress?.fullAddress || "";
      
          // Обновляем на сервере
          if (fullAddress) {
            axiosApi
              .patch(`/users/${user.id}`, {
                address: fullAddress,
              })
              .then(() => {
                console.log("✅ Адрес обновлен на сервере");
                // Обновляем адрес в authStore
                useAuthStore.setState({
                  user: {
                    ...user,
                    address: fullAddress,
                  },
                });
              })
              .catch((error) => {
                console.error("❌ Ошибка при обновлении адреса на сервере:", error);
                Toast.error("Не удалось обновить адрес");
              });
          }
      
          const updatedDefaultAddress =
            state.defaultAddress?.id === id ? targetAddress || null : state.defaultAddress;
      
          return {
            addresses: updatedAddresses,
            defaultAddress: updatedDefaultAddress,
          };
        });
      },
      
      removeAddress: (id: string) => {
        set((state: AddressState) => {
          const filteredAddresses = state.addresses.filter((addr: UserAddress) => addr.id !== id);
          const newDefaultAddress = state.defaultAddress?.id === id 
            ? (filteredAddresses.length > 0 ? filteredAddresses[0] : null)
            : state.defaultAddress;
            
          return {
            addresses: filteredAddresses,
            defaultAddress: newDefaultAddress,
          };
        });
      },
      
      setDefaultAddress: (id: string) => {
        set((state: AddressState) => {
          const address = state.addresses.find((addr: UserAddress) => addr.id === id);
          return {
            defaultAddress: address || null,
          };
        });
      },
      
      getDefaultAddress: () => {
        return get().defaultAddress;
      },
      
      getFullAddress: (address: Omit<UserAddress, 'id' | 'fullAddress'>) => {
        const parts = [address.city, address.district, address.village, address.street].filter(Boolean);
        return parts.join(", ");
      },
    }),
    {
      name: "address-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
