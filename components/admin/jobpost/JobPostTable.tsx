import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { cn, isApiSuccess } from "@/lib/utils";
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
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { JobPostEditDialog } from "./JobPostEditDialog";
import { Eye, Edit } from "lucide-react";
interface StatusChipProps {
  status: "Open" | "Closed" | "Deleted";
}

export function StatusChip({ status }: StatusChipProps) {
  const statusStyles = {
    Open: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-red-100 text-red-800 border-red-200",
    Deleted: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
const JobPostTable = ({
  jobPosts,
  isLoading,
  onPageChange,
  currentPage,
  onViewApplicants,
}: {
  jobPosts: ApiResponse<PaginatedData<JobPost>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  onViewApplicants: (jobPostId: number) => void;
}) => {
  const [selectedJobPost, setSelectedJobPost] = useState<JobPost | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewJobPost = (jobPost: JobPost) => {
    setSelectedJobPost(jobPost);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  const handleEditJobPost = (jobPost: JobPost) => {
    setSelectedJobPost(jobPost);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedJobPost(null);
  };
  if (isLoading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (
    !jobPosts ||
    !isApiSuccess(jobPosts) ||
    !jobPosts.data ||
    jobPosts.data.items.length === 0
  ) {
    return <div className="text-center py-4">Không có tin tuyển dụng</div>;
  }

  const { items: jobPostItems, totalPages } = jobPosts.data;

  const jobPostStatus = (status: string) => {
    if (status === "Open") {
      return (
        <Badge variant="outline" className="bg-green-500 text-white">
          Open
        </Badge>
      );
    } else if (status === "Closed") {
      return (
        <Badge variant="outline" className="bg-red-500 text-white">
          Closed
        </Badge>
      );
    } else if (status === "Deleted") {
      return (
        <Badge variant="outline" className="bg-gray-500 text-white">
          Deleted
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
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
                <TableCell>
                  <StatusChip
                    status={jobPost.status as "Open" | "Closed" | "Deleted"}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewJobPost(jobPost)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditJobPost(jobPost)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewApplicants(jobPost.jobPostId)}
                    >
                      Ứng viên
                    </Button>
                  </div>
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

      <JobPostEditDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        jobPost={selectedJobPost}
        mode={dialogMode}
      />
    </div>
  );
};

export default JobPostTable;
