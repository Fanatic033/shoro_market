import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { router } from 'expo-router';

const API_BASE_URL: string = (Constants.expoConfig?.extra as any)?.apiBaseUrl || 'https://crmdev.shoro.kg/api';

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosApi.interceptors.request.use(
  async (config) => {
    try {
      const raw = await AsyncStorage.getItem('auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.user?.jwtToken;
        if (token) {
          const headers: any = config.headers || {};
          // Axios v1 may use AxiosHeaders; setting via object works when casting
          headers.Authorization = `Bearer ${token}`;
          config.headers = headers;
        }
      }
    } catch(e) {
      // ignore
      console.error(e)
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Глобальная обработка ошибок
    if (error.response?.status === 401) {
      // Пользователь не авторизован
      try {
        // Сбрасываем состояние авторизации и уводим на логин
        useAuthStore.getState().logout();
      } catch (e) { 
        console.error(e)
       }
      try {
        router.replace('/login');
      } catch (e) { 
        console.error(e)
       }
      
    } else if (error.response?.status === 500) {
      // Серверная ошибка
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosApi;