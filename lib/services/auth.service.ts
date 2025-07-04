import Cookies from "js-cookie";
import type { UserInfo } from "@/types/auth";

const AUTH_TOKEN_KEY = "auth-token";
const USER_INFO_KEY = "user_info";

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  expires: 7, // 7 days
  path: "/",
};

export const AuthService = {
  setToken(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, COOKIE_OPTIONS);
  },

  getToken() {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  setUserInfo(userInfo: UserInfo) {
    Cookies.set(USER_INFO_KEY, JSON.stringify(userInfo), COOKIE_OPTIONS);
  },

  getUserInfo(): UserInfo | null {
    const userInfo = Cookies.get(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  },

  clearAuth() {
    Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
    Cookies.remove(USER_INFO_KEY, { path: "/" });
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};