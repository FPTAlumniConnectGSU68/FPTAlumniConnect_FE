import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

interface TimelineInput {
  eventTimeLineId?: number; // only in edit mode
  title: string;
  description: string;
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
  const { data: majorsRes } = useMajorCodes();
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  const [loading, setLoading] = useState(false);
  const [isSuggestion, setIsSuggestion] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    img: "",
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
              description: ev.description || "",
              location: ev.location || "",
              startDate: ev.startDate
                ? new Date(ev.startDate).toISOString().slice(0, 16)
                : "",
              endDate: ev.endDate
                ? new Date(ev.endDate).toISOString().slice(0, 16)
                : "",
              img: ev.img || "",
              organizerId: ev.organizerId || user?.userId,
              majorId: ev.majorId || 0,
              majorName: ev.majorName || "",
            });

            if (ev.eventTimeLines && ev.eventTimeLines.length !== 0) {
              setTimelines(
                ev.eventTimeLines.map((t: any) => ({
                  eventTimeLineId: t.eventTimeLineId, // keep if API needs for update
                  title: t.title || "",
                  description: t.description || "",
                  startTime: t.startTime?.slice(0, 5) || "", // HH:mm
                  endTime: t.endTime?.slice(0, 5) || "", // HH:mm
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

    setEventData((prev) => {
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
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTimeline = () => {
    setTimelines((prev) => [
      ...prev,
      { title: "", description: "", startTime: "", endTime: "" },
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
    if (!eventData.startDate) newErrors.push("Event start date is required.");

    if (!eventData.endDate) newErrors.push("Event end date is required.");
    else if (end <= start)
      newErrors.push("Event end date must be after start date.");

    timelines.forEach((t, idx) => {
      if (!t.title.trim())
        newErrors.push(`Timeline ${idx + 1}: title is required.`);
      if (!t.startTime || !t.endTime)
        newErrors.push(`Timeline ${idx + 1}: start/end time required.`);
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
      description: eventData.description,
      startDate: new Date(eventData.startDate).toISOString(),
      endDate: new Date(eventData.endDate).toISOString(),
      organizerId: eventData.organizerId,
      majorId: eventData.majorId,
      location: eventData.location,
      status: "Pending",
      timeLines: timelines.map((t) => ({
        title: t.title,
        description: t.description,
        startTime: t.startTime,
        endTime: t.endTime,
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
      description: eventData.description,
      startDate: new Date(eventData.startDate).toISOString(),
      endDate: new Date(eventData.endDate).toISOString(),
      organizerId: eventData.organizerId,
      majorId: eventData.majorId,
      location: eventData.location,
      status: "Pending",
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{eventId ? "Edit Event" : "Create Event"}</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {/* Event fields */}
            <Label>Event Name</Label>
            <Input
              name="eventName"
              value={eventData.eventName}
              onChange={handleEventChange}
            />

            <Label>Description</Label>
            <Textarea
              name="description"
              value={eventData.description}
              onChange={handleEventChange}
            />

            <Label>Location</Label>
            <Input
              name="location"
              value={eventData.location}
              onChange={handleEventChange}
            />

            {majors.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="major">Major</Label>
                <Select
                  value={eventData.majorId ? String(eventData.majorId) : ""}
                  onValueChange={(val) =>
                    setEventData((prev) => ({
                      ...prev,
                      majorId: Number(val), // convert back to number
                    }))
                  }
                >
                  <SelectTrigger id="major" className="w-full">
                    <SelectValue placeholder="Select Major" />
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

            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              name="startDate"
              value={eventData.startDate}
              onChange={handleEventChange}
            />

            <Label>End Date</Label>
            <Input
              type="datetime-local"
              name="endDate"
              value={eventData.endDate}
              onChange={handleEventChange}
            />

            <Label>Image URL</Label>
            <Input
              name="img"
              value={eventData.img}
              onChange={handleEventChange}
            />

            <Label>Upload Image</Label>
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
                  <h3 className="text-lg font-semibold">Timelines</h3>
                  {isSuggestion && (
                    <span className="text-sm bg-green-50 border border-green-500 text-green-500 rounded-lg p-3">
                      Below is the suggestions for timelines
                    </span>
                  )}
                  <Button size="sm" onClick={addTimeline}>
                    Add Timeline
                  </Button>
                </div>
                {timelines.length === 0 && (
                  <div className="text-gray-500">No timelines added</div>
                )}
                {timelines.map((t, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 mb-4 space-y-3"
                  >
                    {/* Row 1: Title */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        type="text"
                        placeholder="Title"
                        value={t.title}
                        onChange={(e) =>
                          handleTimelineChange(idx, "title", e.target.value)
                        }
                      />
                    </div>

                    {/* Row 2: Description */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        type="text"
                        placeholder="Description"
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

                    {/* Row 3: Start Time, End Time, Remove Button */}
                    <div className="flex gap-4 items-end">
                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium">
                          Start Time
                        </label>
                        <Input
                          type="time"
                          value={t.startTime}
                          onChange={(e) =>
                            handleTimelineChange(
                              idx,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium">End Time</label>
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
                        Remove
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

        <SheetFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={eventId ? handleUpdate : handleCreate}
            disabled={loading}
          >
            Save Event
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
