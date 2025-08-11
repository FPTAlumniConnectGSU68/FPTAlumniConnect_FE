import { JobPostApplicantsDialog } from "@/components/admin/jobpost/JobPostApplicantsDialog";
import JobPostHeader from "@/components/admin/jobpost/JobPostHeader";
import JobPostTable from "@/components/admin/jobpost/JobPostTable";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { JobPost } from "@/types/interfaces";
import { useState } from "react";

export function JobPostsManagement({
  jobPosts,
  isLoading,
  onPageChange,
  currentPage,
}: {
  jobPosts: ApiResponse<PaginatedData<JobPost>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
}) {
  const [selectedJobPostId, setSelectedJobPostId] = useState<number | null>(
    null
  );

  return (
    <div className="space-y-4">
      <JobPostHeader />
      <JobPostTable
        jobPosts={jobPosts}
        isLoading={isLoading}
        onPageChange={onPageChange}
        currentPage={currentPage}
        onViewApplicants={setSelectedJobPostId}
      />
      <JobPostApplicantsDialog
        jobPostId={selectedJobPostId}
        open={!!selectedJobPostId}
        onOpenChange={() => setSelectedJobPostId(null)}
      />
    </div>
  );
}
