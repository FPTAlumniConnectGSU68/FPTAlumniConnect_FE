import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  useCreateMentorShipRequest,
  useMentorShipAlumniRequest,
} from "@/hooks/use-mentoring-requests";
import { useRateMentor } from "@/hooks/use-schedules";
import { isApiSuccess } from "@/lib/utils";
import { MentoringRequest, Schedule } from "@/types/interfaces";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { MentoringCard } from "./MentoringCard";

interface MyRequestsTabProps {
  userId: number;
}

export function MyRequestsTab({ userId }: MyRequestsTabProps) {
  const router = useRouter();
  const { data: alumniRequest, isLoading } = useMentorShipAlumniRequest({
    userId,
  });
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedRatingRequestId, setSelectedRatingRequestId] = useState<
    number | null
  >(null);
  const [scheduleObject, setScheduleObject] = useState<Schedule | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const { mutate: createMentorshipRequest, isPending } =
    useCreateMentorShipRequest();
  if (isLoading) {
    return (
      <div className="py-4 flex justify-center items-center h-[50vh]">
        <LoadingSpinner size="md" text="Đang tải yêu cầu mentoring..." />
      </div>
    );
  }

  if (!alumniRequest || !isApiSuccess(alumniRequest) || !alumniRequest.data) {
    return <div className="text-center py-4">Không có yêu cầu mentoring</div>;
  }

  const handleRating = (requestId: number) => {
    setSelectedRatingRequestId(requestId);
    setIsRatingModalOpen(true);
  };

  const handleCreateRequest = () => {
    setIsOpen(true);
    setIsCreate(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && isCreate) {
      setIsCreate(false);
      setRequestMessage("");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleCreateRequest}>
          Tạo yêu cầu
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumniRequest.data.map((request: MentoringRequest) => (
          <MentoringCard
            key={request.id}
            request={request}
            onRating={handleRating}
            setScheduleObject={setScheduleObject}
            // actionButton={{
            //   label: "Send Message",
            //   onClick: () => {
            //     // Handle send message
            //     console.log("Send message", request.id);
            //   },
            // }}
          />
        ))}
      </div>
      <MentoringRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        requestId={selectedRatingRequestId}
        scheduleObject={scheduleObject}
      />
      <Dialog open={isOpen || isCreate} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] min-h-[30vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu cố vấn</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <Textarea
              placeholder="Nội dung yêu cầu"
              className="w-full"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              disabled={isPending}
              onClick={() =>
                createMentorshipRequest(
                  {
                    aumniId: userId,
                    requestMessage: requestMessage,
                    type: null,
                    status: "Pending",
                  },
                  {
                    onSuccess: () => {
                      setIsOpen(false);
                      setIsCreate(false);
                      setRequestMessage("");
                    },
                  }
                )
              }
            >
              {isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogDescription>
          <DialogFooter>
            <DialogDescription className="text-sm text-gray-500 text-center">
              Yêu cầu này sẽ được xem xét bởi các mentor.
            </DialogDescription>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const MentoringRatingModal = ({
  isOpen,
  onClose,
  requestId,
  scheduleObject,
}: {
  isOpen: boolean;
  onClose: () => void;
  requestId: number | null;
  scheduleObject: Schedule | null;
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const current = hoverRating || rating;
  const { mutate: rateMentor } = useRateMentor();
  const handleSubmit = () => {
    rateMentor(
      {
        scheduleId: scheduleObject?.scheduleId ?? 0,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );

    onClose();
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Đánh giá mentor: {scheduleObject?.mentorName}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Textarea
            placeholder="Nhập nhận xét của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const isFilled = current >= value;
              return (
                <button
                  key={value}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      isFilled ? "text-yellow-400" : "text-muted-foreground"
                    }`}
                    fill={isFilled ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>
          <div className="text-sm text-muted-foreground">{current}/5</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
