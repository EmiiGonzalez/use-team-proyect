import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logOut, signup } from "./AuthService";
import { appStore, useAppStore } from "../../store/auth/store";
import type { LoginRequest } from "../../client/AuthClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated());

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      console.log(data)
      appStore.getState().handleLogin(data.data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: () => {
      appStore.getState().handleLogout();
      queryClient.clear();
    },
  });

  const signupMutation = useMutation({
    mutationFn: (payload: LoginRequest) => signup(payload),
  });

  return {
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    loginData: loginMutation.data,
    loginIsLoading: loginMutation.isPending,

    logout: logoutMutation.mutateAsync,
    logoutIsLoading: logoutMutation.isPending,
    logoutError: logoutMutation.error,
    logoutData: logoutMutation.data,

    signup: signupMutation.mutateAsync,
    signupIsLoading: signupMutation.isPending,
    signupError: signupMutation.error,
    signupData: signupMutation.data,

    isAuthenticated,
  };
}
