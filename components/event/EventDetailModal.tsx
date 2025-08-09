"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { isApiSuccess, formatDateToDMY, formatTime } from "@/lib/utils";
import { Event } from "@/types/interfaces";
import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import useEventService from "@/lib/services/event.service";
<<<<<<< HEAD
import { toast } from "sonner";
=======
import { useToast } from "../ui/toast";
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df

interface EventDialogProps {
  eventId: number | string | null;
  setSelected: (id: number | null) => void;
  userId: number;
}

const EventDialog = ({ eventId, setSelected, userId }: EventDialogProps) => {
<<<<<<< HEAD
=======
  const toast = useToast();
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
  const { GET_EVENT_DETAIL, JOIN_EVENT } = useEventService();
  const [data, setData] = useState<Event | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    setIsOpen(!!eventId);
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    const res = await GET_EVENT_DETAIL(eventId!);
    if (isApiSuccess(res)) {
      setData(res.data!);
    }
  };

  const handleJoin = async () => {
    if (!eventId) return;
<<<<<<< HEAD

    setJoining(true);
    try {
      const res = await JOIN_EVENT(eventId, userId);

      if (isApiSuccess(res)) {
        toast.success("You have successfully joined the event!");
      } else {
        const errorMessage =
          (res as any)?.message ||
          (res as any)?.error ||
          "Failed to join the event. Please try again.";
        toast.error(errorMessage);
      }
    } catch (err: any) {
      toast.error(
        err?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsOpen(false);
      setSelected(null);
      setJoining(false);
    }
=======
    setJoining(true);
    const res = await JOIN_EVENT(eventId, userId);
    if (isApiSuccess(res)) {
      toast.success("You have successfully joined the event!");
    } else {
      toast.error("Failed to join the event. Please try again.");
    }
    setIsOpen(false);
    setSelected(null);
    setJoining(false);
>>>>>>> a9ec0bae87494269df48cd121356889e5e42d8df
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        setSelected(null);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogTitle>Event Details</DialogTitle>
        {data ? (
          <div className="space-y-6">
            <Image
              src={data.img || "/default-event.png"}
              alt={data.eventName}
              width={800}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{data.eventName}</h2>
              <p className="text-gray-700">{data.description}</p>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateToDMY(data.startDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTime(data.startDate)}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {data.location}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelected(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleJoin}
                disabled={joining}
                className=" bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {joining ? "Joining..." : "Join Event"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
