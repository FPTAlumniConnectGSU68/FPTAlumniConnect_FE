"use client";

import { useMajorCodes } from "@/hooks/use-major-codes";
import { isApiSuccess } from "@/lib/utils";
import { Filter } from "../ui/filter";

interface JobSearchFiltersProps {
  search: string;
  major: string;
  location: string;
  onSearchChange: (value: string) => void;
  onMajorChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  clearAllRef?: React.RefObject<HTMLButtonElement>;
}

const locations = [
  "All Locations",
  "Ho Chi Minh",
  "Ha Noi",
  "Da Nang",
  "Can Tho",
  "Bien Hoa",
];

export function JobSearchFilters({
  search,
  major,
  location,
  onSearchChange,
  onMajorChange,
  onLocationChange,
  clearAllRef,
}: JobSearchFiltersProps) {
  const { data: majorCodes } = useMajorCodes({});
  const majorItems =
    majorCodes && isApiSuccess(majorCodes) ? majorCodes.data?.items ?? [] : [];
  const majorOptions = majorItems.map((major) => ({
    value: major.majorId.toString(),
    label: major.majorName,
  }));
  const locationOptions = locations.map((location) => ({
    value: location,
    label: location,
  }));
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-wrap gap-4">
      <Filter
        searchPlaceholder="Search jobs..."
        searchValue={search}
        onSearchChange={onSearchChange}
        clearAllRef={clearAllRef}
        selects={[
          {
            placeholder: "Select major",
            value: major,
            onChange: (value) => onMajorChange(value),
            options: majorOptions,
          },
          {
            placeholder: "Select location",
            value: location,
            onChange: (value) => onLocationChange(value),
            options: locationOptions,
          },
        ]}
      />
    </div>
  );
}
