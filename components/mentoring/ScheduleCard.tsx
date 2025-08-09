import { Schedule } from "@/types/interfaces";
<<<<<<< HEAD
import { Button } from "../ui/button";
import { formatDateToDMY } from "@/lib/utils";
import { CalendarDays, Clock, User, UserCheck } from "lucide-react";

interface ScheduleCardProps {
  schedule: Schedule;
  onComplete: (scheduleId: number) => void;
  isCompleting: boolean;
}

export function ScheduleCard({
  schedule,
  onComplete,
  isCompleting,
}: ScheduleCardProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      Active: {
        color: "bg-green-50 text-green-700 border-green-200",
      },
      Failed: {
        color: "bg-red-50 text-red-700 border-red-200",
      },
      Completed: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      Unknown: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
      },
    };
    return configs[status as keyof typeof configs] || configs.Unknown;
  };

  const statusConfig = getStatusConfig(schedule.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Status Badge - Top Right */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Mentoring Session
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color} flex items-center gap-1`}
        >
          {schedule.status}
        </span>
      </div>

      {/* Participants Section */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <User className="w-4 h-4" />
          <span className="font-medium">Alumni:</span>
          <span>{schedule.alumniName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <UserCheck className="w-4 h-4" />
          <span className="font-medium">Mentor:</span>
          <span>{schedule.mentorName}</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <CalendarDays className="w-4 h-4" />
          <span className="font-medium">Timeline</span>
        </div>
        <div className="flex items-center gap-2 ml-6">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>
            {formatDateToDMY(schedule.startTime)} -{" "}
            {formatDateToDMY(schedule.endTime)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="mb-6">
        <p className="text-gray-600 line-clamp-2">{schedule.content}</p>
      </div>

      {/* Action Button */}
      {schedule.status !== "Completed" && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => onComplete(schedule.scheduleId)}
            disabled={isCompleting}
            className="w-full sm:w-auto bg-white hover:bg-gray-50"
          >
            {isCompleting ? "Completing..." : "Mark as Complete"}
          </Button>
        </div>
      )}
=======

interface ScheduleCardProps {
  schedule: Schedule;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  console.log("schedule", schedule);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between min-h-[220px]">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="font-bold text-lg">{schedule.mentorName}</div>
          <div className="text-gray-600 mt-2">{schedule.content}</div>
          <div className="flex gap-2 mt-2">
            <span className="inline-block text-xs px-2 py-1 rounded font-semibold bg-green-100 text-green-700">
              {schedule.status}
            </span>
          </div>
        </div>
      </div>
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
    </div>
  );
}
