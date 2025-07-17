"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "alumni" | "student" | "recruiter" | "lecturer";
  allowedRoles?: Array<
    "admin" | "alumni" | "student" | "recruiter" | "lecturer"
  >;
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if not authenticated
      if (!user) {
        console.log("Not authenticated");
        router.push("/");
        return;
      }

      // Check specific role requirement
      if (requiredRole && user.roleName.toLowerCase() !== requiredRole) {
        console.log("Not authenticated and not required role");
        router.push("/");
        return;
      }

      // Check allowed roles
      if (
        allowedRoles &&
        !allowedRoles.includes(
          user.roleName.toLowerCase() as
            | "admin"
            | "alumni"
            | "student"
            | "recruiter"
            | "lecturer"
        )
      ) {
        console.log("Not authenticated and not allowed roles");
        router.push("/");
        return;
      }
    }
  }, [user, isLoading, router, requiredRole, allowedRoles]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!user) {
    return null;
  }

  if (
    requiredRole &&
    user.roleName.toLowerCase() !== requiredRole.toLowerCase()
  ) {
    return null;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.roleName.toLowerCase() as
        | "admin"
        | "alumni"
        | "student"
        | "recruiter"
        | "lecturer"
    )
  ) {
    return null;
  }

  return <>{children}</>;
}
