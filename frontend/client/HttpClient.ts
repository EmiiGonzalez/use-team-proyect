import Cookies from "js-cookie";
import axios from "axios";

export const createHttpClient = (basePath: string) => {
    const client = axios.create({
        baseURL: process.env.BACKEND_URL + basePath,
    });

    const initialToken = Cookies.get("accessToken");

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