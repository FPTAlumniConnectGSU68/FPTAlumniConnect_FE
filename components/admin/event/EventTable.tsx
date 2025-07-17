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
import React, { useState } from "react";
import EditEventSheet from "./EditEventSheet";
import { useUpdateEvent } from "@/hooks/use-event";
import { useToast } from "@/components/ui/toast";

interface EventTableProps {
  events: ApiResponse<PaginatedData<Event>> | undefined;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const EventTable = ({
  events,
  isLoading,
  currentPage,
  onPageChange,
}: EventTableProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { mutate: updateEvent } = useUpdateEvent();
  const toast = useToast();
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleSave = async (eventData: Partial<Event>) => {
    if (!selectedEvent) return;

    try {
      await updateEvent({
        eventId: selectedEvent.eventId.toString(),
        eventData,
      });
      toast.success("Event updated successfully");
      setSelectedEvent(null);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (
    !events ||
    !isApiSuccess(events) ||
    !events.data ||
    events.data.items.length === 0
  ) {
    return <div className="text-center py-4">No events found</div>;
  }

  const { items: eventItems, totalPages } = events.data;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table className="w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventItems.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell>
                  <Image
                    src={event.img}
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
                  <Button onClick={() => handleEditClick(event)}>Edit</Button>
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

      {selectedEvent && (
        <EditEventSheet
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EventTable;
