import { IAuthFormData, IAuthResponse } from '@/types/auth.interface';
import axiosApi from '@/utils/instance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: IAuthFormData) => {
      try {
        const response = await axiosApi.post<IAuthResponse>('/auth/login', data, {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          // Создаем ошибку с правильным сообщением из ответа сервера
          const serverError = error.response.data;
          const errorMessage = serverError.message || `Ошибка ${error.response.status}`;
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
};
