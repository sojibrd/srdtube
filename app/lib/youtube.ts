/**
 * YouTube Data API v3 client.
 *
 * Everything here runs in the browser: the site is a static export, so there
 * is no server to hide a key behind. The key is therefore whatever the user
 * typed, falling back to the one baked into `FALLBACK_API_KEY`.
 *
 * Cost discipline — the whole reason this file exists rather than a fetch per
 * component. `search.list` costs 100 quota units per call against a default
 * daily budget of 10,000; `videos.list` costs 1 and accepts up to 50 ids at
 * once. So details are always fetched in ONE batched call per page of
 * results, never per video.
 */

import { parseDurationSeconds, toCount } from "./format";

/** Shipped so the app works before the user has a key of their own. */
export const FALLBACK_API_KEY = "AIzaSyCE-3a0xnoM8lVjmojr8TAMpaEl94mEPag";

const API = "https://www.googleapis.com/youtube/v3";

/** The API caps a page at 50 no matter what we ask for. */
export const PAGE_SIZE = 50;

export type VideoRow = {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  durationSeconds: number;
  views: number | null;
  likes: number | null;
  comments: number | null;
};

export type Page<T> = {
  items: T[];
  nextPageToken: string | null;
  /** What the API says exists in total; not always exact for search. */
  totalResults: number;
};

/** An API failure the UI can show verbatim. */
export class YouTubeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YouTubeError";
  }
}

async function get<T>(
  path: string,
  params: Record<string, string | undefined>
): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(`${API}/${path}?${query}`);
  } catch {
    throw new YouTubeError("Could not reach the YouTube API. Check the network.");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // Google's error body is where the useful sentence lives — a bad key, an
    // exhausted quota and a private playlist all arrive as plain HTTP errors.
    const reason = body?.error?.message ?? `Request failed (${response.status}).`;
    throw new YouTubeError(reason);
  }

  return body as T;
}

/* --- Raw response shapes (only the fields we read) ---------------------- */

type SearchResponse = {
  items: { id: { videoId?: string } }[];
  nextPageToken?: string;
  pageInfo?: { totalResults?: number };
};

type PlaylistItemsResponse = {
  items: { snippet: { resourceId?: { videoId?: string } } }[];
  nextPageToken?: string;
  pageInfo?: { totalResults?: number };
};

type VideosResponse = {
  items: {
    id: string;
    snippet: { title: string; channelTitle: string; publishedAt: string };
    contentDetails: { duration: string };
    statistics: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
  }[];
};

/**
 * The one call that turns ids into rows. Title, date, duration and all three
 * counts arrive together, so nothing else needs a second request.
 */
async function fetchVideoDetails(
  ids: string[],
  apiKey: string
): Promise<VideoRow[]> {
  if (ids.length === 0) return [];

  const data = await get<VideosResponse>("videos", {
    part: "snippet,contentDetails,statistics",
    id: ids.join(","),
    key: apiKey,
  });

  const byId = new Map<string, VideoRow>();
  for (const item of data.items) {
    byId.set(item.id, {
      videoId: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      durationSeconds: parseDurationSeconds(item.contentDetails?.duration),
      views: toCount(item.statistics?.viewCount),
      likes: toCount(item.statistics?.likeCount),
      comments: toCount(item.statistics?.commentCount),
    });
  }

  // Preserve the order the caller asked for; `videos.list` does not promise it,
  // and for a playlist the order IS the data.
  return ids.map((id) => byId.get(id)).filter((row): row is VideoRow => !!row);
}

/**
 * What YouTube itself sorts the result set by, before we ever see it.
 *
 * This is NOT the same as sorting the table: `order` decides WHICH 50 videos
 * come back out of thousands; the table only reorders the 50 in hand. There
 * is deliberately no `likeCount` here — the API rejects it (400), which is
 * why engagement is computed client-side.
 */
export type SearchOrder = "relevance" | "viewCount" | "rating" | "date";

export const SEARCH_ORDERS: { value: SearchOrder; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "viewCount", label: "Views" },
  { value: "rating", label: "Rating" },
  { value: "date", label: "Upload date" },
];

export type SearchParams = {
  query: string;
  publishedAfter?: string; // YYYY-MM-DD
  publishedBefore?: string; // YYYY-MM-DD
  apiKey: string;
  pageToken?: string;
  order?: SearchOrder;
};

export async function searchVideos({
  query,
  publishedAfter,
  publishedBefore,
  apiKey,
  pageToken,
  order,
}: SearchParams): Promise<Page<VideoRow>> {
  const data = await get<SearchResponse>("search", {
    part: "snippet",
    type: "video",
    q: query,
    order,
    maxResults: String(PAGE_SIZE),
    key: apiKey,
    pageToken,
    publishedAfter: publishedAfter ? `${publishedAfter}T00:00:00Z` : undefined,
    publishedBefore: publishedBefore ? `${publishedBefore}T23:59:59Z` : undefined,
  });

  const ids = data.items
    .map((item) => item.id?.videoId)
    .filter((id): id is string => !!id);

  return {
    items: await fetchVideoDetails(ids, apiKey),
    nextPageToken: data.nextPageToken ?? null,
    totalResults: data.pageInfo?.totalResults ?? 0,
  };
}

export async function fetchPlaylistPage(
  playlistId: string,
  apiKey: string,
  pageToken?: string
): Promise<Page<VideoRow>> {
  const data = await get<PlaylistItemsResponse>("playlistItems", {
    part: "snippet",
    playlistId,
    maxResults: String(PAGE_SIZE),
    key: apiKey,
    pageToken,
  });

  const ids = data.items
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter((id): id is string => !!id);

  return {
    items: await fetchVideoDetails(ids, apiKey),
    nextPageToken: data.nextPageToken ?? null,
    totalResults: data.pageInfo?.totalResults ?? 0,
  };
}
