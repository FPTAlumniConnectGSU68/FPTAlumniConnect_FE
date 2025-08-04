import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  disabled,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(date);

  React.useEffect(() => {
    setSelectedDateTime(date);
  }, [date]);

  const handleDateSelect = (selected: Date | undefined) => {
    if (selected) {
      const currentDateTime = selectedDateTime || new Date();
      const newDateTime = new Date(selected);
      newDateTime.setHours(currentDateTime.getHours());
      newDateTime.setMinutes(currentDateTime.getMinutes());
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    if (timeString && selectedDateTime) {
      const [hours, minutes] = timeString.split(":");
      const newDateTime = new Date(selectedDateTime);
      newDateTime.setHours(parseInt(hours, 10));
      newDateTime.setMinutes(parseInt(minutes, 10));
      setSelectedDateTime(newDateTime);
      setDate(newDateTime);
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
        onChange={handleTimeChange}
        className="w-[120px]"
        disabled={disabled}
      />
    </div>
  );
}
