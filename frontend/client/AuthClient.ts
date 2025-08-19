import axios from "axios";
import { backendUrl } from "./HttpClient";

const authClient = axios.create({
  baseURL: backendUrl + "api/v1/auth",
  withCredentials: true,
});

authClient.interceptors.request.use(
  (config) => config,
  (error) => error
);
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    throw error;
  }
);

export type LoginRequest = { email: string; password: string };
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type AuthDataResponse = {
  accessToken: string;
};

export type SignupRequest = {
  email: string;
  password: string;
};

const login = async (payload: LoginRequest) => {
  return await authClient.post<AuthDataResponse>("/login", payload);
};

const register = async (payload: RegisterRequest) => {
  return await authClient.post<AuthDataResponse>("/register", payload);
};

const authApi = { login, register };
export default authApi;
