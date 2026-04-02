"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDefinition {
  label: string;
  value: string;
  options: FilterOption[];
}

interface FilterBarProps {
  searchValue: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterDefinition[];
  onFilterChange?: (filterLabel: string, value: string) => void;
}

export function FilterBar({
  searchValue,
  onSearch,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(e) => onFilterChange?.(filter.label, e.target.value)}
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
