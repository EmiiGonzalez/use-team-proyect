import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  id: string | null;
  clearId: () => void;
  clearToken: () => void;
}

const initialToken = Cookies.get("auth-token");

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: initialToken ?? null,
      setToken: (token) => {
        set({ token });
        Cookies.set("auth-token", token, { expires: 7, sameSite: "lax" });
        const tokenDecoded = jwtDecode<{ sub: string }>(token).sub;
        set({ id: tokenDecoded });
      },
      clearToken: () => {
        set({ token: null });
        Cookies.remove("auth-token");
      },
      clearId: () => {
        set({ id: null });
      },
      id: null,
    }),
    {
      name: "auth-token",
    }
  )
);
