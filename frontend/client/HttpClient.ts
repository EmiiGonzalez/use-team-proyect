import Cookies from "js-cookie";
import axios from "axios";

export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.endsWith("/")
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : process.env.NEXT_PUBLIC_BACKEND_URL + "/";

export const createHttpClient = (basePath: string) => {
    const client = axios.create({
        baseURL: backendUrl + basePath,
    });

    const initialToken = Cookies.get("auth-token");

    client.interceptors.request.use(
        (config) => {
            // Leer token de cookie siempre antes de cada request
            const accessToken = initialToken;
            if (!config.headers["Authorization"] && accessToken) {
                config.headers["Authorization"] = "Bearer " + accessToken;
            }
            return config;
        },
        (error) => {
            throw error;
        },
    );
    return client;
};