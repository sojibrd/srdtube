"use client";

import { useMemo, useState } from "react";

/**
 * The printout. Both tools render this; only the column list differs.
 *
 * A column separates what is SHOWN from what is SORTED: `cell` returns what
 * the eye reads, `sortValue` returns the number or string the comparison runs
 * on. That split is the whole point — duration sorts on seconds, counts on
 * numbers, dates on timestamps, none of them on their formatted text.
 */
export type Column<T> = {
  key: string;
  label: string;
  cell: (row: T) => React.ReactNode;
  /** Omit to make the column unsortable (a link column, say). */
  sortValue?: (row: T) => number | string;
  /** Figures are right-aligned and set in mono; text is not. */
  align?: "start" | "end";
};

type SortState = { key: string; direction: "asc" | "desc" } | null;

export default function ResultsTable<T>({
  columns,
  rows,
  rowKey,
  emptyLabel = "No results yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;

    const column = columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;

    const direction = sort.direction === "asc" ? 1 : -1;
    const { sortValue } = column;

    return [...rows].sort((a, b) => {
      const left = sortValue(a);
      const right = sortValue(b);

      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * direction;
      }
      return String(left).localeCompare(String(right)) * direction;
    });
  }, [rows, sort, columns]);

  // Third click clears the sort and hands back the order the API gave us —
  // for a playlist, that original order is itself meaningful.
  const toggle = (key: string) =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });

  if (rows.length === 0) {
    return <p className="t-caption px-1 py-6">{emptyLabel}</p>;
  }

  return (
    <div className="surface-well overflow-x-auto overflow-y-auto max-h-[70vh]">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => {
              const sortDirection =
                sort?.key === column.key
                  ? sort.direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={column.sortValue ? sortDirection : undefined}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      className="sort-head"
                      data-align={column.align}
                      data-sort={sortDirection}
                      onClick={() => toggle(column.key)}
                    >
                      {column.label}
                    </button>
                  ) : (
                    <span className="sort-head" data-align={column.align}>
                      {column.label}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} data-align={column.align}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
