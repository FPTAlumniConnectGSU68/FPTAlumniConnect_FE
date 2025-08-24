"use client";
import { useEvents } from "@/hooks/use-event";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
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
import AutocompleteDropdown from "@/components/autocomplete/AutocompleteSelect";

const locations = ["All Locations", "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [majorSearch, setMajorSearch] = useState("");
  const { data: majorsRes } = useMajorCodes({ searchString: majorSearch });
  const [major, setMajor] = useState<string | null>("All Majors");

  const [selectedEventId, setSelectedEventId] = useState<
    number | string | null
  >(null);
  const [showJoinedEvents, setShowJoinedEvents] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [ratingContents, setRatingContents] = useState<Record<number, string>>(
    {}
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

  const { data: eventsRes, isLoading } = useEvents({
    page: currentPage,
    size: pageSize,
    query: queryParams,
  });

  const eventData =
    eventsRes && isApiSuccess(eventsRes) ? eventsRes.data : null;
  const eventItems = eventData?.items ?? [];
  const totalPages = eventData?.totalPages ?? 0;

  const handleStarSelect = (eventId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [eventId]: rating }));
  };

  const handleCommitRating = async (
    eventId: number,
    userJoinEventId: number | null | undefined
  ) => {
    const rating = ratings[eventId];
    const content = ratingContents[eventId];
    if (!rating) return;
    if (!userJoinEventId) return;

    try {
      const ratingObj = {
        eventId,
        rating,
        content,
        userId: user?.userId,
      };
      const res = await PUT_RATING(userJoinEventId, ratingObj);
      if (isApiSuccess(res)) {
        toast.success("Rating success");
      }
    } catch (err) {
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Events Directory</h1>

      {/* Search & filter */}
      <Suspense
        fallback={
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            Loading search...
          </div>
        }
      >
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by event name..."
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
              placeholder="Search by event location..."
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

          {/* Location Filter */}
          {/* <div className="w-full md:w-48">
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border rounded-lg px-3 py-2"
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div> */}
          {/* Major Filter */}
          {/* <div className="w-full md:w-48">
            <select
              value={major}
              onChange={(e) => {
                setMajor(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="All Majors">All Majors</option>
              {majors.map((m) => (
                <option key={m.majorId} value={String(m.majorId)}>
                  {m.majorName}
                </option>
              ))}
            </select>
          </div> */}
          <div className="w-full md:w-48">
            <AutocompleteDropdown
              value={major}
              onChange={(val) => {
                setMajor(val);
              }}
              onSearch={setMajorSearch}
              options={[
                { value: "All Majors", label: "All Majors" },
                ...majors.map((m) => ({
                  value: String(m.majorId),
                  label: m.majorName,
                })),
              ]}
              placeholder="Search majors..."
              isLoading={isLoading}
            />
          </div>
          {/* My Joined Events Button */}
          <Button
            variant={showJoinedEvents ? "default" : "outline"}
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
                setShowJoinedEvents((prev) => !prev);
              }
            }}
            className="whitespace-nowrap"
          >
            {showJoinedEvents ? "Show All Events" : "My Joined Events"}
          </Button>
        </div>
      </Suspense>

      {/* Events grid */}
      {isLoading && (
        <div className="text-center py-10 text-gray-500">Loading events...</div>
      )}

      {!isLoading && eventItems.length === 0 && (
        <div className="text-center py-10 text-gray-500">No events found</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventItems.map((item) => (
          <Card
            key={item.eventId}
            className="border bg-white flex flex-col overflow-hidden"
          >
            {/* Image header */}
            <div className="w-full h-40">
              <Image
                src={item.img || "/default-event.png"}
                alt={item.eventName}
                width={500}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-semibold text-lg mb-2">{item.eventName}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                {item.description}
              </p>
              {showJoinedEvents && (
                <div className="flex items-center text-sm gap-2">
                  <span className="text-gray-600">Average Rating:</span>
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

              {showJoinedEvents ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          (ratings[item.eventId] ?? 0) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => handleStarSelect(item.eventId, star)}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Rating content"
                    value={ratingContents[item.eventId] || ""}
                    onChange={(e) =>
                      setRatingContents((prev) => ({
                        ...prev,
                        [item.eventId]: e.target.value,
                      }))
                    }
                    className="w-full pl-2 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <CustomTooltip
                    message={
                      new Date() < new Date(item.startDate)
                        ? "Event hasn't started, cannot rate"
                        : ""
                    }
                  >
                    <Button
                      size="sm"
                      disabled={
                        !ratings[item.eventId] ||
                        new Date() < new Date(item.startDate)
                      }
                      onClick={() =>
                        handleCommitRating(item.eventId, item.userJoinEventId)
                      }
                    >
                      Rate
                    </Button>
                  </CustomTooltip>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedEventId(item.eventId);
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  Register Now
                </Button>
              )}
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
