import EventHeader from "@/components/admin/event/EventHeader";
import EventTable from "@/components/admin/event/EventTable";
import { useEvents } from "@/hooks/use-event";
import { ApiResponse } from "@/lib/apiResponse";
import useEventService from "@/lib/services/event.service";
import React, { useState } from "react";
import { Event, TimelineSuggestion } from "@/types/interfaces";
import CreateEventSheet from "@/components/admin/event/CreateEventSheet";
import TimelineModal from "@/components/admin/event/TimelineModal";

export function EventsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, isLoading } = useEvents({
    page: currentPage,
    size: 5,
    // query: {
    //   search: searchTerm,
    // },
  });

  const { CREATE_EVENT } = useEventService();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
  const [timelineSuggestions, setTimelineSuggestions] = useState<
    TimelineSuggestion[]
  >([]);

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    const res: ApiResponse<
      Event & { timelineSuggestions?: TimelineSuggestion[]; id?: string }
    > = await CREATE_EVENT(eventData);

    if (res.status === "success") {
      alert("Event created successfully!");
      setIsCreateOpen(false);
    } else if (res.status === "partial_success") {
      const eventId = res.data?.id || eventData.eventId;
      const eventInfo = { ...eventData, eventId } as Event;

      setCreatedEvent(eventInfo);
      setTimelineSuggestions(res.data?.timelineSuggestions || []);
      setModalOpen(true);
      setIsCreateOpen(false);
    } else {
      alert(res.message);
    }
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-4">
      <EventHeader openCreateEvent={handleOpenCreate} />
      <EventTable
        events={events}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />

      <CreateEventSheet
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSave={handleCreateEvent}
      />
      {isModalOpen && createdEvent && (
        <TimelineModal
          event={createdEvent}
          suggestions={timelineSuggestions}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
