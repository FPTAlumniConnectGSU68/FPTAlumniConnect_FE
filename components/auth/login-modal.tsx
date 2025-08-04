"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      onClose();
      setEmail("");
      setPassword("");
    } else {
      setError("Invalid email or password");
    }
  };

  const testAccounts = [
    {
      email: "admin@fpt.edu.vn",
      password: "admin123",
      role: "Admin",
      color: "bg-red-100 text-red-800",
      studentId: null,
    },
    {
      email: "alumni@fpt.edu.vn",
      password: "alumni123",
      role: "Alumni",
      color: "bg-blue-100 text-blue-800",
      studentId: "SE123456",
    },
    {
      email: "student@fpt.edu.vn",
      password: "student123",
      role: "Student",
      color: "bg-green-100 text-green-800",
      studentId: "CS234567",
    },
    {
      email: "teacher@fpt.edu.vn",
      password: "teacher123",
      role: "Teacher",
      color: "bg-purple-100 text-purple-800",
      studentId: null,
    },
  ];

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Sign in to your FPT Alumni Connection account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Test Accounts */}
          {/*
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900">Test Accounts</CardTitle>
              <CardDescription className="text-xs text-blue-700">
                Click on any account to auto-fill login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {testAccounts.map((account) => (
                <div
                  key={account.email}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => handleTestLogin(account.email, account.password)}
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={account.color}>{account.role}</Badge>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{account.email}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Password: {account.password}</span>
                        {account.studentId && (
                          <>
                            <span>•</span>
                            <span>ID: {account.studentId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@fpt.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
