"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function MiddleCheckPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  console.log(user);
  useEffect(() => {
    if (!isLoading && user) {
      // Determine the route based on user role
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard"); // Admin dashboard with user management
          break;
        case "alumni":
          router.push("/alumni/mentoring"); // Alumni dashboard with mentoring focus
          break;
        case "student":
          router.push("/student/courses"); // Student dashboard with courses
          break;
        default:
          router.push("/dashboard"); // Fallback to general dashboard
      }
    } else if (!isLoading && !user) {
      // If no user is found, redirect to login
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading spinner while determining route
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner text="Loading..." />
    </div>
  );
}
