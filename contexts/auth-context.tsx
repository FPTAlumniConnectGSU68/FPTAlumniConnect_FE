"use client";

import { useToast } from "@/components/ui/toast";
import { useAuthMutation } from "@/hooks/use-auth-mutation";
import { AuthService } from "@/lib/services/auth.service";
import { ROLES } from "@/lib/api-client/constants";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { LoginData, RegisterData, UserInfo } from "@/types/auth";

interface AuthContextType {
  user: UserInfo | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// Update test accounts with proper student IDs and @fpt.edu.vn emails
// const testAccounts: Record<string, User & { password: string }> = {
//   "admin@fpt.edu.vn": {
//     id: "admin_1",
//     name: "Admin User",
//     email: "admin@fpt.edu.vn",
//     password: "admin123",
//     role: "admin",
//     avatar:
//       "https://cdn.dribbble.com/users/13929796/avatars/normal/6d7cf73c0502578c420474f6adc6cc0d.png?1707433135",
//   },
// }

type SignInBody = {
  email: string;
  password: string;
};

type SignInResponse = {
  message: string;
  accessToken: string;
  userInfo: UserInfo;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const { signIn, signUp } = useAuthMutation();

  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = AuthService.getUserInfo();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await signIn.mutateAsync(data);

      if (response.status === "success" && response.data?.id) {
        const { message, accessToken, userInfo } = response.data.id;

        if (message === "Login success") {
          AuthService.setToken(accessToken);
          AuthService.setUserInfo(userInfo);
          setUser(userInfo);
          toast.success("Sign in successful");
          router.push("/middlecheck");
        } else {
          toast.error("Sign in failed");
        }
      } else {
        toast.error("Sign in failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await signUp.mutateAsync(data);

      if ("StatusCode" in response && "Error" in response) {
        toast.error((response.Error as string) || "Registration failed");
        return;
      }

      toast.success("Registration successful! Please login to continue.");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.clearAuth();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
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
