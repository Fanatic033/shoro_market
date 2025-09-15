import { IAuthResponse, IRegisterData } from '@/types/auth.interface';
import axiosApi from '@/utils/instance';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: IRegisterData) => {
      try {
        const response = await axiosApi.post<IAuthResponse>('/auth/register', data, {
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
