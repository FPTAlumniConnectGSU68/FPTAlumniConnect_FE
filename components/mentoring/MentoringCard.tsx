import { Button } from "@/components/ui/button";
import { MentoringRequest, Schedule } from "@/types/interfaces";
import { Clock, Star, UserCheck } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { formatDateToDMY, formatTime } from "@/lib/utils";

interface MentoringCardProps {
  request: MentoringRequest;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  onRating?: (requestId: number) => void;
  setScheduleObject?: (schedule: Schedule) => void;
}

export function MentoringCard({
  request,
  actionButton,
  onRating,
  setScheduleObject,
}: MentoringCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  function renderDateTimeRange(start?: string, end?: string) {
    if (!start || !end) return "—";

    const startDate = formatDateToDMY(start);
    const startTime = formatTime(start);
    const endDate = formatDateToDMY(end);
    const endTime = formatTime(end);

    // If same day → compact format
    if (startDate === endDate) {
      return `${startDate} ${startTime} - ${endTime}`;
    }

    // Different day → show both
    return `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }

  console.log("request 55:", request.requestMessage);

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
      {request.status === "Completed" && (
        <div className="pointer-events-none absolute -right-10 top-6 z-10 rotate-45">
          <span className="block bg-blue-600 text-white font-bold text-xs tracking-wide px-10 py-1 shadow-md">
            Đã hoàn thành
          </span>
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="font-bold text-lg">
            Yêu cầu từ{" "}
            <span className="text-blue-500">{request.alumniName}</span>
          </div>
          <div className="text-gray-600 mt-2">{request.requestMessage}</div>
          <div className="flex gap-2 mt-2">
            <span
              className={`inline-block text-xs px-2 py-1 rounded font-semibold ${getStatusColor(
                request.status
              )}`}
            >
              {request.status}
            </span>
            {request.status === "Active" && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded font-semibold bg-red-100 text-red-700">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Phiên đang diễn ra
              </span>
            )}
          </div>
          {(request.status === "Completed" || request.status === "Active") && (
            <div>
              <div className="text-sm mt-3 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 p-2.5 rounded-lg border border-blue-200">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-600">Nhận bởi Mentor:</span>
                  <span className="font-medium text-blue-700 bg-white px-2.5 py-1 rounded-md shadow-sm">
                    {request.schedules[0]?.mentorName ?? "Unknown"}
                  </span>
                </div>
              </div>
              <div className="text-sm mt-2 bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200 shadow-sm">
                <div className="flex gap-2 mb-2">
                  <span className="text-gray-700 font-medium">Chủ đề</span>
                </div>
                <div className="font-normal text-blue-600 bg-white px-3 py-1.5 rounded-md shadow-sm text-xs md:text-sm">
                  {request.schedules[0]?.content || "—"}
                </div>
              </div>

              <div className="text-sm mt-2 bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 shadow-sm">
                <div className="flex gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Thời gian</span>
                </div>

                <div className="font-normal text-purple-700 bg-white px-2 py-1.5 rounded-md shadow-sm text-xs md:text-sm">
                  {renderDateTimeRange(
                    request.schedules[0]?.startTime,
                    request.schedules[0]?.endTime
                  )}
                </div>
              </div>
            </div>
          )}
          {request.status === "Cancelled" && (
            <div className="text-sm mt-2">
              <span className="text-gray-700 font-medium">Lý do: </span>
              {request.resultMessage || "—"}
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-auto text-sm text-gray-500 items-center justify-between">
        <div className="flex flex-col gap-1">
          <div>
            <b>Tạo bởi:</b> {request.alumniName}
          </div>
          <div>
            <b>Ngày tạo:</b> {formatDateToDMY(request.createdAt)}
          </div>
        </div>
        {actionButton && (
          <Button variant="outline" size="sm" onClick={actionButton.onClick}>
            {actionButton.label}
          </Button>
        )}
        {request.status === "Completed" &&
          request.schedules[0].rating === null && (
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => {
                setScheduleObject?.(request.schedules[0]);
                onRating?.(request.id);
              }}
            >
              Đánh giá
              <span
                aria-hidden
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
              />
            </Button>
          )}
        {request.status === "Completed" &&
          request.schedules[0].rating !== null && (
            <div className="text-sm text-gray-600 flex items-center gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  className={
                    index <= Math.round(Number(request.schedules[0].rating))
                      ? "h-4 w-4 text-yellow-400 fill-current"
                      : "h-4 w-4 text-gray-300"
                  }
                />
              ))}
              <span className="ml-1 font-medium">
                {request.schedules[0].rating} / 5
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
