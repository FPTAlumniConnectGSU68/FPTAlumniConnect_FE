"use client";

import { useEvents } from "@/hooks/use-event";
import React, { useState } from "react";
import EventHeader from "./EventHeader";
import EventTable from "./EventTable";

const EventView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: events, isLoading } = useEvents({ page: currentPage });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex flex-col gap-4">
      <EventHeader />
      <EventTable
        events={events}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default EventView;