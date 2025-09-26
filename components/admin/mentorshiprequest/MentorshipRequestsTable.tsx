import { MentorSearchDialog } from "@/components/mentoring/MentorSearchDialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateSchedule } from "@/hooks/use-schedules";
import { useCancelMentorShipRequest } from "@/hooks/use-mentoring-requests";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { cn, formatTime, isApiSuccess } from "@/lib/utils";
import { MentoringRequest } from "@/types/interfaces";
import { SquareArrowOutUpRight } from "lucide-react";
import { useState } from "react";

interface StatusChipProps {
  status: "Active" | "Pending" | "Cancelled" | "Completed";
}

export function StatusChip({ status }: StatusChipProps) {
  const statusStyles = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

interface MentorshipRequestsTableProps {
  mentoringRequests: ApiResponse<PaginatedData<MentoringRequest>> | undefined;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function MentorshipRequestsTable({
  mentoringRequests,
  isLoading,
  onPageChange,
}: MentorshipRequestsTableProps) {
  const [isMentorSearchOpen, setIsMentorSearchOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const { mutate: createSchedule } = useCreateSchedule();
  const { mutate: cancelMentorship, isPending: isCancelling } =
    useCancelMentorShipRequest();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelRequestId, setCancelRequestId] = useState<number | null>(null);
  const truncate = (text: string | null | undefined, max: number = 50) => {
    const value = text ?? "";
    if (value.length <= max) return value;
    return value.slice(0, max).trimEnd() + "...";
  };

  const handleReview = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsMentorSearchOpen(true);
  };

  const handleSelectMentor = (
    mentorId: number,
    startDate: Date | undefined,
    endDate: Date | undefined,
    content: string
  ) => {
    if (selectedRequestId && startDate && endDate) {
      createSchedule({
        mentorShipId: selectedRequestId,
        mentorId: mentorId,
        content: content || "Mentorship session",
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status: "Active",
        rating: null,
        comment: null,
      });
    }
    setIsMentorSearchOpen(false);
    setSelectedRequestId(null);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !mentoringRequests ||
    !isApiSuccess(mentoringRequests) ||
    !mentoringRequests.data ||
    mentoringRequests.data.items.length === 0
  ) {
    return (
      <div className="text-center py-4">Không tìm thấy yêu cầu mentor</div>
    );
  }

  const {
    items: mentoringRequestItems,
    totalPages,
    page,
  } = mentoringRequests.data;

  return (
    <>
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Alumni</TableHead>
              <TableHead>Tin nhắn</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentoringRequestItems.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.alumniName}</TableCell>
                <TableCell>
                  <button
                    className="text-left w-full hover:underline"
                    onClick={() => {
                      setSelectedMessage(request.requestMessage ?? "");
                      setIsMessageDialogOpen(true);
                    }}
                    title="Xem đầy đủ"
                  >
                    {truncate(request.requestMessage, 50)}
                  </button>
                </TableCell>
                <TableCell>{formatTime(request.createdAt)}</TableCell>
                <TableCell>
                  <StatusChip
                    status={request.status as StatusChipProps["status"]}
                  />
                </TableCell>
                <TableCell className="space-x-2">
                  {request.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReview(request.id)}
                      >
                        <SquareArrowOutUpRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setCancelRequestId(request.id);
                          setIsCancelDialogOpen(true);
                        }}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Đang từ chối..." : "Từ chối"}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <MentorSearchDialog
        isOpen={isMentorSearchOpen}
        onOpenChange={setIsMentorSearchOpen}
        onSelectMentor={handleSelectMentor}
        requestId={selectedRequestId}
      />

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tin nhắn yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-gray-800">
            {selectedMessage}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lý do từ chối yêu cầu</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <textarea
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Nhập lý do..."
              value={cancelMessage}
              onChange={(e) => setCancelMessage(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCancelDialogOpen(false);
                  setCancelMessage("");
                  setCancelRequestId(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                disabled={
                  isCancelling ||
                  !cancelMessage.trim() ||
                  cancelRequestId === null
                }
                onClick={() => {
                  if (cancelRequestId === null || !cancelMessage.trim()) return;
                  cancelMentorship({
                    id: cancelRequestId,
                    message: cancelMessage.trim(),
                  });
                  setIsCancelDialogOpen(false);
                  setCancelMessage("");
                  setCancelRequestId(null);
                }}
              >
                Xác nhận từ chối
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
