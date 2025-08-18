import axios from "axios";
import { appStore } from "../store/auth/store";

export const createRefreshTokenHttpClient = (basePath: string) => {
    const client = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_URL + basePath,
    });

    client.interceptors.request.use(
        (config) => {
            // Leer token de cookie siempre antes de cada request
            const accessToken = appStore.getState().authData?.accessToken;
            if (!config.headers["Authorization"] && accessToken) {
                config.headers["Authorization"] = "Bearer " + accessToken;
            }
            return config;
        },
        (error) => error,
    );
    return client;
};