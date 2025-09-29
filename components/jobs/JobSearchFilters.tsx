"use client";

import { useMajorCodes } from "@/hooks/use-major-codes";
import { isApiSuccess } from "@/lib/utils";
import { Filter } from "../ui/filter";
import { useEffect, useState } from "react";
import AutocompleteDropdown from "../autocomplete/AutocompleteSelect";

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
  const [majorSearch, setMajorSearch] = useState("");
  const { data: majorsRes } = useMajorCodes({
    searchString: majorSearch,
    query: {
      Size: "300",
    },
  });
  const majors =
    majorsRes?.status === "success" ? majorsRes.data?.items ?? [] : [];

  const locationOptions = locations.map((location) => ({
    value: location,
    label: location,
  }));

  useEffect(() => {
    if (!clearAllRef?.current) return;

    const handler = () => {
      // reset major to default
      onMajorChange("Tất cả chuyên ngành");
    };

    const btn = clearAllRef.current;
    btn.addEventListener("click", handler);

    return () => {
      btn.removeEventListener("click", handler);
    };
  }, [clearAllRef, onMajorChange]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 flex gap-4 w-full">
      <Filter
        searchPlaceholder="Tìm kiếm việc làm..."
        searchValue={search}
        onSearchChange={onSearchChange}
        clearAllRef={clearAllRef}
        selects={[
          {
            placeholder: "Chọn địa điểm",
            value: location,
            onChange: (value) => onLocationChange(value),
            options: locationOptions,
          },
        ]}
      >
        <div className="w-48">
          <AutocompleteDropdown
            value={major}
            onChange={(val) => onMajorChange(val || "")}
            onSearch={setMajorSearch}
            options={[
              { value: "Tất cả chuyên ngành", label: "Tất cả chuyên ngành" },
              ...majors.map((m) => ({
                value: String(m.majorId),
                label: m.majorName,
              })),
            ]}
            placeholder="Select major..."
          />
        </div>
      </Filter>
    </div>
  );
}
