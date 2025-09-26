import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useMajorCodes } from "@/hooks/use-major-codes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useEventService from "@/lib/services/event.service";
import { isApiSuccess } from "@/lib/utils";
import { Event, TimelineSuggestion } from "@/types/interfaces";
import { useUpdateEvent } from "@/hooks/use-event";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/apiResponse";
import { toHHmm } from "@/utils/format-date-time";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TextEditor from "@/components/ui/text-editor";

const statusOptions = [
  { value: "Pending", label: "Sắp diễn ra" },
  { value: "Active", label: "Đang diễn ra" },
  { value: "Completed", label: "Đã kết thúc" },
  { value: "Delete", label: "Đã hủy" },
];

interface TimelineInput {
  eventTimeLineId?: number; // only in edit mode
  title: string;
  description: string;
  speaker: string
  day: string | null;
  startTime: string;
  endTime: string;
}

interface EventFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: number | string | null; // NEW
  setSelectedEvent: (eventId: number | string | null) => void; // NEW
}

export default function EventFormSheet({
  isOpen,
  onOpenChange,
  eventId,
  setSelectedEvent,
}: EventFormSheetProps) {
  const { user } = useAuth();
  const { GET_EVENT_DETAIL_WITH_TIMELINES } = useEventService();
  const { data: majorsRes } = useMajorCodes({
    query: {
      Size: "200",
    },
  });
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  const [loading, setLoading] = useState(false);
  const [isSuggestion, setIsSuggestion] = useState(false);
  const [eventData, setEventData] = useState<any>({
    eventName: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    img: "",
    status: statusOptions[0].value,
    organizerId: user?.userId,
    majorId: 0,
    majorName: "",
  });

  const [timelines, setTimelines] = useState<TimelineInput[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  const resetState = () => {
    setEventData({
      eventName: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      img: "",
      status: null,
      organizerId: user?.userId,
      majorId: 0,
      majorName: "",
    });
    setTimelines([]);
    setErrors([]);
    setIsSuggestion(false);
  };

  // Fetch event detail if editing
  useEffect(() => {
    if (!eventId) {
      resetState();
      return;
    }

    const fetchEventDetail = async () => {
      try {
        setLoading(true);

        const res = await GET_EVENT_DETAIL_WITH_TIMELINES(eventId);
        if (isApiSuccess(res) && res.data) {
          const ev = res.data;
          if (ev) {
            setEventData({
              eventName: ev.eventName || "",
              speaker: ev.speaker || "",
              description: ev.description || "",
              location: ev.location || "",
              startDate: ev.startDate ? ev.startDate : "",
              endDate: ev.endDate ? ev.endDate : "",
              img: ev.img || "",
              status: ev.status || null,
              organizerId: ev.organizerId || user?.userId,
              majorId: ev.majorId || 0,
              majorName: ev.majorName || "",
            });

            if (ev.eventTimeLines && ev.eventTimeLines.length !== 0) {
              setTimelines(
                ev.eventTimeLines.map((t: any) => ({
                  eventTimeLineId: t.eventTimeLineId,
                  title: t.title || "",
                  description: t.description || "",
                  speaker: t.speaker || "",
                  day: t.day ? String(t.day).split("T")[0] : null,
                  startTime: t.startTime?.slice(0, 5) || "",
                  endTime: t.endTime?.slice(0, 5) || "",
                }))
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch event detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId, user?.userId, isOpen]);

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files } = target;

    setEventData((prev: any) => {
      if (type === "file") {
        if (files?.[0]) {
          return { ...prev, img: URL.createObjectURL(files[0]) };
        } else {
          return { ...prev, img: "" }; // Clear image if no file
        }
      }

      if (["organizerId", "majorId"].includes(name)) {
        return { ...prev, [name]: Number(value) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleTimelineChange = (
    index: number,
    field: keyof TimelineInput,
    value: string
  ) => {
    setTimelines((prev) => {
      const updated = [...prev];
      if (field === "day") {
        updated[index].day = value || null;
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }
      return updated;
    });
  };

  const addTimeline = () => {
    setTimelines((prev) => [
      ...prev,
      { title: "", description: "", speaker: "", day: null, startTime: "", endTime: "" },
    ]);
  };

  const removeTimeline = (index: number) => {
    setTimelines((prev) => prev.filter((_, i) => i !== index));
  };

  const validateAll = () => {
    const newErrors: string[] = [];
    const now = new Date();
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);

    if (!eventData.eventName.trim()) newErrors.push("Event name is required.");
    if (!eventData.speaker.trim()) newErrors.push("Event speaker is required.");
    if (!eventData.startDate) newErrors.push("Event start date is required.");

    if (!eventData.endDate) newErrors.push("Event end date is required.");
    else if (end <= start)
      newErrors.push("Event end date must be after start date.");

    timelines.forEach((t, idx) => {
      if (!t.title.trim())
        newErrors.push(`Timeline ${idx + 1}: title is required.`);
      if (!t.day)
        newErrors.push(`Timeline ${idx + 1}: time required.`);
      if (
        t.startTime &&
        t.endTime &&
        new Date(t.startTime) >= new Date(t.endTime)

      ) {
        newErrors.push(`Timeline ${idx + 1}: start must be before end.`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Update event if eventId is provided
  const { mutate: updateEvent } = useUpdateEvent();

  const handleUpdate = async () => {
    if (!eventId) return;
    if (!validateAll()) return;

    const payload = {
      eventName: eventData.eventName,
      img: eventData.img,
      speaker: eventData.speaker,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      organizerId: eventData.organizerId,
      majorId: eventData.majorId,
      location: eventData.location,
      status: eventData.status,
      timeLines: timelines.map((t) => ({
        title: t.title,
        description: t.description,
        speaker: t.speaker,
        day: t.day,
        startTime: t.startTime && t.startTime.trim() !== "" ? t.startTime : "00:00",
        endTime: t.endTime && t.endTime.trim() !== "" ? t.endTime : "00:00",
      })),
    };

    try {
      await updateEvent({
        eventId: eventId.toString(),
        eventData: payload,
      });
      toast.success("Event updated successfully");
      onOpenChange(false);
      resetState();
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

  //Create new event if eventId is not provided
  const { CREATE_EVENT } = useEventService();
  const handleCreate = async () => {
    if (!validateAll()) return;

    const payload = {
      eventName: eventData.eventName,
      img: eventData.img,
      speaker: eventData.speaker,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      organizerId: eventData.organizerId,
      majorId: eventData.majorId,
      location: eventData.location,
      status: eventData.status,
      timeLines: [], // no timelines on create
    };

    try {
      const res: ApiResponse<
        Event & { timelineSuggestions?: TimelineSuggestion[]; id?: string }
      > = await CREATE_EVENT(payload);

      if (
        (res.status === "success" || res.status === "partial_success") &&
        res.data
      ) {
        if (res.status === "success") {
          onOpenChange(false);
        } else {
          if (res.data.id) {
            setSelectedEvent(res.data.id);
            setTimelines(
              (res.data.timelineSuggestions || []).map((t) => ({
                title: t.title || "",
                description: t.description || "",
                speaker: t.speaker || "",
                day: t.day ? String(t.day).split("T")[0] : null,
                startTime: toHHmm(t.startTime),
                endTime: toHHmm(t.endTime),
              }))
            );
            setIsSuggestion(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventId ? "Chỉnh sửa sự kiện" : "Tạo sự kiện"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {/* Event fields */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Tên sự kiện</Label>
                <Input
                  name="eventName"
                  value={eventData.eventName}
                  onChange={handleEventChange}
                />
              </div>
              <div className="w-1/4">
                <Label>Trạng thái</Label>
                <Select
                  value={eventData.status || ""}
                  onValueChange={(val) =>
                    setEventData((prev: any) => ({
                      ...prev,
                      status: val,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Label>Người diễn giả</Label>
            <Input
              name="speaker"
              value={eventData.speaker}
              onChange={handleEventChange}
            />
            <Label>Mô tả</Label>
            <div className="mb-9">
              <TextEditor
                content={eventData.description}
                setContent={(val) =>
                  setEventData((prev: any) => ({
                    ...prev,
                    description: val, // Quill HTML string
                  }))
                }
                height="100px"
                extraItems={['link', 'image']}
              />
            </div>

            <Label>Địa điểm</Label>
            <Input
              name="location"
              value={eventData.location}
              onChange={handleEventChange}
            />

            {majors.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="major">Chuyên ngành</Label>
                <Select
                  value={eventData.majorId ? String(eventData.majorId) : ""}
                  onValueChange={(val) =>
                    setEventData((prev: any) => ({
                      ...prev,
                      majorId: Number(val), // convert back to number
                    }))
                  }
                >
                  <SelectTrigger id="major" className="w-full">
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((m) => (
                      <SelectItem key={m.majorId} value={String(m.majorId)}>
                        {m.majorName.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Label>Ngày bắt đầu</Label>
            <Input
              type="datetime-local"
              name="startDate"
              value={eventData.startDate}
              onChange={handleEventChange}
            />

            <Label>Ngày kết thúc</Label>
            <Input
              type="datetime-local"
              name="endDate"
              value={eventData.endDate}
              onChange={handleEventChange}
            />

            <Label>URL hình ảnh</Label>
            <Input
              name="img"
              value={eventData.img}
              onChange={handleEventChange}
            />

            <Label>Tải lên hình ảnh</Label>
            <Input type="file" accept="image/*" onChange={handleEventChange} />
            {eventData.img && (
              <img
                src={eventData.img}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
            )}
            {eventId && (
              <>
                {/* Timeline section */}
                <div className="flex items-center justify-between mt-6">
                  <h3 className="text-lg font-semibold">Lịch trình</h3>
                  {isSuggestion && (
                    <span className="text-sm bg-green-50 border border-green-500 text-green-500 rounded-lg p-3">
                      Dưới đây là gợi ý cho lịch trình
                    </span>
                  )}
                  <Button size="sm" onClick={addTimeline}>
                    Thêm lịch trình
                  </Button>
                </div>
                {timelines.length === 0 && (
                  <div className="text-gray-500">Không có lịch trình</div>
                )}
                {timelines.map((t, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 mb-4 space-y-3"
                  >
                    {/* Row 1: Title */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <Input
                        type="text"
                        placeholder="Tiêu đề"
                        value={t.title}
                        onChange={(e) =>
                          handleTimelineChange(idx, "title", e.target.value)
                        }
                      />
                    </div>
                    {/* Row 2: Speaker */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Diễn giả</label>
                      <Input
                        type="text"
                        placeholder="Diễn giả"
                        value={t.speaker}
                        onChange={(e) =>
                          handleTimelineChange(
                            idx,
                            "speaker",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Row 3: Description */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Mô tả</label>
                      <Input
                        type="text"
                        placeholder="Mô tả"
                        value={t.description}
                        onChange={(e) =>
                          handleTimelineChange(
                            idx,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {/* Row 4: Start Time, End Time, Remove Button */}
                    <div className="flex gap-4 items-end">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium">
                          Ngày
                        </label>
                        <Input
                          type="date"
                          value={t.day ?? ""}
                          onChange={(e) =>
                            handleTimelineChange(
                              idx,
                              "day",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium">
                          Thời gian bắt đầu
                        </label>
                        <Input
                          type="time"
                          value={t.startTime}
                          onChange={(e) =>
                            handleTimelineChange(idx, "startTime", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium">
                          Thời gian kết thúc
                        </label>
                        <Input
                          type="time"
                          value={t.endTime}
                          onChange={(e) =>
                            handleTimelineChange(idx, "endTime", e.target.value)
                          }
                        />
                      </div>

                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-5"
                        onClick={() => removeTimeline(idx)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg p-3">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i} className="text-sm">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={eventId ? handleUpdate : handleCreate}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Lưu sự kiện
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
