"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ROLES } from "@/lib/api-client/constants";

export default function MiddleCheckPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Role-based routing
    switch (user.roleId) {
      case ROLES.ADMIN:
        router.push("/admin/dashboard");
        break;
      case ROLES.ALUMNI:
        router.push("/alumni/mentoring");
        break;
      case ROLES.STUDENT:
        router.push("/student");
        break;
      case ROLES.LECTURER:
        router.push("/lecturer");
        break;
      case ROLES.RECRUITER:
        router.push("/recruiter");
        break;
      default:
        router.push("/");
    }
  }, [user, router]);

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center min-h-screen w-full">
      <LoadingSpinner text="Loading..." />
    </div>
  );
}
