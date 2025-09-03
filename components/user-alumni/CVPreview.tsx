"use client";

import { CV } from "@/types/interfaces";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Building2, GraduationCap } from "lucide-react";
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
        <div className="flex flex-wrap gap-6 text-sm">
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
        </div>
      </div>

      <div className="p-8 grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Professional Summary */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Tóm tắt nghề nghiệp
            </h2>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{cv.company}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>{cv.jobLevel}</span>
            </div>
          </section>

          {/* Language Skills */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Kỹ năng ngoại ngữ
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{cv.language}</span>
                <span className="text-blue-600">{cv.languageLevel}</span>
              </div>
            </div>
          </section>

          {/* Salary Expectations */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Kỳ vọng lương
            </h2>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 font-medium">
                {cv.minSalary.toLocaleString()} -{" "}
                {cv.maxSalary.toLocaleString()} VND
              </p>
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
              <h3 className="font-medium text-blue-800 mb-2">
                Vị trí mong muốn
              </h3>
              <p className="text-lg font-medium mb-1">{cv.desiredJob}</p>
              <p className="text-gray-600">{cv.position}</p>
            </div>
          </section>

          {/* Work Experience */}
          <section>
            <h2 className="text-lg font-semibold text-blue-800 border-b-2 border-blue-800 pb-2 mb-3">
              Kinh nghiệm làm việc
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  Nhiệm vụ chính
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {cv.primaryDuties}
                </p>
              </div>
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
