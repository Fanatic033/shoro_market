import { useAuthStore } from '@/store';
import { IAuthFormData } from '@/types/auth.interface';
import { IUser } from '@/types/user.interface';
import axiosApi from '@/utils/instance';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: IAuthFormData) => {
      const response = await axiosApi.post<IUser>('/auth/login', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (user) => {
      setUser(user);
    },
  });
};
