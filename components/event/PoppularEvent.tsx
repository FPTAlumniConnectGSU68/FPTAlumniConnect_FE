import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import useEventService from "@/lib/services/event.service";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Event, PopularEventItem } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";


const PopularEvent = () => {
    const [events, setEvents] = useState<PopularEventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()
    const { GET_POPULAR_EVENT } = useEventService()

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await GET_POPULAR_EVENT()
                if (isApiSuccess(res) && res.data) {
                    setEvents(res.data)
                }
            } catch (err) {
                console.error("Failed to fetch popular events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Sự kiện nổi bật</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="bg-white rounded-xl shadow p-4 hover:shadow-md transition cursor-pointer"
                        onClick={() => router.push(`/events/${event.eventId}`)}
                    >
                        <h3 className="text-base font-semibold mb-2">
                            {event.eventName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            👥 {event.participantCount} người tham gia
                        </p>
                        {/* <p className="text-sm text-gray-600">
                            ⭐ Điểm nổi bật: {event.popularityScore}
                        </p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularEvent;