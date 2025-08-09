"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import CVView from "@/components/user-alumni/CVView";

export default function StudentCVPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="space-y-6">
        <CVView />
      </div>
    </ProtectedRoute>
  );
}
