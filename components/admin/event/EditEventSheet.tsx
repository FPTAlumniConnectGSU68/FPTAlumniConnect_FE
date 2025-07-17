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
import { Event } from "@/types/interfaces";
import { useState } from "react";

interface EditEventSheetProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: Partial<Event>) => void;
}

export default function EditEventSheet({
  event,
  isOpen,
  onOpenChange,
  onSave,
}: EditEventSheetProps) {
  const [eventData, setEventData] = useState({
    eventName: event.eventName,
    description: event.description,
    location: event.location,
    startDate: new Date(event.startDate).toISOString().slice(0, 16),
    endDate: new Date(event.endDate).toISOString().slice(0, 16),
    img: event.img,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
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
          <SheetTitle>Edit Event</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
              />
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                value={eventData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                value={eventData.endDate}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="img">Image URL</Label>
              <Input
                id="img"
                name="img"
                value={eventData.img}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="img">Upload Image</Label>
              <Input
                id="img"
                name="img"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>
          <SheetFooter className="mb-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
