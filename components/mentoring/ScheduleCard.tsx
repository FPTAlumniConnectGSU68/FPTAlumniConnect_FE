import { Schedule } from "@/types/interfaces";

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
    </div>
  );
}
