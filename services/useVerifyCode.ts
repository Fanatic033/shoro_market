import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface IVerifyCodeParams {
  code: number;
}

interface IVerifyCodeResponse {
  success: boolean;
  message?: string;
  // Backend may return a token that encodes userId, or userId directly
  restoreToken: string
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
}

export const useVerifyCode = () => {
  return useMutation({
    mutationFn: async (params: IVerifyCodeParams) => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("code", params.code.toString());

        const response = await axios.post<IVerifyCodeResponse>(
          `http://192.168.8.207:8080/api/auth/password/restore/code/verify?${queryParams.toString()}`
        );
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          const serverError = error.response.data;
          const errorMessage =
            serverError.message || `Ошибка ${error.response.status}`;
          throw new Error(errorMessage);
        }
        throw error;
      }
    },
  });
};
