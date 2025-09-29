"use client";
import DayBarChart from "@/components/chart/BarChart";
import AlumniPieChart from "@/components/chart/PieChart";
import RelatedEvent from "@/components/event/RelatedEvent";
import CustomTooltip from "@/components/tooltip/CustomToolTip";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/auth-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import useEventService from "@/lib/services/event.service";
import { formatDateToDMY, formatTime, isApiSuccess } from "@/lib/utils";
import { Event, EventRating, EventTimeline } from "@/types/interfaces";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { set } from "date-fns";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { decode } from "entities";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isManage = searchParams.get("isManage") === "true";
  const { id } = params;
  const { user } = useAuth();
  const {
    GET_EVENT_DETAIL_WITH_TIMELINES,
    JOIN_EVENT,
    GET_EVENT_RATING,
    CHECK_USER_JOIN_EVENT,
    PUT_RATING,
    GET_EVENT_ROLE_STATISTICS,
    GET_EVENT_PATICIPANT_STATISTICS,
  } = useEventService();
  const router = useRouter();
  const { requireAuth, AuthGuard } = useAuthGuard();
  const [event, setEvent] = useState<Event>();
  const [eventRating, setEventRating] = useState<EventRating[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [userRating, setUserRating] = useState<EventRating | null>(null);

  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [ratingContents, setRatingContents] = useState<Record<number, string>>(
    {}
  );
  const [roleStats, setRoleStats] = useState<any>(null);
  const [participentStats, setParticipentStats] = useState<any>(null);

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

    const fetchStatsitics = async () => {
      if (!id) return;
      try {
        const roleRes = await GET_EVENT_ROLE_STATISTICS(id);
        const participentRes = await GET_EVENT_PATICIPANT_STATISTICS(id);
        if (isApiSuccess(roleRes) && roleRes.data) {
          setRoleStats(
            Object.entries(roleRes.data).map(([key, value]) => ({
              name: key,
              value,
            }))
          );
        }
        if (isApiSuccess(participentRes) && participentRes.data) {
          setParticipentStats(
            Object.entries(participentRes.data).map(([date, value]) => ({
              date,
              value,
            }))
          );
        }
      } catch (error) { }
    };
    if (isManage) {
      fetchStatsitics();
    }
    fetchRating();
    fetchEvent();
  }, [id, isManage]);

  useEffect(() => {
    const checkUserJoinEvent = async () => {
      if (!id || !user?.userId) return;
      try {
        const res = await CHECK_USER_JOIN_EVENT(id, user.userId);
        if (isApiSuccess(res) && res.data) {
          setUserRating(res.data);
        }
      } catch (error) { }
    };
    checkUserJoinEvent();
  }, [id, user]);

  useEffect(() => {
    if (userRating && eventRating) {
      const found = eventRating.some((rating) => rating.id === userRating.id);
      if (found) {
        if (userRating.rating || userRating.content !== "") {
          setRatings((prev) => ({
            ...prev,
            [userRating.eventId]: userRating.rating || 0,
          }));
          setRatingContents((prev) => ({
            ...prev,
            [userRating.eventId]: userRating.content || "",
          }));
        }
      }
    }
  }, [userRating, eventRating]);

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

  const handleStarSelect = (eventId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [eventId]: rating }));
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
    return (
      <p className="p-6 text-center text-gray-500">Không tìm thấy sự kiện.</p>
    );
  }

  return (
    <div className="p-6">
      {/* Back button */}
      <button className="text-blue-600 mb-4" onClick={() => router.back()}>
        &larr; Quay lại
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Image */}
          <div className="w-full h-auto bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            {event.img ? (
              <img
                src={event.img}
                alt={event.eventName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-gray-100">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>

          {/* Title / Location / Start Date */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{event.eventName}</h2>
            <h4 className="font-normal mb-2">Diễn giả: {event.speaker}</h4>
            <div className="flex flex-col justify-between items-start gap-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-sm text-gray-700 mt-1 ">
                {/* Start time */}
                <div className="flex flex-col">
                  <span className="text-gray-500 font-medium mb-1">
                    Thời gian bắt đầu
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDateToDMY(event.startDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {formatTime(event.startDate)}
                    </div>
                  </div>
                </div>

                {/* End time */}
                <div className="flex flex-col">
                  <span className="text-gray-500 font-medium mb-1">
                    Thời gian kết thúc
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      {formatDateToDMY(event.endDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      {formatTime(event.endDate)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center mt-1 gap-4 text-sm text-gray-600">
                {/* Participants */}
                <div className="flex items-center">
                  <span className="font-medium">Số lượng tham gia:</span>
                  <span className="ml-1">{event.total}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <span className="font-medium">Đánh giá trung bình:</span>
                  <span className="ml-1">{event.averageRating}</span>
                  <span className="text-yellow-500 ml-1">⭐</span>
                </div>
              </div>
            </div>
            <div>
              {!userRating ? (
                <Button
                  onClick={() => {
                    if (new Date(event.startDate) < new Date()) {
                      return; // prevent joining if already started
                    }
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
                  disabled={joining || new Date(event.startDate) < new Date()}
                  className={
                    new Date(event.startDate) < new Date()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  }
                >
                  {/* {joining ? "Joining..." : "Tham gia sự kiện"} */}
                  {new Date(event.startDate) < new Date()
                    ? "Đã diễn ra"
                    : joining
                      ? "Joining..."
                      : "Tham gia sự kiện"}
                </Button>
              ) : (
                <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                  <h3 className="font-semibold">Đánh giá sự kiện</h3>

                  {/* Stars */}
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-7 h-7 cursor-pointer transition-colors ${(ratings[event.eventId] ?? 0) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                          }`}
                        onClick={() => handleStarSelect(event.eventId, star)}
                      />
                    ))}
                  </div>

                  {/* Comment Box */}
                  <textarea
                    rows={3}
                    placeholder="Chia sẻ cảm nhận của bạn..."
                    value={ratingContents[event.eventId] || ""}
                    onChange={(e) =>
                      setRatingContents((prev) => ({
                        ...prev,
                        [event.eventId]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <CustomTooltip
                      message={
                        new Date() < new Date(event.startDate)
                          ? "Sự kiện chưa diễn ra, không thể đánh giá"
                          : ""
                      }
                    >
                      <Button
                        size="sm"
                        disabled={
                          !ratings[event.eventId] ||
                          new Date() < new Date(event.startDate)
                        }
                        onClick={() =>
                          handleCommitRating(event.eventId, userRating?.id)
                        }
                      >
                        Gửi đánh giá
                      </Button>
                    </CustomTooltip>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ratings */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Đánh giá</h3>
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
                            Không có đánh giá nào
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
              <p className="text-sm text-gray-500">Không có đánh giá nào</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Management*/}
          {isManage && (
            <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-h-60">
              <Tabs defaultValue="pie" className="w-full">
                {/* Tab buttons */}
                <TabsList className="flex justify-start space-x-2 mb-4">
                  <TabsTrigger
                    value="pie"
                    className="px-4 py-2 text-sm font-medium border rounded-lg transition
      data-[state=active]:bg-orange-600 data-[state=active]:text-white
      data-[state=active]:border-orange-600 data-[state=active]:shadow"
                  >
                    Thành phần tham gia
                  </TabsTrigger>
                  <TabsTrigger
                    value="bar"
                    className="px-4 py-2 text-sm font-medium border rounded-lg transition
      data-[state=active]:bg-orange-600 data-[state=active]:text-white
      data-[state=active]:border-orange-600 data-[state=active]:shadow"
                  >
                    Số lượng tham gia
                  </TabsTrigger>
                </TabsList>

                {/* Pie Chart */}
                <TabsContent value="pie">
                  <AlumniPieChart data={roleStats || []} />
                </TabsContent>

                {/* Bar Chart */}
                <TabsContent value="bar">
                  <DayBarChart data={participentStats || []} />
                </TabsContent>
              </Tabs>
            </div>
          )}
          {/* Descriptions */}
          <div className="flex-1 p-4 border rounded-lg bg-gray-50 min-h-60">
            <h3 className="font-semibold mb-2">Mô tả</h3>
            <div className="mb-4 min-h-[40px]" dangerouslySetInnerHTML={{ __html: decode(event.description) }} />
          </div>

          {/* Timeline */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-2">Lịch hoạt động</h3>
            {event.eventTimeLines && event.eventTimeLines.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {event.eventTimeLines.map((t: EventTimeline, index) => (
                  <li key={t.eventTimeLineId} className="flex flex-col gap-1">
                    <div className="grid gap-4 grid-cols-2">
                      <p className="font-semibold">{(index + 1) + ". " + t.title}</p>

                      <div className="flex items-center gap-3">
                        <p>{formatDateToDMY(t.day)}</p>
                        <div className="flex items-center"> <Clock className="h-4 w-4 mr-2" />
                          {formatTime(t.startTime)} - {formatTime(t.endTime)}</div>

                      </div>
                    </div>
                    <p>Diễn giả: {t.speaker}</p>
                    <p className="mb-2">Chi tiết: {t.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Không có lịch hoạt động</p>
            )}
          </div>
        </div>

      </div>
      <AuthGuard />
      <RelatedEvent eventId={id} />
    </div>
  );
}
