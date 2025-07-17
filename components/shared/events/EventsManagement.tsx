import EventHeader from "@/components/admin/event/EventHeader";
import EventTable from "@/components/admin/event/EventTable";
import { useEvents } from "@/hooks/use-event";
import { useState } from "react";

export function EventsManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  const { data: events, isLoading } = useEvents({
    page: currentPage,
    size: 5,
    // query: {
    //   search: searchTerm,
    // },
  });

  return (
    <div className="space-y-4">
      <EventHeader />
      <EventTable
        events={events}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}
