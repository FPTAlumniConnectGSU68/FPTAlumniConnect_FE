"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MonthYear = {
  month?: number;
  year?: number;
};

export function MonthYearSelect({
  value,
  onChange,
  years,
  className,
}: {
  value: MonthYear;
  onChange: (val: MonthYear) => void;
  years?: number[];
  className?: string;
}) {
  const current = new Date();
  const defaultYears = React.useMemo(() => {
    const currentYear = current.getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  }, []);

  // const months = [
  //   { label: "All", value: undefined },
  //   { label: "Jan", value: 1 },
  //   { label: "Feb", value: 2 },
  //   { label: "Mar", value: 3 },
  //   { label: "Apr", value: 4 },
  //   { label: "May", value: 5 },
  //   { label: "Jun", value: 6 },
  //   { label: "Jul", value: 7 },
  //   { label: "Aug", value: 8 },
  //   { label: "Sep", value: 9 },
  //   { label: "Oct", value: 10 },
  //   { label: "Nov", value: 11 },
  //   { label: "Dec", value: 12 },
  // ];
  const months = [
    { label: "Tất cả", value: undefined },
    { label: "Tháng 1", value: 1 },
    { label: "Tháng 2", value: 2 },
    { label: "Tháng 3", value: 3 },
    { label: "Tháng 4", value: 4 },
    { label: "Tháng 5", value: 5 },
    { label: "Tháng 6", value: 6 },
    { label: "Tháng 7", value: 7 },
    { label: "Tháng 8", value: 8 },
    { label: "Tháng 9", value: 9 },
    { label: "Tháng 10", value: 10 },
    { label: "Tháng 11", value: 11 },
    { label: "Tháng 12", value: 12 },
  ];

  const yearsList = years && years.length ? years : defaultYears;

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Select
          value={value.month ? String(value.month) : "all"}
          onValueChange={(v) =>
            onChange({ ...value, month: v === "all" ? undefined : Number(v) })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem
                key={m.label}
                value={m.value ? String(m.value) : "all"}
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            value.year ? String(value.year) : String(current.getFullYear())
          }
          onValueChange={(v) => onChange({ ...value, year: Number(v) })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {yearsList.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
