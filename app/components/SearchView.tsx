"use client";

import { useCallback, useRef, useState } from "react";
import ApiKeyField from "./ApiKeyField";
import ResultsPanel from "./ResultsPanel";
import { VIDEO_COLUMNS } from "./videoColumns";
import { useApiKey } from "../lib/useApiKey";
import { useResults } from "../lib/useResults";
import { searchVideos } from "../lib/youtube";

export default function SearchView() {
  const { apiKey, setApiKey, effectiveKey, usingFallback } = useApiKey();

  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // The submitted values, frozen at submit time. Typing in the form after a
  // search must not change what "Load more" asks for.
  const submitted = useRef({ query: "", from: "", to: "", key: "" });

  const fetchPage = useCallback(
    (pageToken?: string) =>
      searchVideos({
        query: submitted.current.query,
        publishedAfter: submitted.current.from || undefined,
        publishedBefore: submitted.current.to || undefined,
        apiKey: submitted.current.key,
        pageToken,
      }),
    []
  );

  const results = useResults(fetchPage);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;

    submitted.current = { query: query.trim(), from, to, key: effectiveKey };
    void results.load();
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="surface-panel p-5 flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="t-label" htmlFor="query">
              Search
            </label>
            <input
              id="query"
              type="text"
              className="input"
              placeholder="Keywords"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <ApiKeyField
            value={apiKey}
            onChange={setApiKey}
            usingFallback={usingFallback}
          />

          <div className="flex flex-col gap-1.5">
            <label className="t-label" htmlFor="from">
              Uploaded from
            </label>
            <input
              id="from"
              type="date"
              className="input"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="t-label" htmlFor="to">
              Uploaded to
            </label>
            <input
              id="to"
              type="date"
              className="input"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="control control--primary px-4 py-2"
            disabled={!query.trim() || results.status === "loading"}
          >
            Search
          </button>
          <p className="t-caption">A search costs 100 quota units.</p>
        </div>
      </form>

      <ResultsPanel
        columns={VIDEO_COLUMNS}
        rows={results.rows}
        status={results.status}
        error={results.error}
        totalResults={results.totalResults}
        hasMore={results.hasMore}
        onLoadMore={results.loadMore}
        idleLabel="Search for videos to fill this table."
      />
    </div>
  );
}
