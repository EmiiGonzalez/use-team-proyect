import Cookies from "js-cookie";

export const getAccessTokenFromCookie = () => {
  return Cookies.get("accessToken") || null;
};
