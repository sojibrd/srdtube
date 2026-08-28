"use client";

import ResultsTable, { type Column } from "./ResultsTable";
import type { VideoRow } from "../lib/youtube";

/**
 * Everything below a tool's form: the error line, the count, the table, and
 * the button that spends quota on the next page.
 */
export default function ResultsPanel({
  columns,
  rows,
  status,
  error,
  totalResults,
  hasMore,
  onLoadMore,
  idleLabel,
}: {
  columns: Column<VideoRow>[];
  rows: VideoRow[];
  status: "idle" | "loading" | "more" | "ready" | "error";
  error: string | null;
  totalResults: number;
  hasMore: boolean;
  onLoadMore: () => void;
  idleLabel: string;
}) {
  if (status === "error") {
    return (
      <div className="callout callout--alert p-4">
        <p className="t-label">Request failed</p>
        <p className="t-body mt-1">{error}</p>
      </div>
    );
  }

  if (status === "loading") {
    return <p className="t-label px-1 py-6">Fetching…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="t-label">
            {rows.length} loaded
            {totalResults > rows.length ? ` of about ${totalResults.toLocaleString("en-US")}` : ""}
          </p>
          <p className="t-caption">Click a column heading to sort.</p>
        </div>
      )}

      <ResultsTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.videoId}
        emptyLabel={status === "ready" ? "Nothing matched." : idleLabel}
      />

      {hasMore && (
        <button
          type="button"
          className="control px-4 py-2 self-start"
          onClick={onLoadMore}
          disabled={status === "more"}
        >
          {status === "more" ? "Loading…" : "Load 50 more"}
        </button>
      )}
    </div>
  );
}
