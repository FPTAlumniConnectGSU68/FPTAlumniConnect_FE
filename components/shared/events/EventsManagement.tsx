import EventHeader from "@/components/admin/event/EventHeader";
import EventTable from "@/components/admin/event/EventTable";
import { useEvents, useUpdateEvent } from "@/hooks/use-event";
import React, { useState } from "react";
import EventFormSheet from "@/components/admin/event/EventFormSheet";
import { set } from "date-fns";
import { toast } from "sonner";

export function EventsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<number | string | null>(
    null
  );
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const { data: events, isLoading } = useEvents({
    page: currentPage,
    size: 4,
    // query: {
    //   search: searchTerm,
    // },
  });

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setIsOpenDetail(true);
  };

  const handleSelectedEvent = (eventId: number | string | null) => {
    setSelectedEvent(eventId);
    setIsOpenDetail(true);
  };

  return (
    <div className="space-y-4">
      <EventHeader openCreateEvent={handleOpenCreate} />
      <EventTable
        events={events}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        setSelectedEvent={handleSelectedEvent}
      />

      <EventFormSheet
        eventId={selectedEvent}
        isOpen={isOpenDetail}
        onOpenChange={setIsOpenDetail}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
}
