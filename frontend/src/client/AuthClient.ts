import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + "api/v1/auth",
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

const logOut = async () => {
  return await authClient.post("/logout");
};

export default { login, logOut };
