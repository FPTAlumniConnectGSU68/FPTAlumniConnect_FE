import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ScheduleCard } from "./ScheduleCard";
import { useCompleteSchedule, useSchedules } from "@/hooks/use-schedules";
import { isApiSuccess } from "@/lib/utils";

interface MentorTabProps {
  currentPage: number;
  userId: string;
}

export function MentorTab({ currentPage, userId }: MentorTabProps) {
  const { data: schedules, isLoading } = useSchedules({
    page: currentPage,
    query: {
      MentorId: userId,
    },
  });

  const { mutate: completeSchedule, isPending: isCompleting } =
    useCompleteSchedule();

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center items-center h-[50vh]">
        <LoadingSpinner size="md" text="Loading schedules..." />
      </div>
    );
  }

  if (
    !schedules ||
    !isApiSuccess(schedules) ||
    !schedules.data ||
    schedules.data.items.length === 0
  ) {
    return <div className="text-center py-4">No schedules found</div>;
  }

  const handleComplete = (scheduleId: number) => {
    completeSchedule(scheduleId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.data.items.map((schedule) => (
        <ScheduleCard
          key={schedule.scheduleId}
          schedule={schedule}
          onComplete={handleComplete}
          isCompleting={isCompleting}
        />
      ))}
    </div>
  );
}
