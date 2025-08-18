import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
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
      },
      clearToken: () => {
        set({ token: null });
        Cookies.remove("auth-token");
      },
    }),
    {
      name: "auth-token",
    }
  )
);
