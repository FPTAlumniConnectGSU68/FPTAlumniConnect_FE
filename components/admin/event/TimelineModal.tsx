import { Event, TimelineSuggestion } from "@/types/interfaces";
import TimelineSuggestionForm from "./TimeLineSuggestion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDateToDMY, formatTime } from "@/lib/utils";

interface TimelineModalProps {
  event: Event;
  suggestions: TimelineSuggestion[];
  onClose: () => void;
}

export default function TimelineModal({
  event,
  suggestions,
  onClose,
}: TimelineModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">
            Add Timelines for {event.eventName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel – Event Info */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <h3 className="font-bold text-xl mb-4 text-gray-800 sticky top-0 bg-gray-50 z-10">
              Event Details
            </h3>

            <Card
              key={event.eventId}
              className="border border-gray-300 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Image header */}
              <div className="w-full h-44 overflow-hidden rounded-t-lg">
                <Image
                  src={event.img || "/default-event.png"}
                  alt={event.eventName}
                  width={500}
                  height={176}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold text-2xl mb-3 text-gray-900">
                  {event.eventName}
                </h3>

                <p className="text-sm text-gray-600 mb-6 line-clamp-3 min-h-[56px]">
                  {event.description}
                </p>

                <div className="text-sm text-gray-700 space-y-4">
                  {/* Date and Time */}
                  <div className="flex items-center space-x-6">
                    {/* Start */}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-5 w-5" />
                      <span>{formatDateToDMY(event.startDate)}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <Clock className="h-5 w-5 " />
                      <span>{formatTime(event.startDate)}</span>
                    </div>

                    <span className="text-gray-400 font-semibold">—</span>

                    {/* End */}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-5 w-5 " />
                      <span>{formatDateToDMY(event.endDate)}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <Clock className="h-5 w-5 " />
                      <span>{formatTime(event.endDate)}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel – Timeline Form */}
          <div className="w-1/2 overflow-y-auto">
            <TimelineSuggestionForm
              eventId={event.eventId}
              initialTimelines={suggestions}
              onSuccess={onClose}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
