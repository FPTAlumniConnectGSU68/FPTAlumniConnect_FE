"use client";

import { useToast } from "@/components/ui/toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

// Update the User interface to include studentId
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "alumni" | "student" | "teacher";
  avatar?: string;
  company?: string;
  position?: string;
  graduationYear?: string;
  major?: string;
  studentId?: string; // Add student ID field
  password?: string;
}

// Update RegisterData interface
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "alumni" | "student" | "teacher";
  graduationYear?: string;
  major?: string;
  studentId?: string; // Add student ID field
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// Update test accounts with proper student IDs and @fpt.edu.vn emails
const testAccounts: Record<string, User & { password: string }> = {
  "admin@fpt.edu.vn": {
    id: "admin_1",
    name: "Admin User",
    email: "admin@fpt.edu.vn",
    password: "admin123",
    role: "admin",
    avatar:
      "https://cdn.dribbble.com/users/13929796/avatars/normal/6d7cf73c0502578c420474f6adc6cc0d.png?1707433135",
  },
  "alumni@fpt.edu.vn": {
    id: "alumni_1",
    name: "Nguyễn Văn An",
    email: "alumni@fpt.edu.vn",
    password: "alumni123",
    role: "alumni",
    avatar: "/images/FPTHCM.jpg",
    company: "Google Vietnam",
    position: "Senior Software Engineer",
    graduationYear: "2019",
    major: "Software Engineering",
    studentId: "SE123456", // Valid student ID format
  },
  "student@fpt.edu.vn": {
    id: "student_1",
    name: "Trần Thị Mai",
    email: "student@fpt.edu.vn",
    password: "student123",
    role: "student",
    avatar: "/images/FPTHCM.jpg",
    graduationYear: "2025",
    major: "Computer Science",
    studentId: "CS234567", // Valid student ID format
  },
  "teacher@fpt.edu.vn": {
    id: "teacher_1",
    name: "Dr. Lê Văn Bình",
    email: "teacher@fpt.edu.vn",
    password: "teacher123",
    role: "teacher",
    avatar: "/images/FPTHCM.jpg",
    company: "FPT University",
    position: "Associate Professor",
    major: "Computer Science",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();
  useEffect(() => {
    // Check for existing auth token
    const token = Cookies.get("auth-token");
    if (token) {
      // In a real app, validate token with backend
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      // Mock API call
      const foundUser = Object.values(testAccounts).find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (!foundUser) {
        toast.error("Invalid credentials");
        return;
      }

      // Set auth token
      Cookies.set("auth-token", "mock-token");

      // Save user data
      const { password, ...userData } = foundUser as User;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect to middleware page for role-based routing
      router.push("/middlecheck");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Mock registration
      const newUser = {
        id: `${data.role}_${Date.now()}`,
        ...data,
      };

      // Set auth token
      Cookies.set("auth-token", "mock-token");

      // Save user data
      const { password, ...userData } = newUser;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect to middleware page for role-based routing
      router.push("/middlecheck");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("auth-token");
    localStorage.removeItem("user");
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
