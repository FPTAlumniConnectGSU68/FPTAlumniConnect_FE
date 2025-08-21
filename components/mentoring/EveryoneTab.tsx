import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useMentorShipRequests } from "@/hooks/use-mentoring-requests";
import { isApiSuccess } from "@/lib/utils";
import { User } from "@/types/interfaces";
import { useState } from "react";
import { Button } from "../ui/button";
import { DateTimePicker } from "../ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { MentoringCard } from "./MentoringCard";
import { useCreateSchedule } from "@/hooks/use-schedules";

interface EveryoneTabProps {
  currentPage: number;
  user: User;
}

interface ValidationErrors {
  content?: string;
  startDate?: string;
  endDate?: string;
}

export function EveryoneTab({ currentPage, user }: EveryoneTabProps) {
  const [isAcceptRequestModalOpen, setIsAcceptRequestModalOpen] =
    useState(false);
  const [tempId, setTempId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { data: mentoringRequests, isLoading } = useMentorShipRequests({
    page: currentPage,
    query: {
      Status: "Pending",
    },
  });

  const {
    mutate: createSchedule,
    isPending,
    isError,
    error,
  } = useCreateSchedule();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!startDate) {
      newErrors.startDate = "Start time is required";
    }

    if (!endDate) {
      newErrors.endDate = "End time is required";
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAcceptRequest = () => {
    if (!validateForm()) {
      return;
    }

    createSchedule(
      {
        mentorShipId: tempId ?? 0,
        mentorId: user.userId,
        content: content.trim(),
        startTime: startDate?.toISOString() ?? "",
        endTime: endDate?.toISOString() ?? "",
        status: "Active",
        rating: null,
        comment: null,
      },
      {
        onSuccess: (response) => {
          if (response.status === "success") {
            setIsAcceptRequestModalOpen(false);
            setTempId(null);
            setStartDate(undefined);
            setEndDate(undefined);
            setContent("");
            setErrors({});
          }
        },
      }
    );
  };

  const handleCancel = () => {
    setIsAcceptRequestModalOpen(false);
    setTempId(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setContent("");
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="py-4 flex justify-center items-center h-[50vh]">
        <LoadingSpinner size="md" text="Loading mentoring requests..." />
      </div>
    );
  }

  if (
    !mentoringRequests ||
    !isApiSuccess(mentoringRequests) ||
    !mentoringRequests.data ||
    mentoringRequests.data.items.length === 0
  ) {
    return <div className="text-center py-4">No mentoring requests found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentoringRequests.data.items.map((request) => (
        <MentoringCard
          key={request.id}
          request={request}
          actionButton={
            user && request.aumniId !== user?.userId && user.isMentor
              ? {
                  label: "Accept the request",
                  onClick: () => {
                    setIsAcceptRequestModalOpen(true);
                    setTempId(request.id);
                  },
                }
              : undefined
          }
        />
      ))}
      <Dialog
        open={isAcceptRequestModalOpen}
        onOpenChange={setIsAcceptRequestModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Request #{tempId}</DialogTitle>
            <DialogDescription>
              Please provide the details for the mentoring session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Enter session content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <DateTimePicker date={startDate} setDate={setStartDate} />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <DateTimePicker date={endDate} setDate={setEndDate} />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
            {isError && (
              <p className="text-sm text-red-500">
                {error?.message || "Failed to accept request"}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleAcceptRequest} disabled={isPending}>
              {isPending ? (
                <LoadingSpinner size="sm" text="Accepting..." />
              ) : (
                "Accept"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
