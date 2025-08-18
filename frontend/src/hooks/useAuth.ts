import { useMutation } from "@tanstack/react-query";
import { AuthDataResponse, LoginRequest, RegisterRequest } from "../../client/AuthClient";
import { login, register } from "@/service/auth/AuthService";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";

export function useAuth() {
  const loginMutation = useMutation<AuthDataResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
    mutationFn: (payload: LoginRequest) => login(payload),
  });
  const registerMutation = useMutation<AuthDataResponse, AxiosError<ApiErrorResponse>, RegisterRequest>({
    mutationFn: (payload: RegisterRequest) => register(payload),
  });

  return {
    login: loginMutation,
    register: registerMutation,
  };
}
