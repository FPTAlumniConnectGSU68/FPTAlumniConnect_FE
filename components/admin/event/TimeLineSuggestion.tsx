import { Button } from "@/components/ui/button";
import useEventService from "@/lib/services/event.service";
import { TimelineSuggestion } from "@/types/interfaces";
import { useState, useEffect } from "react";

type TimelineInput = {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
};

interface Props {
  eventId: number;
  initialTimelines?: TimelineSuggestion[];
  onSuccess?: () => void;
}

export default function TimelineSuggestionForm({
  eventId,
  initialTimelines = [],
  onSuccess,
}: Props) {
  const { CREATE_TIMELINES } = useEventService();
  const [timelines, setTimelines] = useState<TimelineInput[]>([
    { name: "", description: "", startTime: "", endTime: "" },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (initialTimelines.length > 0) {
      setTimelines(
        initialTimelines.map((t) => ({
          name: t.name || "",
          description: t.description || "",
          startTime: t.startTime ? t.startTime.slice(0, 16) : "",
          endTime: t.endTime ? t.endTime.slice(0, 16) : "",
        }))
      );
    }
  }, [initialTimelines]);

  const handleChange = (
    index: number,
    field: keyof TimelineInput,
    value: string
  ) => {
    const newTimelines = [...timelines];
    newTimelines[index][field] = value;
    setTimelines(newTimelines);
  };

  const addTimeline = () => {
    setTimelines([
      ...timelines,
      { name: "", description: "", startTime: "", endTime: "" },
    ]);
  };

  const removeTimeline = (index: number) => {
    setTimelines(timelines.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: string[] = [];
    timelines.forEach((t, idx) => {
      if (!t.name) newErrors.push(`Timeline ${idx + 1}: name is required`);
      if (!t.startTime || !t.endTime)
        newErrors.push(`Timeline ${idx + 1}: Start/End time required`);
      if (
        t.startTime &&
        t.endTime &&
        new Date(t.startTime) >= new Date(t.endTime)
      ) {
        newErrors.push(`Timeline ${idx + 1}: Start must be before End`);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = timelines.map((t) => ({
      eventId,
      title: t.name,
      description: t.description,
      startTime: new Date(t.startTime).toISOString(),
      endTime: new Date(t.endTime).toISOString(),
    }));

    const res = await CREATE_TIMELINES(eventId, payload);
    if (res.status === "success") {
      onSuccess?.();
    } else {
      setErrors([res.message]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sticky header with title & actions */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 m-0">Timelines</h3>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={addTimeline}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Another
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Save Timelines
          </button>
        </div>
      </div>

      {/* Error messages */}
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

      {/* Timelines list */}
      {timelines.map((t, idx) => (
        <div
          key={idx}
          className="border border-gray-300 bg-white shadow-sm rounded-lg p-4 space-y-3"
        >
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter timeline name"
              value={t.name}
              onChange={(e) => handleChange(idx, "name", e.target.value)}
              className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter description"
              value={t.description}
              onChange={(e) => handleChange(idx, "description", e.target.value)}
              className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={t.startTime}
                onChange={(e) => handleChange(idx, "startTime", e.target.value)}
                className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={t.endTime}
                onChange={(e) => handleChange(idx, "endTime", e.target.value)}
                className="w-full border-2 border-gray-400 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {idx > 0 && (
            <button
              type="button"
              onClick={() => removeTimeline(idx)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
