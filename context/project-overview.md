# srdtube — প্রজেক্ট ওভারভিউ

## কী

দুটো ছোট YouTube টুল, একটাই স্ট্যাটিক সাইটে:

| রুট | টুল | ইনপুট |
|---|---|---|
| `/` | Video Search | keyword + upload date range |
| `/playlist` | Playlist | playlist URL বা bare id |

দুটোরই আউটপুট একই জিনিস — একটা **sortable results table**। এটাই অ্যাপের
মূল কাজ: YouTube যে ক্রমে দেয় সেটা নয়, ইউজার যে কলামে চায় সেই ক্রমে সাজানো।

**লাইভ:** https://sojibrd.github.io/srdtube/

## স্ট্যাক

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
`output: "export"` → GitHub Pages (`basePath: "/srdtube"`)।

## আর্কিটেকচার

```
app/
  layout.tsx            হেডার + NavTabs; ফন্ট শেলফ এখানেই
  page.tsx              → SearchView
  playlist/page.tsx     → PlaylistView
  not-found.tsx         থিমে আঁকা 404 (না থাকলে Next সাদা পেজ দেয়)
  globals.css           theme contract — role class
  themes/
    control-room.css    একমাত্র থিম; সব ভিজ্যুয়াল মান এখানে
  lib/
    youtube.ts          API client — একমাত্র জায়গা যেখানে fetch হয়
    format.ts           duration/count/date ফরম্যাট, playlist id extract
    useApiKey.ts        localStorage-এ key (useSyncExternalStore)
    useResults.ts       paged results state — দুই টুলেই এক
  components/
    NavTabs, ApiKeyField, ResultsPanel, ResultsTable, videoColumns
    SearchView, PlaylistView
```

**server component:** `layout.tsx`, `page.tsx`, `playlist/page.tsx` — শুধু
metadata আর wiring। বাকি সব `"use client"`, কারণ static export-এ কোনো server
নেই; প্রতিটা API কল ব্রাউজার থেকেই যায়।

## অলঙ্ঘনীয় সিদ্ধান্ত

1. **কোনো fetch `lib/youtube.ts`-এর বাইরে নয়।** কম্পোনেন্ট শুধু ফাংশন ডাকে।
2. **Details সবসময় ব্যাচে।** `videos.list` একবারে ৫০টা id নেয় (খরচ ১ unit)।
   প্রতি ভিডিওতে আলাদা কল — কখনো না। পুরনো jQuery কোড এটাই করত (এবং
   একই কল দুবার করত)।
3. **কোনো অটো-পেজিনেশন নেই।** `search.list`-এর খরচ ১০০ unit, দৈনিক কোটা
   ১০,০০০। পরের পেজ ইউজারের ক্লিকে।
4. **যা দেখানো হয় ≠ যা দিয়ে sort হয়।** প্রতিটা কলামে `cell` আর `sortValue`
   আলাদা (`ResultsTable`)। duration সেকেন্ডে, count সংখ্যায়, date
   টাইমস্ট্যাম্পে sort হয়।
5. **Engagement সবসময় client-side।** YouTube-এর `order=` মানে
   `relevance` / `viewCount` / `rating` / `date` — **`likeCount` নেই**
   (400 দেয়)। তাই `likes ÷ views` জাতীয় কোনো অনুপাতে সার্ভার সাজাতে পারে
   না; Engagement কলাম শুধু যতগুলো লোড হয়েছে ততগুলোর উপর কাজ করে।
6. **Theme contract** — `context/ui-tokens.md` দেখুন। কম্পোনেন্টে কোনো
   ভিজ্যুয়াল ক্লাস নয়।

## basePath

`basePath: "/srdtube"` **শুধু production build-এ**। লোকালে `npm run dev`
`http://localhost:3000/`-এ খোলে, সরাসরি Video Search-এ — ল্যান্ডিং পেজ
ওটাই।

এর দাম: হাতে লেখা কোনো ভুল path dev-এ কাজ করবে কিন্তু Pages-এ ভাঙবে।
তাই — **সবসময় `<Link>` / `next/image` ব্যবহার করুন** (দুটোই নিজে থেকে
prefix বসায়), আর `/_next/...` বা `/foo.png` কখনো হাতে লিখবেন না। path
সংক্রান্ত কিছু ছুঁলে build করে `out/`-এ `/srdtube/` prefix আছে কিনা দেখে
নিন।

## API key

কোডে একটা fallback key আছে (`FALLBACK_API_KEY`) যাতে সাইট খুলেই কাজ করে।
ইউজার নিজের key দিলে সেটা `localStorage`-এ (`srdtube.apiKey`) থাকে এবং
fallback-কে override করে। Static export-এ key লুকানোর কোনো জায়গা নেই —
এটা জেনেবুঝে নেওয়া সিদ্ধান্ত।

## ইতিহাস

আগে এটা ছিল vanilla HTML + jQuery + DataTables + Bootstrap, তিনটা ব্রাঞ্চে
ছড়ানো — `master` ≈ `youtube-video-search` (সার্চ টুল), আর
`youtube-playlist` (আলাদা playlist টুল)। ২০২৬-০৮-২৮-এ দুটোই এই Next.js
অ্যাপে একত্র হয়েছে। **এখন থেকে সব কাজ শুধু `master`-এ**; বাকি দুটো ব্রাঞ্চ
অবসরপ্রাপ্ত (মোছা হয়নি, শুধু আর ছোঁয়া হবে না)।
