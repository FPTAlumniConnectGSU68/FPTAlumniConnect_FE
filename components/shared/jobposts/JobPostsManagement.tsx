import { useCallback, useEffect, useState, useMemo } from "react";
import { JobPostApplicantsDialog } from "@/components/admin/jobpost/JobPostApplicantsDialog";
import JobPostHeader from "@/components/admin/jobpost/JobPostHeader";
import JobPostTable from "@/components/admin/jobpost/JobPostTable";
import { RecruiterDialog } from "@/components/admin/recuiter/RecuiterInfoDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import useRecruiterService, {
  CreateRecruiterData,
  UpdateRecruiterInfoData,
} from "@/lib/services/recuiter.service";
import { isApiSuccess } from "@/lib/utils";
import { JobPost, RecruiterInfo, User } from "@/types/interfaces";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

// Types
interface JobPostsManagementProps {
  jobPosts: ApiResponse<PaginatedData<JobPost>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
}

interface UpdateData {
  status?: string;
  recruiterInfoId?: number;
  userId?: number;
  companyName?: string;
  companyEmail?: string;
  [key: string]: any;
}

type RecruiterStatus = "Active" | "Inactive" | "Pending" | "Suspended";

// Constants
const STATUS_TRANSLATIONS: Record<string, string> = {
  Active: "Hoạt động",
  Inactive: "Không hoạt động",
  Suspended: "Bị đình chỉ",
  Pending: "Chờ duyệt",
};

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-green-500 text-white",
  Inactive: "bg-red-500 text-white",
  Suspended: "bg-red-500 text-white",
  Pending: "bg-yellow-500 text-white",
};

// Components
function NoRecruiterState({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="flex items-center justify-center h-56">
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 shadow-sm text-center max-w-md">
        <p className="text-gray-600">
          Bạn chưa thuộc nhà tuyển dụng nào. <br />
          Đăng ký nhà tuyển dụng ngay!
        </p>
        <Button onClick={onRegister} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Đăng ký nhà tuyển dụng
        </Button>
      </div>
    </div>
  );
}

function RecruiterInfoCard({
  recruiter,
  onEdit,
}: {
  recruiter: RecruiterInfo;
  onEdit: () => void;
}) {
  const getStatusText = (status: string) =>
    STATUS_TRANSLATIONS[status] || status;
  const getStatusColor = (status: string) =>
    STATUS_COLORS[status] || "bg-gray-500 text-white";

  return (
    <div className="rounded-lg border bg-white p-4 flex items-start gap-4">
      <img
        src={recruiter.companyLogoUrl}
        alt="Logo công ty"
        className="h-16 w-16 object-contain rounded-md border"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-logo.png";
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">{recruiter.companyName}</h2>
              <span
                className={`text-xs rounded-full px-2 py-1 border font-bold ${getStatusColor(
                  recruiter.status as string
                )}`}
              >
                {getStatusText(recruiter.status as string)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {recruiter.companyEmail}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">SĐT:</span>{" "}
                {recruiter.companyPhone}
              </div>
              {recruiter.companyCertificateUrl && (
                <a
                  href={recruiter.companyCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-block"
                >
                  Xem giấy chứng nhận
                </a>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={onEdit} className="ml-4">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function JobPostsManagement({
  jobPosts,
  isLoading,
  onPageChange,
  currentPage,
}: JobPostsManagementProps) {
  const { user } = useAuth();
  const [selectedJobPostId, setSelectedJobPostId] = useState<number | null>(
    null
  );
  const [recruiterInfo, setRecruiterInfo] = useState<RecruiterInfo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<
    RecruiterInfo | undefined
  >();

  const {
    GET_RECRUITER_INFO,
    CREATE_RECRUITER,
    UPDATE_RECRUITER_STATUS,
    UPDATE_RECRUITER,
    UPDATE_RECRUITER_INFO,
  } = useRecruiterService();

  // Memoized values
  const currentRecruiter = useMemo(() => recruiterInfo[0], [recruiterInfo]);

  const canAddJobPosts = useMemo(
    () => recruiterInfo.length > 0 && recruiterInfo[0].status === "Active",
    [recruiterInfo]
  );

  // Handlers
  const fetchRecruiterInfo = useCallback(
    async (userId: number) => {
      if (!userId) return;

      try {
        const response = await GET_RECRUITER_INFO(userId);
        if (isApiSuccess(response) && response.data) {
          setRecruiterInfo(response.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch recruiter info:", error);
        toast.error("Không thể tải thông tin nhà tuyển dụng");
      }
    },
    [] // Remove GET_RECRUITER_INFO from dependencies as it should be stable
  );

  const determineUpdateType = useCallback((data: UpdateData) => {
    if (data.status && Object.keys(data).length === 2 && data.recruiterInfoId) {
      return "status";
    }
    if (data.userId && data.companyName && data.companyEmail) {
      return "info";
    }
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
          if (user?.userId) {
            fetchRecruiterInfo(user.userId);
          }
          setSelectedRecruiter(undefined);
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
      user?.userId,
    ]
  );

  const handleSave = useCallback(
    async (data: Partial<RecruiterInfo> & { status: string }) => {
      if (!user?.userId) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      try {
        let response;

        if (data.recruiterInfoId) {
          // Update existing recruiter status
          response = await UPDATE_RECRUITER_STATUS(
            data.recruiterInfoId,
            data.status
          );
          if (isApiSuccess(response)) {
            toast.success("Cập nhật thành công!");
          }
        } else {
          // Create new recruiter
          const createData: CreateRecruiterData = {
            ...data,
            userId: user.userId,
          } as CreateRecruiterData;

          response = await CREATE_RECRUITER(createData);
          if (isApiSuccess(response)) {
            toast.success("Tạo nhà tuyển dụng thành công!");
          }
        }

        if (isApiSuccess(response)) {
          fetchRecruiterInfo(user.userId);
        } else {
          toast.error(response.message || "Thao tác thất bại!");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        console.error("Failed to save recruiter:", error);
      } finally {
        handleCloseDialog();
      }
    },
    [user?.userId, UPDATE_RECRUITER_STATUS, CREATE_RECRUITER]
  );

  const handleOpenRegisterDialog = useCallback(() => {
    setSelectedRecruiter(undefined);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback(() => {
    setSelectedRecruiter(currentRecruiter);
    setIsDialogOpen(true);
  }, [currentRecruiter]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedRecruiter(undefined);
  }, []);

  const handleCloseJobPostDialog = useCallback(() => {
    setSelectedJobPostId(null);
  }, []);

  // Effects
  useEffect(() => {
    if (user?.userId) {
      fetchRecruiterInfo(user.userId);
    }
  }, [user?.userId]); // Remove fetchRecruiterInfo from dependencies to prevent infinite loop

  return (
    <div className="space-y-6">
      {/* Header */}
      <JobPostHeader ableToAdd={canAddJobPosts} />

      {/* Recruiter Info Section */}
      {recruiterInfo.length === 0 ? (
        <NoRecruiterState onRegister={handleOpenRegisterDialog} />
      ) : (
        <RecruiterInfoCard
          recruiter={currentRecruiter}
          onEdit={handleOpenEditDialog}
        />
      )}

      {/* Job Posts Table */}
      <JobPostTable
        jobPosts={jobPosts}
        isLoading={isLoading}
        onPageChange={onPageChange}
        currentPage={currentPage}
        onViewApplicants={setSelectedJobPostId}
      />

      {/* Dialogs */}
      <JobPostApplicantsDialog
        jobPostId={selectedJobPostId}
        open={!!selectedJobPostId}
        onOpenChange={handleCloseJobPostDialog}
      />

      <RecruiterDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        recruiter={selectedRecruiter}
        onSave={handleSave}
        onUpdate={handleUpdate}
        user={user as User}
      />
    </div>
  );
}
