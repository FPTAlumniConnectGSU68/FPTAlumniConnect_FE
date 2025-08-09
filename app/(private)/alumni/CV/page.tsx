"use client";

import CVView from "@/components/user-alumni/CVView";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AlumniCVPage() {
  return (
    <ProtectedRoute allowedRoles={["alumni"]}>
      <div className="space-y-6">
        <CVView />
      </div>
    </ProtectedRoute>
  );
}
