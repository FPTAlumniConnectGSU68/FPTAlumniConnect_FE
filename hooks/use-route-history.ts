"use client";

import { useRouter } from "next/navigation";

const ROUTE_HISTORY_KEY = "route_history";

export function useRouteHistory() {
  const router = useRouter();

  const saveCurrentRoute = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        ROUTE_HISTORY_KEY,
        window.location.pathname + window.location.search
      );
    }
  };

  const getLastRoute = (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(ROUTE_HISTORY_KEY) || "/";
    }
    return "/";
  };

  const clearRouteHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ROUTE_HISTORY_KEY);
    }
  };

  const navigateToLogin = () => {
    saveCurrentRoute();
    router.push("/login");
  };

  const navigateBack = () => {
    const lastRoute = getLastRoute();
    clearRouteHistory();
    router.push(lastRoute);
  };

  return {
    navigateToLogin,
    navigateBack,
    getLastRoute,
  };
}
