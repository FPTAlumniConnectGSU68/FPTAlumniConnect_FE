import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import useEventService from "@/lib/services/event.service";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Event } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { decode } from "entities";

interface RelatedEventProps {
    eventId: number | string;
}

const RelatedEvent: React.FC<RelatedEventProps> = ({ eventId }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    const { GET_RELATED_EVENT } = useEventService()

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await GET_RELATED_EVENT(eventId)
                if (isApiSuccess(res) && res.data) {
                    setEvents(res.data)
                }
            } catch (err) {
                console.error("Failed to fetch related events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [eventId]);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="mt-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">Sự kiện liên quan</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="min-w-[400px] w-[400px] bg-white rounded-xl shadow p-3 flex flex-col relative"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2 flex gap-2">
                            <Badge variant="secondary">
                                {new Date(event.startDate) > new Date()
                                    ? "Sắp diễn ra"
                                    : "Đã diễn ra"}
                            </Badge>
                        </div>

                        {/* Image */}
                        <img
                            src={event.img}
                            alt={event.eventName}
                            className="rounded-lg w-full h-32 object-cover mb-3"
                        />

                        {/* Title */}
                        <h3 className="text-base font-semibold mb-1">{event.eventName}</h3>

                        {/* Description */}
                        <div className="mb-4 line-clamp-2 min-h-[40px] max-h-[90px] overflow-hidden" dangerouslySetInnerHTML={{ __html: decode(event.description) }} />

                        {/* Date & Location */}
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDateToDMY(event.startDate)} • {formatTime(event.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                        </div>

                        {/* CTA */}
                        <button className="mt-auto bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition" onClick={() => router.replace(`/events/${event.eventId.toString()}`)}>
                            Xem chi tiết
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedEvent;