"use client";

import type { Column } from "./ResultsTable";
import {
  formatCount,
  formatDate,
  formatDuration,
  videoUrl,
} from "../lib/format";
import type { VideoRow } from "../lib/youtube";

/**
 * The column shelf. Both tools pick from here, so a change to how a duration
 * or a count reads happens once. Each column pairs the display cell with the
 * raw value it sorts on.
 */
const title: Column<VideoRow> = {
  key: "title",
  label: "Title",
  sortValue: (row) => row.title.toLowerCase(),
  cell: (row) => (
    <a
      className="t-link"
      href={videoUrl(row.videoId)}
      target="_blank"
      rel="noreferrer"
    >
      {row.title}
    </a>
  ),
};

const channel: Column<VideoRow> = {
  key: "channel",
  label: "Channel",
  sortValue: (row) => row.channelTitle.toLowerCase(),
  cell: (row) => row.channelTitle,
};

const published: Column<VideoRow> = {
  key: "published",
  label: "Uploaded",
  align: "end",
  sortValue: (row) => Date.parse(row.publishedAt),
  cell: (row) => formatDate(row.publishedAt),
};

const duration: Column<VideoRow> = {
  key: "duration",
  label: "Length",
  align: "end",
  sortValue: (row) => row.durationSeconds,
  cell: (row) => formatDuration(row.durationSeconds),
};

/** A hidden count sorts below every real one rather than as a zero. */
const countColumn = (
  key: "views" | "likes" | "comments",
  label: string
): Column<VideoRow> => ({
  key,
  label,
  align: "end",
  sortValue: (row) => row[key] ?? -1,
  cell: (row) => formatCount(row[key]),
});

export const VIDEO_COLUMNS: Column<VideoRow>[] = [
  title,
  channel,
  duration,
  published,
  countColumn("views", "Views"),
  countColumn("likes", "Likes"),
];

export const PLAYLIST_COLUMNS: Column<VideoRow>[] = [
  title,
  channel,
  duration,
  published,
  countColumn("views", "Views"),
  countColumn("likes", "Likes"),
  countColumn("comments", "Comments"),
];
