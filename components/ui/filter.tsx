"use client";

import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface SelectConfig {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
  width?: string;
}

interface FilterProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchWidth?: string;
  selects?: SelectConfig[];
  className?: string;
  clearAllRef?: React.RefObject<HTMLButtonElement>;
  children?: React.ReactNode;
}

export function Filter({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  searchWidth = "w-[300px]",
  selects = [],
  className = "",
  clearAllRef,
  children,
}: FilterProps) {
  return (
    <div className={`flex gap-4 items-center ${className}`}>
      {onSearchChange && (
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={searchWidth}
        />
      )}
      {selects.map((select, index) => (
        <Select
          key={index}
          value={select.value}
          onValueChange={select.onChange}
        >
          <SelectTrigger className={select.width || "w-[200px]"}>
            <SelectValue placeholder={select.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {select.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {/* extra */}
      {children}
      {/* button to clear all filters */}
      <Button
        ref={clearAllRef}
        variant="outline"
        onClick={() => {
          selects.forEach((select) => {
            select.onChange("");
          });
        }}
      >
        Xóa tất cả
      </Button>
    </div>
  );
}
