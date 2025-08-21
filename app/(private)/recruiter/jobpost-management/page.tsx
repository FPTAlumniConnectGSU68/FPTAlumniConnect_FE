"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { JobPostsManagement } from "@/components/shared/jobposts/JobPostsManagement";
import { useAuth } from "@/contexts/auth-context";
import { useJobs } from "@/hooks/use-jobs";
import React, { useState } from "react";

const JobPostManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const { data: jobPosts, isLoading } = useJobs({
    page: currentPage,
    size: 5,
    query: {
      UserId: user?.userId?.toString() || "",
    },
  });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <div className="space-y-6">
        <JobPostsManagement
          jobPosts={jobPosts}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </ProtectedRoute>
  );
};

export default JobPostManagement;
