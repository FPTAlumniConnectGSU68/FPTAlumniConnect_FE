"use client";
import { useEvents } from "@/hooks/use-event";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Calendar, MapPin, Clock, Star } from "lucide-react";
import { useMajorCodes } from "@/hooks/use-major-codes";
import { useAuth } from "@/contexts/auth-context";
import Pagination from "@/components/ui/pagination";
import CustomTooltip from "@/components/tooltip/CustomToolTip";
import { useRouter, useSearchParams } from "next/navigation";
import useEventService from "@/lib/services/event.service";
import { useToast } from "@/components/ui/toast";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { EventCardSkeleton } from "@/components/event/EventCardSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AutocompleteDropdown from "@/components/autocomplete/AutocompleteSelect";
import PopularEvent from "@/components/event/PoppularEvent";

const locations = ["All Locations", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const eventStatusList = [{ value: "", label: "Tất cả" }, { value: "Active", label: 'Đang mở' }, { value: 'Completed', label: "Đã hoàn thành" }]

function EventsContent() {
  const { user } = useAuth();
  const { PUT_RATING } = useEventService();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [eventStatus, setEventStatus] = useState(eventStatusList[0].value)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [majorSearch, setMajorSearch] = useState("");
  const { data: majorsRes } = useMajorCodes({ searchString: majorSearch });
  const [major, setMajor] = useState<string | null>("All Majors");

  const [selectedEventId, setSelectedEventId] = useState<
    number | string | null
  >(null);
  const [showJoinedEvents, setShowJoinedEvents] = useState(false);

  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest"
  );
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  useEffect(() => {
    if (selectedEventId && user)
      router.push(`/events/${selectedEventId.toString()}`);
  }, [selectedEventId]);

  useEffect(() => {
    const openModal = searchParams.get("openModal") === "true";
    const id = searchParams.get("eventId");
    if (openModal && id) {
      setSelectedEventId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setLocation(locationInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, locationInput]);

  const queryParams: Record<string, string> = {};
  if (search) queryParams.EventName = search;
  if (location) queryParams.Location = location;
  if (major && major !== "All Majors") queryParams.MajorId = major;
  if (showJoinedEvents && user?.userId) {
    queryParams.UserId = user.userId.toString();
  }
  if (eventStatus && eventStatus !== "") {
    queryParams.Status = eventStatus
  }

  const { data: eventsRes, isLoading } = useEvents({
    page: currentPage,
    size: pageSize,
    query: queryParams,
  });

  const eventData =
    eventsRes && isApiSuccess(eventsRes) ? eventsRes.data : null;
  const eventItems = eventData?.items ?? [];
  const totalPages = eventData?.totalPages ?? 0;

  const itemsToRender = useMemo(() => {
    const items = [...eventItems];
    if (sortBy === "newest") {
      items.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sortBy === "oldest") {
      items.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    } else if (sortBy === "rating") {
      items.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    }
    return items;
  }, [eventItems, sortBy]);

  const hasActiveFilters =
    Boolean(searchInput) ||
    Boolean(locationInput) ||
    (major && major !== "All Majors") ||
    showJoinedEvents ||
    (eventStatus !== eventStatusList[0].value)

  const clearFilters = () => {
    setSearchInput("");
    setLocationInput("");
    setMajor("All Majors");
    setShowJoinedEvents(false);
    setCurrentPage(1);
    setEventStatus(eventStatusList[0].value)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Danh sách sự kiện</h1>
          <p className="text-sm text-gray-500 mt-1">
            Khám phá các sự kiện, hội thảo, và hội họp của cộng đồng sinh viên
            FPT University.
          </p>
        </div>
        <div className="w-full md:w-56">
          <label className="block text-sm text-gray-500 mb-1">
            Sắp xếp theo
          </label>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search & filter */}
      <Suspense
        fallback={
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            Loading search...
          </div>
        }
      >
        <div className="bg-white rounded-xl shadow p-6 mb-4 flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sự kiện..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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

          <div className="relative flex-2">
            <input
              type="text"
              placeholder="Tìm kiếm theo địa điểm..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
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

          <div className="w-full md:w-64">
            <AutocompleteDropdown
              value={major}
              onChange={(val) => {
                setMajor(val);
              }}
              onSearch={setMajorSearch}
              options={[
                { value: "All Majors", label: "Tất cả chuyên ngành" },
                ...majors.map((m) => ({
                  value: String(m.majorId),
                  label: m.majorName,
                })),
              ]}
              placeholder="Tìm kiếm theo chuyên ngành..."
              isLoading={isLoading}
            />
          </div>
          {/* Status Dropdown */}
          <div className="w-full md:w-48 flex items-center gap-2">
            <label htmlFor="status" className="whitespace-nowrap">
              Trạng thái:
            </label>
            <select
              id="status"
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
              className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {eventStatusList.map((item) => (
                <option value={item.value}>{item.label}</option>
              ))}

            </select>
          </div>
          {/* My Joined Events Button */}
          <Button
            variant={showJoinedEvents ? "default" : "outline"}
            onClick={() => {
              if (
                !requireAuth({
                  title: "Xem sự kiện đã tham gia.",
                  description: "Đăng nhập để xem sự kiện đã tham gia",
                  actionText: "sự kiện",
                })
              ) {
                return;
              } else {
                setShowJoinedEvents((prev) => !prev);
              }
            }}
            className="whitespace-nowrap"
          >
            {showJoinedEvents
              ? "Hiển thị tất cả sự kiện"
              : "Sự kiện đã tham gia"}
          </Button>
        </div>
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {searchInput && (
              <Badge variant="secondary">Tìm kiếm: {searchInput}</Badge>
            )}
            {locationInput && (
              <Badge variant="secondary">Địa điểm: {locationInput}</Badge>
            )}
            {major && major !== "All Majors" && (
              <Badge variant="secondary">
                Chuyên ngành:{" "}
                {majors.find((m) => String(m.majorId) === major)?.majorName ??
                  major}
              </Badge>
            )}
            {eventStatus && eventStatus !== eventStatusList[0].value && (
              <Badge variant="secondary">
                Trạng thái:{" "}
                {eventStatusList.find((s) => String(s.value) === eventStatus)?.label ??
                  eventStatus}
              </Badge>
            )}
            {/* {showJoinedEvents && <Badge>Đã tham gia</Badge>} */}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </Suspense>

      {/* Events grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: pageSize }).map((_, idx) => (
            <EventCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {!isLoading && eventItems.length === 0 && (
        <div className="bg-white rounded-xl border text-center py-16 px-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold">
            Không có sự kiện nào phù hợp với bộ lọc của bạn
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Hãy điều chỉnh tìm kiếm hoặc xóa tất cả bộ lọc để xem thêm kết quả.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Xóa bộ lọc
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsToRender.map((item) => (
          <Card
            key={item.eventId}
            className="border bg-white flex flex-col overflow-hidden"
          >
            {/* Image header */}
            <div className="relative w-full h-40">
              <Image
                src={item.img || "/default-event.png"}
                alt={item.eventName}
                width={500}
                height={160}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge variant="secondary">
                  {new Date(item.startDate) > new Date()
                    ? "Sắp diễn ra"
                    : "Đã diễn ra"}
                </Badge>
              </div>
              {typeof item.averageRating !== "undefined" &&
                item.averageRating !== null && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    {item.averageRating}
                  </div>
                )}
            </div>
            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">{item.eventName}</h3>
                <h4 className="font-normal mb-2">Diễn giả: {item.speaker}</h4>
                <div className="mb-4 line-clamp-2 min-h-[40px] max-h-[90px] overflow-hidden" dangerouslySetInnerHTML={{ __html: item.description }} />
              </div>
              <div>
                {showJoinedEvents && (
                  <div className="flex items-center text-sm gap-2">
                    <span className="text-gray-600">Đánh giá trung bình:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-1 text-gray-900">
                        {item.averageRating}
                      </span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDateToDMY(item.startDate)}
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(item.startDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {item.location}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedEventId(item.eventId);
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* {user && (
        <EventDialog
          eventId={selectedEventId}
          setSelected={setSelectedEventId}
          userId={user.userId}
        />
      )} */}
      <AuthGuard />
      <PopularEvent />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">Loading events...</div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
