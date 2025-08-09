import { useState } from "react";
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
import { Event } from "@/types/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateEventSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: Partial<Event>) => void;
}

export default function CreateEventSheet({
  isOpen,
  onOpenChange,
  onSave,
}: CreateEventSheetProps) {
  const { user } = useAuth();
  const { data: majorsRes } = useMajorCodes();
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  const [eventData, setEventData] = useState({
    eventName: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    img: "",
    organizerId: user?.userId,
    majorId: 0,
  });

  const [errors, setErrors] = useState({
    eventName: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files?.[0]) {
      const fileUrl = URL.createObjectURL(files[0]);
      setEventData((prev) => ({ ...prev, img: fileUrl }));
    } else {
      setEventData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMajorChange = (value: string) => {
    setEventData((prev) => ({ ...prev, majorId: Number(value) }));
  };

  const validateForm = () => {
    const now = new Date();
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    const newErrors = { eventName: "", startDate: "", endDate: "" };
    let hasError = false;

    if (!eventData.eventName.trim()) {
      newErrors.eventName = "Event name is required.";
      hasError = true;
    }
    if (!eventData.startDate) {
      newErrors.startDate = "Start date is required.";
      hasError = true;
    } else if (start < now) {
      newErrors.startDate = "Start date cannot be in the past.";
      hasError = true;
    }
    if (!eventData.endDate) {
      newErrors.endDate = "End date is required.";
      hasError = true;
    } else if (end <= start) {
      newErrors.endDate = "End date must be after start date.";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave({
      ...eventData,
      startDate: new Date(eventData.startDate).toISOString(),
      endDate: new Date(eventData.endDate).toISOString(),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Create Event</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 py-4">
            {/* Event Name */}
            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
              />
              {errors.eventName && (
                <p className="text-sm text-red-500">{errors.eventName}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
            </div>

            {/* Major Select */}
            {majors.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="major">Major</Label>
                <Select onValueChange={handleMajorChange}>
                  <SelectTrigger id="major" className="w-full">
                    <SelectValue placeholder="Select Major" />
                  </SelectTrigger>
                  <SelectContent>
                    {majors.map((m) => (
                      <SelectItem key={m.majorId} value={String(m.majorId)}>
                        {m.majorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Start Date */}
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={eventData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={eventData.endDate}
                onChange={handleChange}
                min={eventData.startDate}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="grid gap-2">
              <Label htmlFor="img">Image URL</Label>
              <Input
                id="img"
                name="img"
                value={eventData.img}
                onChange={handleChange}
              />
            </div>

            {/* File Upload */}
            <div className="grid gap-2">
              <Label htmlFor="uploadImg">Upload Image</Label>
              <Input
                id="uploadImg"
                name="img"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              {eventData.img && (
                <img
                  src={eventData.img}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          <SheetFooter className="mb-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Create Event</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
