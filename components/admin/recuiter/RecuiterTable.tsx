import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { cn, isApiSuccess } from "@/lib/utils";
import { JobPost, RecruiterInfo, User } from "@/types/interfaces";
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
import { SquareArrowOutUpRight } from "lucide-react";
import { RecruiterDialog } from "./RecuiterInfoDialog";
import useRecruiterService from "@/lib/services/recuiter.service";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
interface StatusChipProps {
  status: "Active" | "Inactive" | "Pending";
}

export function StatusChip({ status }: StatusChipProps) {
  const statusStyles = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status] ?? statusStyles["Pending"]
      )}
    >
      {status}
    </span>
  );
}
const RecruiterTable = ({
  recruiters,
  isLoading,
  onPageChange,
  currentPage,
  refetchRecruiters,
}: {
  recruiters: ApiResponse<PaginatedData<RecruiterInfo>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  refetchRecruiters: () => void;
}) => {
  if (isLoading) {
    return <LoadingSpinner text="Đang tải..." />;
  }
  const { user } = useAuth();

  if (
    !recruiters ||
    !isApiSuccess(recruiters) ||
    !recruiters.data ||
    recruiters.data.items.length === 0
  ) {
    return <div className="text-center py-4">Không có nhà tuyển dụng</div>;
  }

  const [selectedRecuiterId, setSelectedRecuiterId] = useState<number | null>(
    null
  );
  const { UPDATE_RECRUITER } = useRecruiterService();
  const { items: recruitersItems, totalPages } = recruiters.data;
  const handleReview = (recuiterId: number) => {
    setSelectedRecuiterId(recuiterId);
  };

  const handleUpdate = async (data: {
    recruiterInfoId: number;
    status: string;
  }): Promise<void> => {
    try {
      const res = await UPDATE_RECRUITER(data.recruiterInfoId, data.status);
      if (isApiSuccess(res)) {
        toast("Cập nhật thành công!");
        refetchRecruiters();
      }
    } catch (error) {
      toast("Cập nhật thất bại!");
      console.error("Failed to update recruiter:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruitersItems.map((recruiter) => (
              <TableRow key={recruiter.recruiterInfoId}>
                <TableCell>{recruiter.companyName}</TableCell>
                <TableCell>{recruiter.companyEmail}</TableCell>

                <TableCell>
                  <StatusChip
                    status={
                      recruiter.status as "Active" | "Inactive" | "Pending"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(recruiter.recruiterInfoId)}
                  >
                    <SquareArrowOutUpRight className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedRecuiterId && (
        <RecruiterDialog
          isOpen={selectedRecuiterId !== null}
          onOpenChange={() => setSelectedRecuiterId(null)}
          recruiter={recruitersItems.find(
            (rec) => rec.recruiterInfoId === selectedRecuiterId
          )}
          onSave={handleUpdate}
          user={user as User}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default RecruiterTable;
