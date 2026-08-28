/**
 * Formatting helpers.
 *
 * Every one of these returns a *string for the eye*. The number the table
 * sorts on never passes through here — see `ResultsTable`, where each column
 * carries a `sortValue` alongside its cell. The old jQuery build sorted the
 * formatted string, which is why "10.00h" used to land above "2.50h".
 */

/** ISO 8601 duration (`PT1H2M3S`) -> seconds. Unparseable input -> 0. */
export function parseDurationSeconds(iso: string | undefined): number {
  if (!iso) return 0;
  const match = iso.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/
  );
  if (!match) return 0;

  const [, d, h, m, s] = match;
  return (
    Number(d ?? 0) * 86400 +
    Number(h ?? 0) * 3600 +
    Number(m ?? 0) * 60 +
    Math.round(Number(s ?? 0))
  );
}

/** Seconds -> `1:02:03` / `2:03`. Hours only appear when there are hours. */
export function formatDuration(seconds: number): string {
  if (!seconds) return "—";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Thousands separators. A missing count is a dash, not a zero — the API
 *  omits `likeCount` when the uploader hides it, which is not "no likes". */
export function formatCount(value: number | null): string {
  return value === null ? "—" : value.toLocaleString("en-US");
}

/** YouTube's `publishedAt` is RFC 3339; show the date, keep the clock out. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD, unambiguous
}

/** A statistics field is a string when present and absent when hidden. */
export function toCount(value: string | undefined): number | null {
  return value === undefined ? null : Number(value);
}

/**
 * Pull the playlist id out of anything the user is likely to paste: a full
 * `/playlist?list=…` URL, a `/watch?v=…&list=…` URL, or the bare id.
 */
export function extractPlaylistId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const fromQuery = trimmed.match(/[?&]list=([^&#\s]+)/i);
  if (fromQuery) return fromQuery[1];

  // A bare id: no scheme, no slashes, and shaped like a YouTube id.
  if (/^[A-Za-z0-9_-]{2,}$/.test(trimmed)) return trimmed;

  return null;
}

export const videoUrl = (videoId: string) =>
  `https://www.youtube.com/watch?v=${videoId}`;
