import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useGetJobApplicationsByJobPostId } from "@/hooks/use-job-applications";
import { useCV } from "@/hooks/use-cv";
import { isApiSuccess } from "@/lib/utils";
import type { CV } from "@/types/interfaces";
import {
  Eye,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  DollarSign,
  Globe,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useUpdateJobApplicationStatus } from "@/hooks/use-job-applications";
import { format } from "date-fns";

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

  const [selectedCandidate, setSelectedCandidate] = useState<CV | null>(null);

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
                            onClick={() => setSelectedCandidate(cv)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>

            {/* Candidate Details Dialog */}
            <Dialog
              open={!!selectedCandidate}
              onOpenChange={() => setSelectedCandidate(null)}
            >
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Candidate Details
                  </DialogTitle>
                </DialogHeader>
                {selectedCandidate && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">
                        {selectedCandidate.fullName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span>{selectedCandidate.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span>{selectedCandidate.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>
                            {selectedCandidate.address},{" "}
                            {selectedCandidate.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>
                            Born:{" "}
                            {format(
                              new Date(selectedCandidate.birthday),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-medium">
                            Gender:
                          </span>
                          <span>{selectedCandidate.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              selectedCandidate.status === "Public"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedCandidate.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            Employment History
                          </h4>
                          <div className="space-y-3 text-sm">
                            {selectedCandidate.employmentHistories &&
                            selectedCandidate.employmentHistories.length > 0 ? (
                              selectedCandidate.employmentHistories.map(
                                (employment, index) => (
                                  <div
                                    key={index}
                                    className="border-l-2 border-blue-200 pl-3"
                                  >
                                    <p className="font-medium text-blue-700">
                                      {employment.companyName}
                                    </p>
                                    <p className="text-gray-600">
                                      {employment.jobLevel}
                                    </p>
                                    <div className="text-xs text-gray-500">
                                      {format(
                                        new Date(employment.startDate),
                                        "MMM yyyy"
                                      )}{" "}
                                      -
                                      {employment.isCurrentJob
                                        ? "Present"
                                        : employment.endDate
                                        ? format(
                                            new Date(employment.endDate),
                                            "MMM yyyy"
                                          )
                                        : "N/A"}
                                      {employment.isCurrentJob && (
                                        <Badge
                                          className="ml-2 text-xs"
                                          variant="secondary"
                                        >
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-gray-500 italic">
                                No employment history available
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            Education
                          </h4>
                          <div className="space-y-2 text-sm">
                            {selectedCandidate.schoolName && (
                              <p>
                                <span className="font-medium">School:</span>{" "}
                                {selectedCandidate.schoolName}
                              </p>
                            )}
                            {selectedCandidate.degree && (
                              <p>
                                <span className="font-medium">Degree:</span>{" "}
                                {selectedCandidate.degree}
                              </p>
                            )}
                            {selectedCandidate.fieldOfStudy && (
                              <p>
                                <span className="font-medium">
                                  Field of Study:
                                </span>{" "}
                                {selectedCandidate.fieldOfStudy}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Major:</span>{" "}
                              {selectedCandidate.majorName}
                            </p>
                            {selectedCandidate.graduationYear && (
                              <p>
                                <span className="font-medium">
                                  Graduation Year:
                                </span>{" "}
                                {selectedCandidate.graduationYear}
                              </p>
                            )}
                            {selectedCandidate.educationDescription && (
                              <p className="text-gray-600 italic mt-2">
                                {selectedCandidate.educationDescription}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedCandidate.skillNames &&
                            selectedCandidate.skillNames.length > 0 ? (
                              selectedCandidate.skillNames.map(
                                (skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                )
                              )
                            ) : (
                              <p className="text-gray-500 italic text-sm">
                                No skills specified
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            Language Skills
                          </h4>
                          <div className="text-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {selectedCandidate.language}
                              </span>
                              <Badge variant="secondary">
                                {selectedCandidate.languageLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            Salary Expectations
                          </h4>
                          <div className="text-sm">
                            <p className="font-medium text-blue-600">
                              {selectedCandidate.minSalary.toLocaleString()} -{" "}
                              {selectedCandidate.maxSalary.toLocaleString()} VND
                            </p>
                            {selectedCandidate.isDeal && (
                              <Badge className="mt-1" variant="outline">
                                Negotiable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Career Objective
                          </h4>
                          <div className="text-sm space-y-2">
                            <p>
                              <span className="font-medium">
                                Desired Position:
                              </span>{" "}
                              {selectedCandidate.desiredJob}
                            </p>
                            <p>
                              <span className="font-medium">
                                Current Position:
                              </span>{" "}
                              {selectedCandidate.position}
                            </p>
                            {selectedCandidate.startAt &&
                              selectedCandidate.endAt && (
                                <p>
                                  <span className="font-medium">
                                    Availability:
                                  </span>{" "}
                                  {selectedCandidate.startAt} -{" "}
                                  {selectedCandidate.endAt}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Work Experience Details
                          </h4>
                          <div className="text-sm space-y-3">
                            {selectedCandidate.employmentHistories &&
                            selectedCandidate.employmentHistories.length > 0 ? (
                              selectedCandidate.employmentHistories.map(
                                (employment, index) => (
                                  <div
                                    key={index}
                                    className="border-l-4 border-blue-200 pl-4 pb-3"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h5 className="font-medium text-blue-700">
                                          {employment.companyName}
                                        </h5>
                                        <p className="text-gray-600 text-xs">
                                          {employment.jobLevel}
                                        </p>
                                      </div>
                                      <div className="text-right text-xs text-gray-500">
                                        {format(
                                          new Date(employment.startDate),
                                          "MMM yyyy"
                                        )}{" "}
                                        -
                                        {employment.isCurrentJob
                                          ? "Present"
                                          : employment.endDate
                                          ? format(
                                              new Date(employment.endDate),
                                              "MMM yyyy"
                                            )
                                          : "N/A"}
                                      </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                      {employment.primaryDuties}
                                    </p>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-gray-500 italic">
                                No work experience details available
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedCandidate.additionalContent && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Additional Information
                            </h4>
                            <div className="text-sm">
                              <p className="whitespace-pre-wrap leading-relaxed">
                                {selectedCandidate.additionalContent}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCandidate(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
