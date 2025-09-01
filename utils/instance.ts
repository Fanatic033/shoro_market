import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// const API_BASE_URL: string = (Constants.expoConfig?.extra as any)?.apiBaseUrl || 'https://crmdev.shoro.kg/api';

const API_BASE_URL: string = 'http://10.10.100.70:8080/api'



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
        const token = parsed?.state?.user?.accessToken;
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
    // Attempt token refresh on 401
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return (async () => {
        const raw = await AsyncStorage.getItem('auth-storage');
        if (!raw) throw error;
        const parsed = JSON.parse(raw);
        const refreshToken = parsed?.state?.user?.refreshToken;
        if (!refreshToken) throw error;

        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data || {};

          if (!newAccessToken) throw error;

          // Update storage manually to persist tokens
          parsed.state.user = {
            ...(parsed.state.user || {}),
            accessToken: newAccessToken,
            refreshToken: newRefreshToken || refreshToken,
          };
          await AsyncStorage.setItem('auth-storage', JSON.stringify(parsed));

          // Retry original request with new access token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosApi(originalRequest);
        } catch {
          // If refresh fails, propagate error
          throw error;
        }
      })();
    }
    return Promise.reject(error);
  }
);

export default axiosApi;