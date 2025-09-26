import { JobPostApplicantsDialog } from "@/components/admin/jobpost/JobPostApplicantsDialog";
import JobPostHeader from "@/components/admin/jobpost/JobPostHeader";
import JobPostTable from "@/components/admin/jobpost/JobPostTable";
import { RecruiterDialog } from "@/components/admin/recuiter/RecuiterInfoDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import useRecruiterService from "@/lib/services/recuiter.service";
import { isApiSuccess } from "@/lib/utils";
import { JobPost, RecruiterInfo, User } from "@/types/interfaces";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const [selectedJobPostId, setSelectedJobPostId] = useState<number | null>(
    null
  );
  const { GET_RECRUITER_INFO, CREATE_RECRUITER, UPDATE_RECRUITER } =
    useRecruiterService();
  const [recruiter, setRecruiter] = useState<RecruiterInfo[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<
    RecruiterInfo | undefined
  >(undefined);

  const fetchRecruiter = async (userId: any) => {
    try {
      const res = await GET_RECRUITER_INFO(userId);
      if (isApiSuccess(res) && res.data) {
        setRecruiter(res.data.items);
      }
    } catch (err) {
      console.error("Failed to fetch recruiter info:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchRecruiter(user.userId);
  }, [user]);

  const handleSave = async (
    data: Partial<RecruiterInfo> & { status: string }
  ) => {
    try {
      // Update status if recruiter exists
      if (data.recruiterInfoId) {
        const res = await UPDATE_RECRUITER(data.recruiterInfoId, data.status);
        if (isApiSuccess(res)) {
          toast("Cập nhật thành công");
          fetchRecruiter(user?.userId);
        }
      } else {
        // Create new recruiter
        const res = await CREATE_RECRUITER({ ...data, userId: user?.userId });
        if (isApiSuccess(res)) {
          toast("Create successfull");
          fetchRecruiter(user?.userId);
        }
      }
    } catch (error) {
      toast("Something gone wrong, please try again later.");
    }
    setOpen(false);
    setSelectedRecruiter(undefined);
  };

  const getRecruiterStatus = (status: string) => {
    if (status === "Active") return "Hoạt động";
    if (status === "Inactive") return "Không hoạt động";
    if (status === "Pending") return "Chờ duyệt";
    return status;
  };

  const getRecruiterStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-500 text-white";
    if (status === "Inactive") return "bg-red-500 text-white";
    if (status === "Pending") return "bg-yellow-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-4">
      <JobPostHeader ableToAdd={recruiter.length > 0} />
      {recruiter.length <= 0 ? (
        <div className="flex items-center justify-center h-56">
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 shadow-sm text-center max-w-md">
            <p className="text-gray-600">
              Bạn chưa thuộc nhà tuyển dụng nào. <br />
              Đăng ký nhà tuyển dụng ngay!
            </p>
            <Button
              onClick={() => {
                setSelectedRecruiter(undefined);
                setOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Đăng ký nhà tuyển dụng
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-white p-4 flex items-start gap-4">
            <img
              src={recruiter[0]?.companyLogoUrl}
              alt="Logo công ty"
              className="h-16 w-16 object-contain rounded-md border"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {recruiter[0]?.companyName}
                    </h2>
                    <span
                      className={`text-xs rounded-full px-2 py-1 border font-bold ${getRecruiterStatusColor(
                        recruiter[0]?.status as string
                      )}`}
                    >
                      {getRecruiterStatus(recruiter[0]?.status as string)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Email: {recruiter[0]?.companyEmail}
                  </div>
                  <div className="text-sm text-gray-600">
                    SĐT: {recruiter[0]?.companyPhone}
                  </div>
                  {recruiter[0]?.companyCertificateUrl && (
                    <a
                      href={recruiter[0]?.companyCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Xem giấy chứng nhận
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-col">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRecruiter(recruiter[0]);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <>
        <JobPostTable
          jobPosts={jobPosts}
          isLoading={isLoading}
          onPageChange={onPageChange}
          currentPage={currentPage}
          onViewApplicants={setSelectedJobPostId}
        />
      </>
      <JobPostApplicantsDialog
        jobPostId={selectedJobPostId}
        open={!!selectedJobPostId}
        onOpenChange={() => setSelectedJobPostId(null)}
      />

      <RecruiterDialog
        isOpen={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelectedRecruiter(undefined);
        }}
        recruiter={selectedRecruiter}
        onSave={handleSave}
        user={user as User}
      />
    </div>
  );
}
