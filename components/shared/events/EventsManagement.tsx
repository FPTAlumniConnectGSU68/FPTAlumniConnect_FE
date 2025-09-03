import EventHeader from "@/components/admin/event/EventHeader";
import EventTable from "@/components/admin/event/EventTable";
import { useEvents, useUpdateEvent } from "@/hooks/use-event";
import React, { useEffect, useState } from "react";
import EventFormSheet from "@/components/admin/event/EventFormSheet";
import { set } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function EventsManagement() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<number | string | null>(
    null
  );
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: events, isLoading } = useEvents({
    page: currentPage,
    size: 4,
    query: {
      EventName: search,
      ...(user ? { OrganizerId: user.userId.toString() } : {}),
    },
  });

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setIsOpenDetail(true);
  };

  const handleSelectedEvent = (eventId: number | string | null) => {
    setSelectedEvent(eventId);
    setIsOpenDetail(true);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <EventHeader openCreateEvent={handleOpenCreate} />
      <div className="relative max-w-md">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchInput && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

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
