import JobPostHeader from "@/components/admin/jobpost/JobPostHeader";
import JobPostTable from "@/components/admin/jobpost/JobPostTable";
import { useJobs } from "@/hooks/use-jobs";
import { useState } from "react";

export function JobPostsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: jobPosts, isLoading } = useJobs({
    page: currentPage,
    size: 5,
  });
  return (
    <div className="space-y-4">
      <JobPostHeader />
      <JobPostTable
        jobPosts={jobPosts}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}
