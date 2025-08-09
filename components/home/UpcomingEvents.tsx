import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDateToDMY, formatTime } from "@/lib/utils";

interface UpcomingEventsProp {
  upcomingEvents: any[];
  handleClick: (e: any) => any;
}
const UpcomingEvents = ({
  upcomingEvents,
  handleClick,
}: UpcomingEventsProp) => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <Button
          variant="outline"
          className="border-orange-200 text-orange-700 hover:bg-orange-50"
          onClick={() => router.push("/events")}
        >
          Create Event
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {upcomingEvents.map((event, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-orange-300"
          >
            <CardContent className="pt-6 ">
              <div className="flex items-start justify-between mb-4">
                {/* <Badge
                  variant="outline"
                  className="mb-2 border-orange-200 text-orange-700"
                >
                  {event.type}
                </Badge> */}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">
                {event.eventName}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateToDMY(event.startDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTime(event.startDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {/* <Users className="h-4 w-4 mr-2" />
                  {event.attendees} attending */}
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                onClick={() => handleClick(event.eventId)}
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
