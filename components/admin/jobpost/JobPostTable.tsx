import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { isApiSuccess } from "@/lib/utils";
import { JobPost } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToDMY, formatTime } from "@/lib/utils";
import React from "react";

const JobPostTable = ({
  jobPosts,
  isLoading,
  onPageChange,
  currentPage,
}: {
  jobPosts: ApiResponse<PaginatedData<JobPost>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
}) => {
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !jobPosts ||
    !isApiSuccess(jobPosts) ||
    !jobPosts.data ||
    jobPosts.data.items.length === 0
  ) {
    return <div className="text-center py-4">No job posts found</div>;
  }

  const { items: jobPostItems, totalPages } = jobPosts.data;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostItems.map((jobPost) => (
              <TableRow key={jobPost.jobPostId}>
                <TableCell>{jobPost.jobTitle}</TableCell>
                <TableCell>{jobPost.location}</TableCell>
                <TableCell>
                  {formatDateToDMY(jobPost.time) +
                    " " +
                    formatTime(jobPost.time)}
                </TableCell>
                <TableCell>{jobPost.status}</TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default JobPostTable;
