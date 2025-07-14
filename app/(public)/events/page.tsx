"use client";
import { useEvents } from "@/hooks/use-event";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { Users, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

const eventsData = [
  {
    id: 1,
    name: "Tech Talk",
    avatar: "/avatar1.png",
    date: "2024-07-01",
    location: "Hà Nội",
    type: "Seminar",
    description: "Chia sẻ về công nghệ mới",
  },
  {
    id: 2,
    name: "Career Fair",
    avatar: "/avatar2.png",
    date: "2024-07-10",
    location: "Hồ Chí Minh",
    type: "Job Fair",
    description: "Ngày hội việc làm cho sinh viên",
  },
  {
    id: 3,
    name: "Workshop",
    avatar: "/avatar3.png",
    date: "2024-07-15",
    location: "Đà Nẵng",
    type: "Workshop",
    description: "Workshop UI/UX thực chiến",
  },
];

const types = ["All Types", "Seminar", "Job Fair", "Workshop"];
const locations = ["All Locations", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");

  const { data: eventsRes, isLoading } = useEvents({ size: 100 });

  const eventItems = useMemo(() => {
    if (!eventsRes || !isApiSuccess(eventsRes)) return [];

    return eventsRes.data?.items ?? [];
  }, [eventsRes]);

  const filtered = useMemo(() => {
    return eventItems.filter((item) => {
      const matchSearch = item.eventName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchLocation =
        location === "All Locations" || item.location === location;
      return matchSearch && matchLocation;
    });
  }, [search, location, eventItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events Directory</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          {locations.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white hover:border-orange-300 p-6 flex flex-col justify-between min-h-[240px]">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={item.img || "/default-event.png"}
                alt={item.eventName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.eventName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDateToDMY(item.startDate)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(item.startDate)}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {item.location}
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={() => {}}
            >
              Register Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
