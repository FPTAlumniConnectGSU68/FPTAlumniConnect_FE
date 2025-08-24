import React, { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface AutocompleteDropdownProps {
  label?: string;
  value: string | null;
  onChange: (val: string | null) => void;
  options: Option[];
  placeholder?: string;
  isLoading?: boolean;
  onSearch?: (query: string) => void; // 🔑 async search handler
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Search...",
  isLoading = false,
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const displayValue =
    query !== "" // if user is typing, show typed text
      ? query
      : value
      ? options.find((o) => o.value === value)?.label || ""
      : "";

  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium">{label}</label>
      )}

      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          setOpen(true);
          if (val === "") {
            onChange(null); // reset selection if cleared
          }
          onSearch?.(val);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2"
      />

      {open && (
        <div
          className="absolute z-10 mt-2 bg-white border rounded-xl shadow-xl 
             max-h-80 overflow-y-auto py-1 w-auto min-w-full"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No results</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt.value}
                className={`px-5 py-2 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-100 ${
                  opt.value === value ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setQuery(opt.label);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteDropdown;
