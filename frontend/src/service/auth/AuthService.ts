import AuthClient, {
  type LoginRequest,
} from "../../client/AuthClient";
import { createRefreshTokenHttpClient } from "../../client/HttpClient";

export const login = async (payload: LoginRequest) => {
  const loginRes = await AuthClient.login(payload);
  return loginRes;
};

export const logOut = async () => {
  const res = await AuthClient.logOut();
  return res;
};

type ErrorResponse = {
  errorCode: string;
};

export const signup = async (payload: LoginRequest) => {
  const client = createRefreshTokenHttpClient("/auth");

  const response = await client.post<string | ErrorResponse>(
    "/signup",
    payload,
    {
      headers: {
        "Custom-Header-Domain": import.meta.env.VITE_FRONTEND_URL,
      },
    }
  );

  return response;
};
