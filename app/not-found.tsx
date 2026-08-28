import Link from "next/link";

/**
 * Without this file Next serves its own 404, which ships an inline
 * `body { background: #fff }` and paints over the theme — the header stays
 * dark and everything below it goes white. So this page exists mostly to
 * keep that stylesheet out.
 */
export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <div className="callout callout--alert p-6 flex flex-col gap-4 items-start">
      <p className="t-label">404 — Not found</p>
      <p className="t-body">
        There is no page here. The two tools are Video Search and Playlist.
      </p>
      <div className="flex gap-3">
        <Link className="control control--primary px-4 py-2" href="/">
          Video Search
        </Link>
        <Link className="control px-4 py-2" href="/playlist">
          Playlist
        </Link>
      </div>
    </div>
  );
}
