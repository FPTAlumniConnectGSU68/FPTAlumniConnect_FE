import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiResponse, PaginatedData } from "@/lib/apiResponse";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Event } from "@/types/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface EventTableProps {
  events: ApiResponse<PaginatedData<Event>> | undefined;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  setSelectedEvent: (eventId: number | string | null) => void;
}

const EventTable = ({
  events,
  isLoading,
  currentPage,
  onPageChange,
  setSelectedEvent,
}: EventTableProps) => {
  const handleEditClick = (eventId: number | string) => {
    setSelectedEvent(eventId);
  };

  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !events ||
    !isApiSuccess(events) ||
    !events.data ||
    events.data.items.length === 0
  ) {
    return <div className="text-center py-4">Không tìm thấy sự kiện</div>;
  }

  const { items: eventItems, totalPages } = events.data;
  const handleViewDetail = (eventId: number | string) => {
    router.push(`/events/${eventId.toString()}?isManage=true`);
  };
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Thời gian bắt đầu</TableHead>
              <TableHead>Thời gian kết thúc</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventItems.map((event) => (
              <TableRow
                key={event.eventId}
                onClick={() => handleViewDetail(event.eventId)}
              >
                <TableCell>
                  <Image
                    src={event?.img || "/images/eventplaceholder.png"}
                    alt={event.eventName}
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell>{event.eventName}</TableCell>
                <TableCell>
                  {formatDateToDMY(event.startDate) +
                    " " +
                    formatTime(event.startDate)}
                </TableCell>
                <TableCell>
                  {formatDateToDMY(event.endDate) +
                    " " +
                    formatTime(event.endDate)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(event.eventId);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EventTable;
