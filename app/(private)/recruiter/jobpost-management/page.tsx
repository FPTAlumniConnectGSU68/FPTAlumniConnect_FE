"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { JobPostsManagement } from "@/components/shared/jobposts/JobPostsManagement";
import { useAuth } from "@/contexts/auth-context";
import { useJobs } from "@/hooks/use-jobs";
import React, { useState, useMemo } from "react";

const JobPostManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  // Memoize the query object to prevent unnecessary re-renders
  const jobQuery = useMemo(
    () => ({
      UserId: user?.userId?.toString() || "",
    }),
    [user?.userId]
  );

  const { data: jobPosts, isLoading } = useJobs({
    page: currentPage,
    size: 5,
    query: jobQuery,
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
