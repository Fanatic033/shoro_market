// services/useProfile.ts
import { useAuthStore } from "@/store/authStore";
import { IUser } from "@/types/user.interface";
import axiosApi from "@/utils/instance";
import { getUserIdFromToken } from "@/utils/jwt-decode";
import { useEffect, useState } from "react";

export function useProfile() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.accessToken) return;
      const userId = getUserIdFromToken(user.accessToken);
      if (!userId) return;

      setLoading(true);
      try {
        const res = await axiosApi.get<IUser>(`/users/${userId}`);
        setUser({
          ...res.data,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
      } catch (e) {
        console.error("Ошибка загрузки профиля", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.accessToken]);

  return { user, loading };
}
