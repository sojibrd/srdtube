"use client";

import { useCallback, useRef, useState } from "react";
import ApiKeyField from "./ApiKeyField";
import ResultsPanel from "./ResultsPanel";
import { PLAYLIST_COLUMNS } from "./videoColumns";
import { extractPlaylistId } from "../lib/format";
import { useApiKey } from "../lib/useApiKey";
import { useResults } from "../lib/useResults";
import { fetchPlaylistPage } from "../lib/youtube";

export default function PlaylistView() {
  const { apiKey, setApiKey, effectiveKey, usingFallback } = useApiKey();

  const [url, setUrl] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const submitted = useRef({ playlistId: "", key: "" });

  const fetchPage = useCallback(
    (pageToken?: string) =>
      fetchPlaylistPage(submitted.current.playlistId, submitted.current.key, pageToken),
    []
  );

  const results = useResults(fetchPage);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const playlistId = extractPlaylistId(url);
    if (!playlistId) {
      setInputError("That does not look like a playlist URL or id.");
      results.reset();
      return;
    }

    setInputError(null);
    submitted.current = { playlistId, key: effectiveKey };
    void results.load();
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="surface-panel p-5 flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="t-label" htmlFor="playlist">
              Playlist URL
            </label>
            <input
              id="playlist"
              type="text"
              className="input"
              placeholder="https://www.youtube.com/playlist?list=…"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              aria-invalid={inputError !== null}
            />
            {inputError && <p className="t-caption">{inputError}</p>}
          </div>

          <ApiKeyField
            value={apiKey}
            onChange={setApiKey}
            usingFallback={usingFallback}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="control control--primary px-4 py-2"
            disabled={!url.trim() || results.status === "loading"}
          >
            Load playlist
          </button>
          <p className="t-caption">Private playlists cannot be read.</p>
        </div>
      </form>

      <ResultsPanel
        columns={PLAYLIST_COLUMNS}
        rows={results.rows}
        status={results.status}
        error={results.error}
        totalResults={results.totalResults}
        hasMore={results.hasMore}
        onLoadMore={results.loadMore}
        idleLabel="Paste a playlist URL to fill this table."
      />
    </div>
  );
}
