<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# srdtube

দুটো YouTube টুল এক Next.js সাইটে: `/` = Video Search, `/playlist` = Playlist।
Static export → GitHub Pages (`basePath: "/srdtube"`)।

**কোড লেখার আগে পড়ুন:**

| # | ফাইল |
|---|---|
| 1 | `context/project-overview.md` |
| 2 | `context/ui-tokens.md` |
| 3 | `context/ui-rules.md` |
| 4 | `context/ui-registry.md` |

**অলঙ্ঘনীয়:**

- সব YouTube fetch শুধু `app/lib/youtube.ts`-এ।
- details সবসময় ব্যাচে (`videos.list`, ৫০ id একসাথে); প্রতি ভিডিওতে আলাদা কল নয়।
- অটো-পেজিনেশন নেই — পরের পেজ ইউজারের ক্লিকে (`search.list` = ১০০ quota unit)।
- Theme contract: কম্পোনেন্টে কোনো ভিজ্যুয়াল ক্লাস নয়, Tailwind শুধু লেআউট।
  একমাত্র ব্যতিক্রম `.data-table`। সাইট dark-only।
- টেবিলে যা দেখানো হয় ≠ যা দিয়ে sort হয় (`cell` vs `sortValue`)।
- সব কাজ `master` ব্রাঞ্চে।
