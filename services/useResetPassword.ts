import axiosApi from "@/utils/instance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

interface IResetPasswordParams {
  password: string;
  restoreToken: string;
}

interface IResetPasswordResponse {
  success: boolean;
  message?: string;
}

// структура payload твоего restoreToken
interface IRestoreTokenPayload {
  sub: string;     // email / username
  userId: number;  // нужен нам
  iat: number;
  exp: number;
  typ: string;     // "resetToken"
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (params: IResetPasswordParams) => {
      try {
        const { password, restoreToken } = params;
        console.log("🔄 Reset password request with restoreToken");

        if (!restoreToken) {
          throw new Error("Токен восстановления не найден");
        }

        // декодируем токен и достаём userId
        const decoded = jwtDecode<IRestoreTokenPayload>(restoreToken);
        const userId = decoded.userId;
        if (!userId) {
          throw new Error("Не удалось извлечь userId из токена");
        }

        console.log("📤 Sending PATCH request to:", `/users/password/change/${userId}`);
        const response = await axiosApi.patch<IResetPasswordResponse>(
          `/users/password/change/${userId}`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${restoreToken}`,
            },
          }
        );

        console.log("✅ Reset password response:", response.data);
        return response.data;
      } catch (error) {
        console.error("❌ Reset password error:", error);
        if (error instanceof AxiosError && error.response?.data) {
          const serverError = error.response.data;
          const errorMessage =
            serverError.message || `Ошибка ${error.response.status}`;
          console.error("🚨 Server error details:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: serverError,
            headers: error.response.headers,
          });
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
};
