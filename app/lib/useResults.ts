"use client";

import { useCallback, useRef, useState } from "react";
import { YouTubeError, type Page, type VideoRow } from "./youtube";

/**
 * Paged results, shared by both tools.
 *
 * `load` starts a fresh run and replaces everything; `loadMore` appends the
 * next page. Neither ever loops on its own — every extra page costs quota, so
 * it takes a click. A stale in-flight request cannot overwrite a newer one:
 * each run carries a token, and a reply with the wrong token is dropped.
 */
export function useResults(fetchPage: (pageToken?: string) => Promise<Page<VideoRow>>) {
  const [rows, setRows] = useState<VideoRow[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "more" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const runId = useRef(0);

  const run = useCallback(
    async (pageToken: string | undefined, append: boolean) => {
      const id = ++runId.current;
      setStatus(append ? "more" : "loading");
      setError(null);
      if (!append) {
        setRows([]);
        setNextPageToken(null);
        setTotalResults(0);
      }

      try {
        const page = await fetchPage(pageToken);
        if (id !== runId.current) return;

        setRows((current) => (append ? [...current, ...page.items] : page.items));
        setNextPageToken(page.nextPageToken);
        setTotalResults(page.totalResults);
        setStatus("ready");
      } catch (cause) {
        if (id !== runId.current) return;

        setError(
          cause instanceof YouTubeError
            ? cause.message
            : "Something went wrong. Try again."
        );
        setStatus("error");
      }
    },
    [fetchPage]
  );

  const load = useCallback(() => run(undefined, false), [run]);
  const loadMore = useCallback(() => {
    if (nextPageToken) void run(nextPageToken, true);
  }, [nextPageToken, run]);

  const reset = useCallback(() => {
    runId.current += 1;
    setRows([]);
    setNextPageToken(null);
    setTotalResults(0);
    setError(null);
    setStatus("idle");
  }, []);

  return {
    rows,
    error,
    status,
    totalResults,
    hasMore: nextPageToken !== null,
    load,
    loadMore,
    reset,
  };
}
