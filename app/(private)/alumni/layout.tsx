"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Unauthorized from "@/components/auth/unauthorized";

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "alumni")) {
      router.push("/alumni/mentoring");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner text="Please wait..." />
      </div>
    );
  } else if (user.role !== "alumni") {
    return <Unauthorized />;
  }

  return <>{children}</>;
}
