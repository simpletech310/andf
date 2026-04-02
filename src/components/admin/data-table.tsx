"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ColumnDef<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T) => string;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T>({
  columns,
  data,
  rowKey,
  selectable = false,
  selectedRows,
  onSelectionChange,
  emptyMessage = "No data found",
  emptyDescription = "Try adjusting your search or filters.",
  pageSizeOptions = [25, 50, 100],
  defaultPageSize = 25,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const selected = selectedRows ?? new Set<string>();

  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        if (sortDir === "asc") setSortDir("desc");
        else if (sortDir === "desc") {
          setSortKey(null);
          setSortDir(null);
        }
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
      setPage(0);
    },
    [sortKey, sortDir]
  );

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pagedData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  const allPageKeysSelected =
    pagedData.length > 0 && pagedData.every((row) => selected.has(rowKey(row)));

  function toggleAll() {
    const next = new Set(selected);
    if (allPageKeysSelected) {
      pagedData.forEach((row) => next.delete(rowKey(row)));
    } else {
      pagedData.forEach((row) => next.add(rowKey(row)));
    }
    onSelectionChange?.(next);
  }

  function toggleRow(key: string) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange?.(next);
  }

  if (data.length === 0) {
    return (
      <Card hover={false}>
        <CardContent className="p-12 text-center">
          <div className="text-foreground-muted font-medium">{emptyMessage}</div>
          <div className="text-sm text-foreground-subtle mt-1">{emptyDescription}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card hover={false}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {selectable && (
                  <th className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allPageKeysSelected}
                      onChange={toggleAll}
                      className="rounded border-border"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4",
                      col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors",
                      col.className
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && (
                        <span className="text-foreground-subtle">
                          {sortKey === col.key && sortDir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : sortKey === col.key && sortDir === "desc" ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row) => {
                const key = rowKey(row);
                return (
                  <tr
                    key={key}
                    className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors"
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => toggleRow(key)}
                          className="rounded border-border"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-6 py-4", col.className)}>
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-foreground-muted">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="rounded-md bg-background-elevated border border-border px-2 py-1 text-sm text-foreground-muted"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2">
              {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sortedData.length)} of{" "}
              {sortedData.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
