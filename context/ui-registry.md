# UI Registry — srdtube

বিদ্যমান কম্পোনেন্ট। নতুন কিছু বানানোর আগে এখানে দেখুন — একই কাজের দ্বিতীয়
কম্পোনেন্ট বানাবেন না।

## `NavTabs` — `app/components/NavTabs.tsx`

দুই টুলের মাঝে সুইচ। `usePathname()` দিয়ে কোনটা নির্বাচিত ঠিক করে,
`aria-selected` বসায়। `trailingSlash: true` চালু, তাই তুলনার আগে দুই পাশের
স্ল্যাশ ছেঁটে নেওয়া হয়। **নতুন টুল যোগ করলে `TABS` অ্যারেতে একটা সারি।**

## `ApiKeyField` — `app/components/ApiKeyField.tsx`

Controlled password ইনপুট + নিচে একটা `t-caption` যা বলে এখন shared key
চলছে না ইউজারের নিজেরটা। state নিজে রাখে না — `useApiKey()` রাখে।

## `ResultsTable<T>` — `app/components/ResultsTable.tsx`

Generic sortable টেবিল। **প্রজেক্টের একমাত্র টেবিল** — নতুন টেবিল বানাবেন না,
নতুন `Column<T>` দিন।

```ts
type Column<T> = {
  key: string;
  label: string;
  cell: (row: T) => React.ReactNode;   // যা দেখা যায়
  sortValue?: (row: T) => number | string;  // যা দিয়ে sort হয়; নেই = unsortable
  align?: "start" | "end";
};
```

Sort state ভেতরেই থাকে (asc → desc → none)। rows খালি হলে `emptyLabel`।

## `videoColumns` — `app/components/videoColumns.tsx`

`VideoRow`-এর কলাম শেলফ। রপ্তানি: `VIDEO_COLUMNS` (search) ও
`PLAYLIST_COLUMNS` (playlist — সাথে Comments)। **কোনো কলামের চেহারা
বদলাতে হলে এখানে, দুই ভিউয়ে নয়।** `countColumn()` helper তিনটে count
কলামই বানায়।

## `ResultsPanel` — `app/components/ResultsPanel.tsx`

ফর্মের নিচের পুরো অংশ: error callout / "Fetching…" / count line + টেবিল +
"Load 50 more"। দুই ভিউ এটাই ব্যবহার করে, তাই লোডিং-এরর-খালি অবস্থার
চেহারা এক জায়গায়।

## `SearchView` / `PlaylistView` — `app/components/`

প্রতিটা টুলের ফর্ম + wiring। দুটোরই আকার এক:
`useApiKey()` → ফর্ম state → `useResults(fetchPage)` → `ResultsPanel`।
সাবমিটের সময় মানগুলো একটা `useRef`-এ জমা হয়, যাতে সার্চের পর ফর্মে টাইপ
করলে "Load more" আগের প্রশ্নটাই চালিয়ে যায়।

## হুক

| হুক | কাজ |
|---|---|
| `useApiKey()` — `app/lib/useApiKey.ts` | `localStorage`-এ key, `useSyncExternalStore` দিয়ে (hydration-safe, cross-tab)। দেয় `apiKey`, `setApiKey`, `effectiveKey`, `usingFallback`। |
| `useResults(fetchPage)` — `app/lib/useResults.ts` | paged results: `rows`, `status`, `error`, `hasMore`, `load`, `loadMore`, `reset`। পুরনো in-flight রিকোয়েস্ট নতুনটাকে চাপা দিতে পারে না (runId)। |

## `not-found` — `app/not-found.tsx`

থিমে আঁকা 404। **এই ফাইলটা না থাকলে** Next তার নিজের 404 দেয়, যেটা একটা
inline `body { background: #fff }` পাঠায় এবং `surface-app`-এর উপর দিয়ে
সাদা রং চড়িয়ে দেয় — হেডার গাঢ়, নিচের সব সাদা। মুছবেন না।

## এখনো নেই

modal/overlay, toast, skeleton, chart, ভিডিও প্রিভিউ। দরকার হলে আগে
`ui-tokens.md`-এ টোকেন, তারপর role class, তারপর কম্পোনেন্ট।
