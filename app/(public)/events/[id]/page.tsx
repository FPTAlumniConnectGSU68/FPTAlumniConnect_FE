"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import useEventService from "@/lib/services/event.service";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Event, EventRating, EventTimeline } from "@/types/interfaces";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { user } = useAuth();
  const { GET_EVENT_DETAIL_WITH_TIMELINES, JOIN_EVENT, GET_EVENT_RATING } =
    useEventService();
  const router = useRouter();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const [event, setEvent] = useState<Event>();
  const [eventRating, setEventRating] = useState<EventRating[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const response = await GET_EVENT_DETAIL_WITH_TIMELINES(id);

        if (isApiSuccess(response) && response.data) {
          setEvent(response.data as Event);
          //   setEvent(response.data); // now TS knows it's Event
        } else {
          setError("Unexpected error while fetching event");
        }
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRating = async () => {
      if (!id) return;

      try {
        const response = await GET_EVENT_RATING(id);

        if (isApiSuccess(response) && response.data) {
          setEventRating(response.data.items);
        }
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    if (user) {
      try {
        const res = await JOIN_EVENT(id, user.userId);
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
        setJoining(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-3">
        <p className="text-red-500 text-center font-medium">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 shadow-md hover:opacity-90 transition"
        >
          Back
        </button>
      </div>
    );
  }

  if (!event) {
    return <p className="p-6 text-center text-gray-500">Event not found</p>;
  }

  return (
    <div className="p-6">
      {/* Back button */}
      <button className="text-blue-600 mb-4" onClick={() => router.back()}>
        &larr; Back
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {event.img ? (
              <img
                src={event.img}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No image</span>
            )}
          </div>

          {/* Title / Location / Start Date */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{event.eventName}</h2>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="flex gap-2">
                <p>Start Time:</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateToDMY(event.startDate)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTime(event.startDate)}
                </div>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  if (
                    !requireAuth({
                      title: "View joined events.",
                      description: "Sign in to view event you joined",
                      actionText: "events",
                    })
                  ) {
                    return;
                  } else {
                    handleJoin();
                  }
                }}
                disabled={joining}
                className=" bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {joining ? "Joining..." : "Join Event"}
              </Button>
            </div>
          </div>

          {/* Ratings */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Ratings</h3>
            {eventRating && eventRating.length > 0 ? (
              <ul className="space-y-4">
                {eventRating.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start space-x-3 border-b pb-3 last:border-none"
                  >
                    <img
                      src={r.avatar}
                      alt={r.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{r.userName}</p>
                        {r.rating !== null ? (
                          <span className="text-yellow-500">⭐ {r.rating}</span>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            No rating
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{r.content}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Descriptions */}
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-h-60">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-gray-700">{event.description}</p>
          </div>

          {/* Timeline */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Timeline</h3>
            {event.eventTimeLines && event.eventTimeLines.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {event.eventTimeLines.map((t: EventTimeline) => (
                  <li key={t.eventTimeLineId}>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatTime(t.startTime)} - {formatTime(t.endTime)}
                      </div>

                      <p>{t.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No timeline available</p>
            )}
          </div>
        </div>
      </div>
      <AuthGuard />
    </div>
  );
}
