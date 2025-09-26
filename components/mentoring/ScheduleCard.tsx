import { Schedule } from "@/types/interfaces";
import { Button } from "../ui/button";
import { formatDateToDMY } from "@/lib/utils";
import { CalendarDays, Clock, User, UserCheck } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

interface ScheduleCardProps {
  schedule: Schedule;
  onComplete: (scheduleId: number) => void;
  isCompleting: boolean;
  onFail?: (scheduleId: number, message: string) => void;
  isFailing?: boolean;
}

export function ScheduleCard({
  schedule,
  onComplete,
  isCompleting,
  onFail,
  isFailing,
}: ScheduleCardProps) {
  const [isFailDialogOpen, setIsFailDialogOpen] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      Active: "Đang diễn ra",
      Failed: "Thất bại",
      Completed: "Hoàn tất",
      Unknown: "Không xác định",
    };
    return map[status] ?? map.Unknown;
  };
  const getStatusConfig = (status: string) => {
    const configs = {
      Active: {
        chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "text-emerald-700",
        border: "border-emerald-200",
        hover: "hover:bg-emerald-50",
        gradientFrom: "from-emerald-500",
        gradientTo: "to-teal-500",
        panelFrom: "from-emerald-50",
        panelTo: "to-teal-50",
      },
      Failed: {
        chip: "bg-rose-50 text-rose-700 border-rose-200",
        text: "text-rose-700",
        border: "border-rose-200",
        hover: "hover:bg-rose-50",
        gradientFrom: "from-rose-500",
        gradientTo: "to-red-500",
        panelFrom: "from-rose-50",
        panelTo: "to-red-50",
      },
      Completed: {
        chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
        text: "text-indigo-700",
        border: "border-indigo-200",
        hover: "hover:bg-indigo-50",
        gradientFrom: "from-indigo-500",
        gradientTo: "to-blue-500",
        panelFrom: "from-indigo-50",
        panelTo: "to-blue-50",
      },
      Unknown: {
        chip: "bg-slate-50 text-slate-700 border-slate-200",
        text: "text-slate-700",
        border: "border-slate-200",
        hover: "hover:bg-slate-50",
        gradientFrom: "from-slate-400",
        gradientTo: "to-slate-500",
        panelFrom: "from-slate-50",
        panelTo: "to-slate-100",
      },
    } as const;
    return (
      configs[(status as keyof typeof configs) ?? "Unknown"] || configs.Unknown
    );
  };

  const statusConfig = getStatusConfig(schedule.status);

  const formatDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const ms = endDate.getTime() - startDate.getTime();
    if (Number.isNaN(ms) || ms <= 0) return "";
    const hours = Math.round(ms / (1000 * 60 * 60));
    if (hours >= 24) {
      const days = Math.round(hours / 24);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  };

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-200">
      {/* Decorative Gradient Blob */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-10 blur-3xl bg-gradient-to-br ${statusConfig.gradientFrom} ${statusConfig.gradientTo}`}
      />

      {/* Header with Gradient */}
      <div
        className={`mb-5 rounded-lg px-4 py-3 text-white bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo} flex items-center justify-between`}
      >
        <h3 className="text-base sm:text-lg font-semibold">Phiên cố vấn</h3>
        <span className="px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-white border border-white/30">
          {getStatusLabel(schedule.status)}
        </span>
      </div>

      {/* Participants Section */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-gray-800">
          <span
            className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/80 border ${statusConfig.border}`}
          >
            <User className={`w-3.5 h-3.5 ${statusConfig.text}`} />
          </span>
          <span className="font-medium text-gray-900">Cựu sinh viên:</span>
          <span
            className={`px-2 py-0.5 rounded-md bg-white border ${statusConfig.border} ${statusConfig.text}`}
          >
            {schedule.alumniName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-gray-800">
          <span
            className={`inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/80 border ${statusConfig.border}`}
          >
            <UserCheck className={`w-3.5 h-3.5 ${statusConfig.text}`} />
          </span>
          <span className="font-medium text-gray-900">Mentor:</span>
          <span
            className={`px-2 py-0.5 rounded-md bg-white border ${statusConfig.border} ${statusConfig.text}`}
          >
            {schedule.mentorName}
          </span>
        </div>
      </div>

      {/* Timeline Section */}
      <div
        className={`rounded-lg p-4 mb-6 border ${statusConfig.border} bg-gradient-to-br ${statusConfig.panelFrom} ${statusConfig.panelTo}`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-800">
            <Clock className={`w-4 h-4 ${statusConfig.text}`} />
            <span className="font-medium text-gray-900">
              {formatDateToDMY(schedule.startTime)} -{" "}
              {formatDateToDMY(schedule.endTime)}
            </span>
          </div>
          {formatDuration(schedule.startTime, schedule.endTime) && (
            <span className="inline-flex justify-center items-center rounded-full bg-white/80 border border-white/60 px-2 py-0.5 text-xs text-gray-800">
              {formatDuration(schedule.startTime, schedule.endTime)}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="mb-6">
        <p className="text-gray-600 line-clamp-2">{schedule.content}</p>
      </div>

      {/* Actions */}
      {schedule.status === "Active" && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onComplete(schedule.scheduleId)}
            disabled={isCompleting || isFailing}
            className={`w-full sm:w-auto bg-white ${statusConfig.hover} border ${statusConfig.border} ${statusConfig.text}`}
          >
            {isCompleting ? "Đang xử lý..." : "Đánh dấu hoàn tất"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFailDialogOpen(true)}
            disabled={isCompleting || isFailing}
            className={`w-full sm:w-auto bg-white ${statusConfig.hover} border ${statusConfig.border} ${statusConfig.text}`}
          >
            {isFailing ? "Đang xử lý..." : "Thất bại"}
          </Button>

          <Dialog open={isFailDialogOpen} onOpenChange={setIsFailDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận đánh dấu thất bại</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Vui lòng nhập lý do thất bại cho buổi học này.
                </p>
                <Textarea
                  placeholder="Nhập lý do..."
                  value={failMessage}
                  onChange={(e) => setFailMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsFailDialogOpen(false);
                    setFailMessage("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    if (!onFail) return;
                    const message = failMessage.trim();
                    if (!message) return;
                    onFail(schedule.scheduleId, message);
                    setIsFailDialogOpen(false);
                    setFailMessage("");
                  }}
                  disabled={isFailing || failMessage.trim() === ""}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Xác nhận thất bại
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {schedule.status === "Completed" && (
        <div className="mt-2 text-sm text-gray-600 flex items-center justify-end">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 ${statusConfig.chip} border`}
          >
            Đã hoàn tất
          </span>
        </div>
      )}

      {/* For Failed: show nothing */}
    </div>
  );
}
