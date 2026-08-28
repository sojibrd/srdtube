# srdtube

Two small YouTube tools on one page: search videos by keyword and upload-date
range, or load a playlist — then sort the results by length, upload date,
views, likes or comments.

**Live:** https://sojibrd.github.io/srdtube/

| Route | Tool |
|---|---|
| `/` | Video Search — keyword + date range |
| `/playlist` | Playlist — a playlist URL or id |

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, static export
→ GitHub Pages. No server: every YouTube API call runs in the browser.

## API key

The app ships with a shared key so it works out of the box, but that key's
daily quota is shared by every visitor. Paste your own
[YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
key into the field and it is remembered in that browser only.

A search costs 100 quota units against a 10,000/day default, so pages are
loaded on demand ("Load 50 more") rather than fetched in a loop.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000 — the /srdtube basePath is production-only
npm run build   # static export into out/
```

Pushing to `master` deploys via `.github/workflows/deploy.yml`.

## History

This repo used to hold a jQuery + DataTables page, split across the branches
`master`, `youtube-video-search` and `youtube-playlist`. Both tools now live
here; `master` is the only active branch.
