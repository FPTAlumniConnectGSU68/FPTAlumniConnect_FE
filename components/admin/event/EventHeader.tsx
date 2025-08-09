import { Button } from "@/components/ui/button";
import React from "react";

const EventHeader = ({
  openCreateEvent,
}: {
  openCreateEvent: (param: any) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Button onClick={openCreateEvent}>Add Event</Button>
      </div>
    </div>
  );
};

export default EventHeader;
