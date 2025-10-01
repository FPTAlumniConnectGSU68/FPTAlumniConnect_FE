import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import useRecruiterService, {
  UpdateRecruiterInfoData,
} from "@/lib/services/recuiter.service";
import { cn, isApiSuccess } from "@/lib/utils";
import { RecruiterInfo, User } from "@/types/interfaces";
import { SquareArrowOutUpRight } from "lucide-react";
import { toast } from "sonner";
import { RecruiterDialog } from "./RecuiterInfoDialog";

// Types
type RecruiterStatus = "Active" | "Inactive" | "Pending" | "Suspended";

interface StatusChipProps {
  status: RecruiterStatus;
}

interface RecruiterTableProps {
  recruiters: ApiResponse<PaginatedData<RecruiterInfo>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  refetchRecruiters: () => void;
}

interface UpdateData {
  status?: string;
  recruiterInfoId?: number;
  userId?: number;
  companyName?: string;
  companyEmail?: string;
  [key: string]: any;
}

// Constants
const STATUS_STYLES: Record<RecruiterStatus, string> = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Inactive: "bg-red-100 text-red-800 border-red-200",
  Suspended: "bg-red-100 text-red-800 border-red-200",
  Pending: "bg-gray-100 text-gray-800 border-gray-200",
};

// Components
export function StatusChip({ status }: StatusChipProps) {
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.Pending;

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyle
      )}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Không có nhà tuyển dụng nào</p>
    </div>
  );
}

function RecruiterTableRow({
  recruiter,
  onReview,
}: {
  recruiter: RecruiterInfo;
  onReview: (id: number) => void;
}) {
  return (
    <TableRow key={recruiter.recruiterInfoId}>
      <TableCell className="font-medium">
        {recruiter.companyName || "N/A"}
      </TableCell>
      <TableCell>{recruiter.companyEmail || "N/A"}</TableCell>
      <TableCell>
        <StatusChip status={recruiter.status as RecruiterStatus} />
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReview(recruiter.recruiterInfoId)}
          className="h-8 w-8 p-0"
        >
          <SquareArrowOutUpRight className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

const RecruiterTable = ({
  recruiters,
  isLoading,
  onPageChange,
  currentPage,
  refetchRecruiters,
}: RecruiterTableProps) => {
  const { user } = useAuth();
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<number | null>(
    null
  );

  const { UPDATE_RECRUITER_STATUS, UPDATE_RECRUITER, UPDATE_RECRUITER_INFO } =
    useRecruiterService();

  // Memoized values
  const { recruitersItems, totalPages, hasRecruiters } = useMemo(() => {
    if (!recruiters || !isApiSuccess(recruiters) || !recruiters.data) {
      return { recruitersItems: [], totalPages: 0, hasRecruiters: false };
    }

    return {
      recruitersItems: recruiters.data.items,
      totalPages: recruiters.data.totalPages,
      hasRecruiters: recruiters.data.items.length > 0,
    };
  }, [recruiters]);

  const selectedRecruiter = useMemo(
    () =>
      recruitersItems.find(
        (rec) => rec.recruiterInfoId === selectedRecruiterId
      ),
    [recruitersItems, selectedRecruiterId]
  );

  // Handlers
  const handleReview = useCallback((recruiterId: number) => {
    setSelectedRecruiterId(recruiterId);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedRecruiterId(null);
  }, []);

  const determineUpdateType = useCallback((data: UpdateData) => {
    // Status-only update (admin updating status)
    if (data.status && Object.keys(data).length === 2 && data.recruiterInfoId) {
      return "status";
    }
    // Recruiter info update (non-admin updating their info)
    if (data.userId && data.companyName && data.companyEmail) {
      return "info";
    }
    // Fallback to regular recruiter update
    return "general";
  }, []);

  const handleUpdate = useCallback(
    async (data: UpdateData): Promise<void> => {
      try {
        const updateType = determineUpdateType(data);
        let response;

        switch (updateType) {
          case "status":
            response = await UPDATE_RECRUITER_STATUS(
              data.recruiterInfoId!,
              data.status!
            );
            break;
          case "info":
            response = await UPDATE_RECRUITER_INFO(
              data as UpdateRecruiterInfoData
            );
            break;
          case "general":
          default:
            const { recruiterInfoId, ...updateData } = data;
            response = await UPDATE_RECRUITER(recruiterInfoId!, updateData);
            break;
        }

        if (isApiSuccess(response)) {
          toast.success("Cập nhật thành công!");
          refetchRecruiters();
          handleCloseDialog();
        } else {
          toast.error(response.message || "Cập nhật thất bại!");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật!");
        console.error("Failed to update recruiter:", error);
      }
    },
    [
      determineUpdateType,
      UPDATE_RECRUITER_STATUS,
      UPDATE_RECRUITER_INFO,
      UPDATE_RECRUITER,
      refetchRecruiters,
      handleCloseDialog,
    ]
  );

  // Loading state
  if (isLoading) {
    return <LoadingSpinner text="Đang tải danh sách nhà tuyển dụng..." />;
  }

  // Empty state
  if (!hasRecruiters) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên công ty</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recruitersItems.map((recruiter) => (
              <RecruiterTableRow
                key={recruiter.recruiterInfoId}
                recruiter={recruiter}
                onReview={handleReview}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Recruiter Dialog */}
      {selectedRecruiterId && (
        <RecruiterDialog
          isOpen={true}
          onOpenChange={handleCloseDialog}
          recruiter={selectedRecruiter}
          onSave={handleUpdate}
          user={user as User}
        />
      )}
    </div>
  );
};

export default RecruiterTable;
