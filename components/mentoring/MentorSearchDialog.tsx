import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useMentors } from "@/hooks/use-mentors";
import { isApiSuccess } from "@/lib/utils";
import { Mentor } from "@/types/interfaces";
import { DateTimePicker } from "../ui/date-time-picker";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MentorSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMentor: (
    mentorId: number,
    startDate: Date | undefined,
    endDate: Date | undefined,
    content: string
  ) => void;
  requestId: number | null;
}

export function MentorSearchDialog({
  isOpen,
  onOpenChange,
  onSelectMentor,
  requestId,
}: MentorSearchDialogProps) {
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState("");
  const { data: mentors, isLoading } = useMentors({
    page: 1,
    query: {
      isMentor: "true",
    },
  });

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedMentorId("");
    setStartDate(undefined);
    setEndDate(undefined);
    setContent("");
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Mentor for Request #{requestId}</DialogTitle>
          <DialogDescription>
            Search and select a mentor to assign to this request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Assign Mentor
              </label>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="md" text="Loading mentors..." />
                </div>
              ) : (
                <Select
                  value={selectedMentorId}
                  onValueChange={(value) => setSelectedMentorId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {!mentors || !isApiSuccess(mentors) || !mentors.data ? (
                      <SelectItem value="none" disabled>
                        No mentors found
                      </SelectItem>
                    ) : (
                      mentors.data.items.map((mentor: Mentor) => (
                        <SelectItem
                          key={mentor.userId}
                          value={mentor.userId.toString()}
                        >
                          {mentor.firstName} {mentor.lastName} -{" "}
                          {mentor.majorName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date and Time
              </label>
              <DateTimePicker date={startDate} setDate={setStartDate} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date and Time
              </label>
              <DateTimePicker date={endDate} setDate={setEndDate} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                placeholder="Enter session content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedMentorId) {
                  onSelectMentor(
                    parseInt(selectedMentorId),
                    startDate,
                    endDate,
                    content
                  );
                  handleCancel();
                }
              }}
              disabled={!selectedMentorId || !startDate || !endDate || !content}
            >
              Assign Mentor
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
