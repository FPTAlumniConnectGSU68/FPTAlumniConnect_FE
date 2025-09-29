"use client";

import { CV } from "@/types/interfaces";
import { format } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Calendar,
  DollarSign,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { forwardRef } from "react";

interface CVPreviewProps {
  cv: CV;
  ref?: React.Ref<HTMLDivElement>;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ cv }, ref) => {
  return (
    <div ref={ref} className="bg-white w-[210mm] mx-auto shadow-2xl">
      {/* Header with Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {cv.fullName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {cv.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {cv.phone}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {cv.address}, {cv.city}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Born: {format(new Date(cv.birthday), "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Gender:</span>
            <span>{cv.gender}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={cv.status === "Public" ? "default" : "secondary"}>
              {cv.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Employment History */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Lịch sử làm việc
            </h2>
            <div className="space-y-3 text-sm">
              {cv.employmentHistories && cv.employmentHistories.length > 0 ? (
                cv.employmentHistories.map((employment, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <p className="font-medium text-blue-700">
                      {employment.companyName}
                    </p>
                    <p className="text-gray-600">{employment.jobLevel}</p>
                    <div className="text-xs text-gray-500">
                      {format(new Date(employment.startDate), "MMM yyyy")} -
                      {employment.isCurrentJob
                        ? "Present"
                        : employment.endDate
                        ? format(new Date(employment.endDate), "MMM yyyy")
                        : "N/A"}
                      {employment.isCurrentJob && (
                        <Badge className="ml-2 text-xs" variant="secondary">
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No employment history available
                </p>
              )}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Học vấn
            </h2>
            <div className="space-y-2 text-sm">
              {cv.schoolName && (
                <p>
                  <span className="font-medium">Trường:</span> {cv.schoolName}
                </p>
              )}
              {cv.degree && (
                <p>
                  <span className="font-medium">Bằng cấp:</span> {cv.degree}
                </p>
              )}
              {cv.fieldOfStudy && (
                <p>
                  <span className="font-medium">Chuyên ngành:</span>{" "}
                  {cv.fieldOfStudy}
                </p>
              )}
              <p>
                <span className="font-medium">Ngành:</span> {cv.majorName}
              </p>
              {cv.graduationYear && (
                <p>
                  <span className="font-medium">Năm tốt nghiệp:</span>{" "}
                  {cv.graduationYear}
                </p>
              )}
              {cv.educationDescription && (
                <p className="text-gray-600 italic mt-2">
                  {cv.educationDescription}
                </p>
              )}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Kỹ năng
            </h2>
            <div className="flex flex-wrap gap-1">
              {cv.skillNames && cv.skillNames.length > 0 ? (
                cv.skillNames.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No skills specified
                </p>
              )}
            </div>
          </section>

          {/* Language Skills */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              Kỹ năng ngoại ngữ
            </h2>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium">{cv.language}</span>
                <Badge variant="secondary">{cv.languageLevel}</Badge>
              </div>
            </div>
          </section>

          {/* Salary Expectations */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Kỳ vọng lương
            </h2>
            <div className="text-sm">
              <p className="font-medium text-blue-600">
                {cv.minSalary.toLocaleString()} -{" "}
                {cv.maxSalary.toLocaleString()} VND
              </p>
              {cv.isDeal && (
                <Badge className="mt-1" variant="outline">
                  Có thể thương lượng
                </Badge>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-span-2 space-y-6">
          {/* Career Objective */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Mục tiêu nghề nghiệp
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Vị trí mong muốn:</span>{" "}
                  {cv.desiredJob}
                </p>
                <p>
                  <span className="font-medium">Vị trí hiện tại:</span>{" "}
                  {cv.position}
                </p>
                {cv.startAt && cv.endAt && (
                  <p>
                    <span className="font-medium">
                      Thời gian có thể làm việc:
                    </span>{" "}
                    {cv.startAt} - {cv.endAt}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Work Experience Details */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Chi tiết kinh nghiệm làm việc
            </h2>
            <div className="text-sm space-y-3">
              {cv.employmentHistories && cv.employmentHistories.length > 0 ? (
                cv.employmentHistories.map((employment, index) => (
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
                        {format(new Date(employment.startDate), "MMM yyyy")} -
                        {employment.isCurrentJob
                          ? "Present"
                          : employment.endDate
                          ? format(new Date(employment.endDate), "MMM yyyy")
                          : "N/A"}
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {employment.primaryDuties}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Không có thông tin chi tiết về kinh nghiệm làm việc
                </p>
              )}
            </div>
          </section>

          {/* Additional Information */}
          {cv.additionalContent && (
            <section>
              <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
                Thông tin bổ sung
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {cv.additionalContent}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 text-sm text-gray-500 bg-gray-50">
        <div className="flex justify-between max-w-4xl mx-auto">
          <p>
            Trạng thái: <span className="text-blue-600">{cv.status}</span>
          </p>
          <p>Lần cuối cập nhật: {format(new Date(), "MMMM dd, yyyy")}</p>
        </div>
      </div>
    </div>
  );
});

export default CVPreview;

// Export the component name for PDF generation
CVPreview.displayName = "CVPreview";
