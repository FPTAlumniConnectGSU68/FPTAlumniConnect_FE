"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCV, useCreateCV, useUpdateCV } from "@/hooks/use-cv";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { isApiSuccess } from "@/lib/utils";
import { CV } from "@/types/interfaces";
import { JobApplicationByCvid } from "@/types/interfaces";
import { ArrowRight, Download, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDateToDMY } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import { useGetJobApplicationsByCvid } from "@/hooks/use-job-applications";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRecommendedJobsByCv } from "@/hooks/use-jobs";
type ViewMode = "create" | "edit" | "preview";

const VIEW_MODE: Record<Uppercase<ViewMode>, ViewMode> = {
  CREATE: "create",
  EDIT: "edit",
  PREVIEW: "preview",
};

function buildCreateCvPayload(data: CV, currentUserId: number) {
  return {
    userId: currentUserId,
    fullName: data.fullName,
    address: data.address,
    birthday: data.birthday,
    gender: data.gender,
    email: data.email,
    phone: data.phone,
    city: data.city,
    employmentHistories: data.employmentHistories || [],
    language: data.language,
    languageLevel: data.languageLevel,
    minSalary: data.minSalary,
    maxSalary: data.maxSalary,
    isDeal: data.isDeal,
    desiredJob: data.desiredJob,
    position: data.position,
    majorId:
      typeof data.majorId === "string" ? parseInt(data.majorId) : data.majorId,
    additionalContent: data.additionalContent,
    schoolName: data.schoolName,
    degree: data.degree,
    fieldOfStudy: data.fieldOfStudy,
    graduationYear: data.graduationYear,
    educationDescription: data.educationDescription,
    status: data.status,
    startAt: data.startAt,
    endAt: data.endAt,
    skillIds: data.skillIds,
  };
}

function buildUpdateCvPayload(data: CV, currentUserId: number) {
  return {
    id: data.id,
    userId: currentUserId,
    fullName: data.fullName,
    address: data.address,
    birthday: data.birthday,
    gender: data.gender,
    email: data.email,
    phone: data.phone,
    city: data.city,
    employmentHistories: data.employmentHistories || [],
    language: data.language,
    languageLevel: data.languageLevel,
    minSalary: data.minSalary,
    maxSalary: data.maxSalary,
    isDeal: data.isDeal,
    desiredJob: data.desiredJob,
    position: data.position,
    majorId:
      typeof data.majorId === "string" ? parseInt(data.majorId) : data.majorId,
    additionalContent: data.additionalContent,
    schoolName: data.schoolName,
    degree: data.degree,
    fieldOfStudy: data.fieldOfStudy,
    graduationYear: data.graduationYear,
    educationDescription: data.educationDescription,
    status: data.status,
    startAt: data.startAt,
    endAt: data.endAt,
    skillIds: data.skillIds,
  };
}

const CVView = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: majorCodes } = useMajorCodes({
    query: {
      Size: "300",
    },
  });
  const { user } = useAuth();

  // Memoize derived data
  const majorItems = useMemo(
    () =>
      majorCodes && isApiSuccess(majorCodes)
        ? majorCodes.data?.items ?? []
        : [],
    [majorCodes]
  );

  const downloadPDF = useCallback(async (cv: CV) => {
    try {
      await generatePDF(pdfRef, {
        filename: `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, []);

  const currentUserId = user?.userId ?? 0;
  const userIdString = user?.userId ? user.userId.toString() : "";

  const {
    data: cvData,
    isLoading,
    refetch,
  } = useCV({
    query: {
      UserId: userIdString,
    },
  });

  const createCV = useCreateCV();

  const updateCV = useUpdateCV();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);
  const [mode, setMode] = useState<ViewMode>(VIEW_MODE.CREATE);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplicationByCvid | null>(
    null
  );
  const { data: jobApplicationsData } = useGetJobApplicationsByCvid(
    selectedCV?.id ?? 0
  );

  const jobApplications = useMemo(() => {
    if (!jobApplicationsData || !isApiSuccess(jobApplicationsData))
      return [] as any[];
    const data: any = jobApplicationsData.data;
    const list = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.items)
        ? data?.items
        : [];
    return list;
  }, [jobApplicationsData]);

  const handleOpenCreateForm = useCallback(() => {
    setSelectedCV(null);
    setMode(VIEW_MODE.CREATE);
    setIsFormOpen(true);
  }, []);

  const handleOpenEditForm = useCallback((cv: CV) => {
    setSelectedCV(cv);
    setMode(VIEW_MODE.EDIT);
    setIsFormOpen(true);
  }, []);

  const handleSubmit = useCallback(
    async (data: CV) => {
      try {
        if (mode === VIEW_MODE.CREATE) {
          const payload = buildCreateCvPayload(data, currentUserId);
          const result = await createCV.mutateAsync(payload);

          if (result.status === "success") {
            setIsFormOpen(false);
            refetch();
          } else {
            toast.error(result.message || "Failed to create CV");
          }
        } else {
          const payload = buildUpdateCvPayload(data, currentUserId);
          const result = await updateCV.mutateAsync(payload);

          if (result.status === "success") {
            setIsFormOpen(false);
            refetch();
          } else {
            toast.error(result.message || "Failed to update CV");
          }
        }
      } catch (error) {
        console.error("Error saving CV:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to save CV"
        );
      }
    },
    [mode, currentUserId, createCV, updateCV, refetch]
  );

  const cvItems = useMemo(
    () => (cvData && isApiSuccess(cvData) ? cvData.data?.items ?? [] : []),
    [cvData]
  );

  // Recommended jobs by selected CV
  const [selectedCvIdForRecommend, setSelectedCvIdForRecommend] = useState<
    number | null
  >(null);

  // Auto-select first CV when list is available
  useEffect(() => {
    if (!selectedCvIdForRecommend && cvItems.length > 0) {
      setSelectedCvIdForRecommend(cvItems[0].id);
    }
  }, [cvItems, selectedCvIdForRecommend]);
  const { data: recJobsByCv, isLoading: isLoadingRecommendedJobs } =
    useRecommendedJobsByCv(selectedCvIdForRecommend ?? undefined, 1, 6);

  const recommendedJobItems = useMemo(() => {
    if (!recJobsByCv || !isApiSuccess(recJobsByCv)) return [] as any[];
    return recJobsByCv.data?.items ?? [];
  }, [recJobsByCv]);

  const triggerFormSubmit = useCallback(() => {
    if (typeof document === "undefined") return;
    const form = document.getElementById("cv-form") as HTMLFormElement | null;
    if (form) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="my-cvs" className="space-y-8">
        <div className="flex w-full justify-center">
          <TabsList className="mx-auto inline-flex items-center gap-1 rounded-lg border bg-white p-1 shadow-sm">
            <TabsTrigger
              value="my-cvs"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              My CVs
            </TabsTrigger>
            <TabsTrigger
              value="recommended-jobs"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Recommended Jobs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Edit/Create Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {mode === VIEW_MODE.EDIT ? "Chỉnh sửa CV" : "Tạo CV mới"}
              </DialogTitle>
              <DialogDescription>
                {mode === VIEW_MODE.EDIT
                  ? "Chỉnh sửa chi tiết CV của bạn"
                  : "Điền chi tiết CV của bạn để bắt đầu tìm kiếm việc làm"}
              </DialogDescription>
            </DialogHeader>
            <CVForm
              initialData={selectedCV}
              onSubmit={handleSubmit}
              majorItems={majorItems}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Hủy
              </Button>
              <Button
                disabled={createCV.isPending || updateCV.isPending}
                onClick={triggerFormSubmit}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {mode === VIEW_MODE.EDIT ? "Lưu thay đổi" : "Tạo CV"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                Xem trước CV
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedCV && downloadPDF(selectedCV)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải xuống PDF
                </Button>
              </DialogTitle>
            </DialogHeader>
            {selectedCV && <CVPreview ref={pdfRef} cv={selectedCV} />}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Job Dialog */}
        <Dialog open={isJobOpen} onOpenChange={setIsJobOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Xem job đã apply</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              {jobApplications.length > 0 ? (
                jobApplications.map((app: JobApplicationByCvid) => {
                  const statusColor =
                    app.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800";

                  return (
                    <Card
                      key={app.applicationId}
                      className="border hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-base font-semibold">
                              Ứng tuyển #{app.applicationId}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Job ID: {app.jobPostId}
                            </div>
                          </div>
                          <Badge className={statusColor}>{app.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">CV:</span> {app.cvid}
                          </div>
                          {app.letterCover && (
                            <div>
                              <span className="font-medium">
                                Thư ứng tuyển:
                              </span>{" "}
                              {app.letterCover}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Nộp: {formatDateToDMY(app.createdAt)} • Cập nhật:{" "}
                              {formatDateToDMY(app.updatedAt)}
                            </div>
                            <div
                              className="text-blue-500 cursor-pointer underline flex items-center gap-1"
                              onClick={() => {
                                router.push(`/jobs?id=${app.jobPostId}`);
                              }}
                            >
                              Nhảy tới việc làm
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">Không có job đã apply</div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <TabsContent value="my-cvs">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My CVs</h1>
            <Button
              onClick={handleOpenCreateForm}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo CV mới
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Đang tải CV...</div>
          ) : cvItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvItems.map((cv: CV) => (
                <Card key={cv.id} className="p-4 transition-shadow">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">
                      {cv.desiredJob || "Untitled CV"}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Chức vụ: {cv.position || "Không xác định"}
                    </div>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${cv.status === "Public"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {cv.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenEditForm(cv)}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedCV(cv);
                          setIsPreviewOpen(true);
                        }}
                      >
                        Xem trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedCV(cv);
                          setSelectedJob(null);
                          setIsJobOpen(true);
                        }}
                      >
                        Xem job đã apply
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              Không tìm thấy CV. Tạo CV mới để bắt đầu tìm kiếm việc làm.
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended-jobs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold">Recommended Jobs</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Select CV:</span>
              <select
                className="h-9 rounded-md border px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCvIdForRecommend ?? ""}
                onChange={(e) =>
                  setSelectedCvIdForRecommend(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">-- Chọn CV --</option>
                {cvItems.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.desiredJob || `CV #${cv.id}`} (
                    {cv.position || "Unknown"})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingRecommendedJobs ? (
            <div className="text-center py-8">Đang tải job...</div>
          ) : selectedCvIdForRecommend == null ? (
            <div className="text-center py-8 text-gray-600">
              Hãy chọn một CV để xem gợi ý việc làm.
            </div>
          ) : recommendedJobItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedJobItems.map((job: any) => (
                <Card key={job.jobPostId} className="p-4 transition-shadow">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">
                      {job.jobTitle}
                    </h3>
                    <div className="text-sm text-gray-500">{job.location}</div>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${job.status === "Open"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Lương: {job.minSalary} - {job.maxSalary}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Ngày đăng: {formatDateToDMY(job.time)}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/jobs?id=${job.jobPostId}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              Chưa có gợi ý việc làm.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CVView;
