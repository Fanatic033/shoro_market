import axios from 'axios';
import { SERVER_URL } from './constants/constant';

// Замени на свой API URL
const API_BASE_URL =  SERVER_URL // для разработки

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена в запросы
axiosApi.interceptors.request.use(
  (config) => {
    // Можно добавить токен из AsyncStorage или другого места
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
      console.log('Unauthorized - redirect to login');
    } else if (error.response?.status === 500) {
      // Серверная ошибка
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosApi;