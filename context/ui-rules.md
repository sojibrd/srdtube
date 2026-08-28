# UI/UX নিয়ম — srdtube

## লেআউট

- এক কলাম, `max-w-6xl mx-auto px-6`। হেডার (`seam-b`) + `<main>`।
- ফর্ম একটা `surface-panel`; ভেতরে `grid gap-5 md:grid-cols-2`।
  মোবাইলে এক কলাম।
- টেবিল `surface-well`-এর ভেতরে, `overflow-x-auto` + `max-h-[70vh]`
  `overflow-y-auto`। **পেজ কখনো আড়াআড়ি স্ক্রল করবে না** — টেবিল নিজের
  ভেতরে করবে।
- হেডার row `position: sticky` — ৫০+ সারি স্ক্রল করার সময় কলামের নাম
  চোখের সামনে থাকে।

## ফর্ম

- প্রতিটা ইনপুটে `t-label` + `input`, `htmlFor`/`id` মেলানো।
- API key ফিল্ড `type="password"`, `autoComplete="off"` — কাঁধের উপর দিয়ে
  কেউ দেখে ফেলার জিনিস নয়।
- সাবমিট বাটন খালি ইনপুটে বা লোডিং-এ `disabled`।
- বাটনের পাশে একটা `t-caption` — কাজটার দাম কত (quota) বা কী কাজ করবে না
  (private playlist) তা আগেই বলা।

## অবস্থা (state) দেখানো

| অবস্থা | কী দেখাবে |
|---|---|
| `idle` | টেবিলের জায়গায় `t-caption` — "Search for videos to fill this table." |
| `loading` | `t-label` — "Fetching…" (স্পিনার নেই; থিমে কিছু ঘোরে না) |
| `ready` + খালি | "Nothing matched." |
| `more` | "Load 50 more" বাটন `disabled`, লেখা "Loading…" |
| `error` | `callout callout--alert` — `t-label` শিরোনাম + Google-এর নিজের বাক্য |

**Error-এ Google-এর মেসেজ হুবহু দেখান।** "Something went wrong" ইউজারকে
কিছু বলে না; "The request cannot be completed because you have exceeded your
quota" বলে ঠিক কী করতে হবে।

## টেবিল

- **সব কলাম sortable**, হেডারে ক্লিক → asc → desc → none। তৃতীয় ক্লিকে
  API-র নিজের ক্রম ফিরে আসে (playlist-এ ওই ক্রমটাই তথ্য)।
- সংখ্যার কলামে `data-align="end"` — ডানে, mono, `tabular-nums`। অঙ্ক
  না মিললে চোখে তুলনা হয় না।
- **অনুপস্থিত মান `—`, `0` নয়।** uploader likes লুকালে সেটা "শূন্য like"
  নয়। Sort-এ এরা `-1` পায়, তাই সব আসল মানের নিচে থাকে।
- শিরোনাম `t-link`, নতুন ট্যাবে (`target="_blank" rel="noreferrer"`)।
- টেবিলের ভেতরে আলাদা পেজিনেশন নেই, global filter নেই — ডেটা আসেই
  "Load more"-এর ধাপে; দুই স্তরের পেজিং বিভ্রান্তিকর।

## ভাষা

UI ইংরেজিতে। `context/` ডক আর কমিট বাংলায়।
