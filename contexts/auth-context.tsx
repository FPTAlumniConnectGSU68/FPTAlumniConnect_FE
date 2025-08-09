"use client";

import { useAuthMutation } from "@/hooks/use-auth-mutation";
import { useRouteHistory } from "@/hooks/use-route-history";
import { ApiError } from "@/lib/apiResponse";
import { AuthService } from "@/lib/services/auth.service";
import type { LoginData, RegisterData, UserInfo } from "@/types/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

type ValidationError = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: Record<string, string[]>;
};

type ApiRegistrationError = {
  status: "error";
  message: string;
  errors?: ValidationError;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { signIn, signUp } = useAuthMutation();
  const { navigateBack, getLastRoute } = useRouteHistory();
  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = AuthService.getUserInfo();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const formatValidationErrors = (error: ApiRegistrationError): string => {
    if (!error.errors?.errors) return error.message;

    return Object.entries(error.errors.errors)
      .map(([field, messages]) => {
        // Make field name more user-friendly
        const friendlyField = field.charAt(0).toUpperCase() + field.slice(1);
        return `${friendlyField}: ${messages[0]}`; // Show only first error per field
      })
      .join("\n");
  };

  const handleAuthSuccess = (
    accessToken: string,
    userInfo: UserInfo,
    action: "login" | "register"
  ) => {
    AuthService.setToken(accessToken);
    AuthService.setUserInfo(userInfo);
    setUser(userInfo);
    const lastRoute = getLastRoute();
    if (lastRoute && lastRoute !== "/login") {
      navigateBack();
    } else {
      router.push("/middlecheck");
    }
    toast.success(
      `${action === "login" ? "Sign in" : "Registration"} successful`
    );
    return { success: true };
  };

  const handleAuthError = (
    error: ApiRegistrationError | ApiError
  ): { success: boolean; error: string } => {
    const errorMessage = formatValidationErrors(error as ApiRegistrationError);
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  };

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await signIn.mutateAsync(data);

      if (response.status === "success" && response.data) {
        const { accessToken, userInfo } = response.data;
        return handleAuthSuccess(accessToken, userInfo, "login");
      } else {
        return handleAuthError(response as ApiError);
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during sign in";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await signUp.mutateAsync(data);

      if (response.status === "success" && response.data) {
        const { accessToken, userInfo } = response.data;
        return handleAuthSuccess(accessToken, userInfo, "register");
      } else {
        return handleAuthError(response as ApiRegistrationError);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    try {
      AuthService.clearAuth();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out properly");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
