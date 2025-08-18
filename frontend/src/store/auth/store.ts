import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { AuthDataResponse } from "../../client/AuthClient";
import Cookies from "js-cookie";

export type State = {
    authData: AuthDataResponse | null;
    handleLogin: (authData: AuthDataResponse) => void;
    handleLogout: () => void;
    isAuthenticated: () => boolean;
};

// Leer token de cookie al iniciar
const initialToken = Cookies.get("accessToken");
const initialAuthData = initialToken ? { accessToken: initialToken } : null;

export const appStore = createStore<State>((set) => ({
    authData: initialAuthData,

    handleLogin: (authData) => {
        Cookies.set("accessToken", authData.accessToken, { path: "/" });
        set({ authData });
    },
    handleLogout: () => {
        Cookies.remove("accessToken");
        set({ authData: null });
    },
    isAuthenticated: () => {
        return !!Cookies.get("accessToken");
    },
}));


export function useAppStore<T>(selector: (state: State) => T) {
    return useStore(appStore, selector);
}
