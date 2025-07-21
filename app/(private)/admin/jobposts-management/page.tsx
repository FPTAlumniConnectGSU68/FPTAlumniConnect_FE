"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { JobPostsManagement } from "@/components/shared/jobposts/JobPostsManagement";

export default function AdminJobPostsManagementPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6">
        <JobPostsManagement />
      </div>
    </ProtectedRoute>
  );
}
