"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn, pluralize } from "@/lib/utils";
import type { Status } from "@/prisma/generated/prisma/enums";
import {
  DIFFICULTIES,
  DIFFICULTY_DOT_CLASS,
  type ProblemDifficulty,
} from "@/constants/difficulty";
import { STATUS_LABELS, STATUSES } from "@/constants/status";
import {
  EMPTY_FILTERS,
  hasActiveFilters,
  type ProblemFilters as Filters,
} from "@/lib/problem-filters";

export default function ProblemFilters({
  filters,
  onChange,
  statusCounts,
  shownCount,
  totalCount,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  statusCounts: Record<Status, number>;
  shownCount: number;
  totalCount: number;
}) {
  const isFiltering = hasActiveFilters(filters);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Filter problems"
          placeholder="Filter by title or number"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="pl-8"
        />
      </div>

      <ToggleGroup
        type="multiple"
        variant="outline"
        aria-label="Difficulty"
        value={filters.difficulties}
        onValueChange={(value) =>
          onChange({ ...filters, difficulties: value as ProblemDifficulty[] })
        }
        className="flex-wrap"
      >
        {DIFFICULTIES.map((difficulty) => (
          <ToggleGroupItem key={difficulty} value={difficulty}>
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", DIFFICULTY_DOT_CLASS[difficulty])}
            />
            {difficulty}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />

      <ToggleGroup
        type="multiple"
        variant="outline"
        aria-label="Status"
        value={filters.statuses}
        onValueChange={(value) =>
          onChange({ ...filters, statuses: value as Status[] })
        }
        className="flex-wrap"
      >
        {STATUSES.map((status) => (
          <ToggleGroupItem key={status} value={status}>
            {STATUS_LABELS[status]}
            <span className="font-mono text-xs text-muted-foreground">
              {statusCounts[status]}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {isFiltering && (
        <Button variant="ghost" onClick={() => onChange(EMPTY_FILTERS)}>
          Reset
          <X />
        </Button>
      )}

      <p className="ml-auto text-sm text-muted-foreground">
        {isFiltering
          ? `Showing ${shownCount} of ${totalCount}`
          : pluralize(totalCount, "problem")}
      </p>
    </div>
  );
}
