import AuthClient, {
  LoginRequest,
  RegisterRequest,
} from "../../../client/AuthClient";

export const login = async (payload: LoginRequest) => {
  const loginRes = await AuthClient.login(payload);
  return loginRes.data;
};

export const register = async (payload: RegisterRequest) => {
  const res = await AuthClient.register(payload);
  return res.data;
};
