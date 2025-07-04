"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { ROLES } from "@/lib/api-client/constants";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    code: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: 0,
    majorId: 0,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await register(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { data: majors } = useMajorCodes();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-8">
            <span className="text-blue-600 font-bold text-2xl">FPT</span>
          </div>
          <h1 className="text-4xl font-bold text-center mb-4">
            Join Our Community
          </h1>
          <p className="text-xl text-center text-blue-100">
            Be part of the growing FPT alumni network
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-8 relative">
        <div className="w-full max-w-md">
          <div className="flex justify-start absolute top-4 left-4">
            <Link href="/" className="flex flex-row items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <p className="text-sm text-gray-600">Back</p>
            </Link>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">Join the FPT Alumni Connection</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-sm font-medium text-gray-700"
              >
                Code
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@fpt.edu.vn"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role
              </Label>
              <Select
                value={formData.roleId.toString()}
                onValueChange={(value) => handleChange("roleId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLES.STUDENT.toString()}>
                    Student
                  </SelectItem>
                  <SelectItem value={ROLES.ALUMNI.toString()}>
                    Alumni
                  </SelectItem>
                  <SelectItem value={ROLES.LECTURER.toString()}>
                    Lecturer
                  </SelectItem>
                  <SelectItem value={ROLES.RECRUITER.toString()}>
                    Recruiter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="majorId"
                className="text-sm font-medium text-gray-700"
              >
                Major
              </Label>
              <Select
                value={formData.majorId.toString()}
                onValueChange={(value) => handleChange("majorId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your major" />
                </SelectTrigger>
                <SelectContent>
                  {majors?.items?.map((major: any) => (
                    <SelectItem
                      key={major.majorId}
                      value={major.majorId.toString()}
                    >
                      {major.majorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}