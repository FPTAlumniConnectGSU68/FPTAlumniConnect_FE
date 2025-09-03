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
        <h1 className="text-2xl font-bold">Quản lý sự kiện</h1>
        <Button
          onClick={openCreateEvent}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Thêm sự kiện
        </Button>
      </div>
    </div>
  );
};

export default EventHeader;
