import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetJobApplicationsByJobPostId } from "@/hooks/use-job-applications";
import { useCV } from "@/hooks/use-cv";
import { isApiSuccess } from "@/lib/utils";
import type { CV } from "@/types/interfaces";
import { Eye, FileDown, Check, X } from "lucide-react";
import CVPreview from "@/components/user-alumni/CVPreview";
import { useMemo, useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import { useUpdateJobApplicationStatus } from "@/hooks/use-job-applications";

export function JobPostApplicantsDialog({
  jobPostId,
  open,
  onOpenChange,
}: {
  jobPostId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: applicantsData, isLoading } = useGetJobApplicationsByJobPostId(
    jobPostId ?? 0
  );

  // Fetch all CVs to map cvid -> CV details
  const { data: cvData } = useCV({ size: 100, query: {} });
  const cvItems = useMemo<CV[]>(() => {
    return cvData && isApiSuccess(cvData) ? cvData.data?.items ?? [] : [];
  }, [cvData]);

  const cvMap = useMemo(() => {
    const map = new Map<number, CV>();
    for (const cv of cvItems) map.set(cv.id, cv);
    return map;
  }, [cvItems]);

  const pdfRef = useRef<HTMLDivElement>(null);
  const [previewCV, setPreviewCV] = useState<CV | null>(null);

  const handleDownload = async (cv: CV) => {
    setPreviewCV(cv);
    await new Promise((r) => setTimeout(r, 0));
    try {
      await generatePDF(pdfRef, {
        filename: `${cv.fullName.replace(/\s+/g, "_")}_CV.pdf`,
      });
    } catch {}
  };

  const applicants = useMemo(() => {
    if (!applicantsData || !isApiSuccess(applicantsData)) return [] as any[];
    // API looks like single or list? Assuming items when paginated isn't provided; adapt if needed
    const data: any = applicantsData.data as any;
    const list = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data)
      ? data
      : [];
    return list;
  }, [applicantsData]);

  const updateStatus = useUpdateJobApplicationStatus(jobPostId ?? undefined);
  const handleApprove = (applicationId: number) => {
    updateStatus.mutate({ applicationId, status: "Approved" });
  };
  const handleReject = (applicationId: number) => {
    updateStatus.mutate({ applicationId, status: "Rejected" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Applicants</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No applicants yet
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="max-h-[60vh] pr-2">
              <ul className="divide-y divide-gray-200">
                {applicants.map((app: any) => {
                  const cv = cvMap.get(app.cvid);
                  return (
                    <li
                      key={app.applicationId}
                      className="py-3 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {cv?.fullName || `CV #${app.cvid}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {cv?.desiredJob || "Desired job not specified"}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {app.letterCover}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Status: {app.status}
                        </p>
                      </div>
                      <div className="shrink-0 flex gap-2">
                        {app.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleApprove(app.applicationId)}
                              className="flex items-center gap-1"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(app.applicationId)}
                              className="flex items-center gap-1"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {cv && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewCV(cv)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> View
                          </Button>
                        )}
                        {cv && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(cv)}
                            className="flex items-center gap-1"
                          >
                            <FileDown className="w-4 h-4" /> Download
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>

            {previewCV && (
              <div className="border rounded-md">
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <p className="font-medium">CV Preview</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewCV(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="p-3">
                  <div className="overflow-auto">
                    <CVPreview ref={pdfRef} cv={previewCV} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
