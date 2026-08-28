# Theme Contract — srdtube

`system_design` ও `dsa_prep`-এর মতোই: সব ভিজ্যুয়াল সিদ্ধান্ত CSS-এ,
কম্পোনেন্টে নয়।

## থিম বদলানো

```css
/* app/globals.css */
@import "./themes/control-room.css";
```

**এই একটা লাইনই** পুরো সাইটের চেহারা ঠিক করে। বর্তমান থিম:
`control-room.css` (একমাত্র থিম)। সাইট **dark-only** — `dark:` variant বা
theme toggle লিখবেন না। light চাইলে সেটা নতুন একটা থিম ফাইল, কোড পরিবর্তন নয়।

**নতুন থিম লিখতে:** `app/themes/<name>.css`-এ একটা `:root {}` ব্লক, নিচের সব
`--t-*` সেট করে। তারপর উপরের লাইনটা বদলান। **কম্পোনেন্টে কখনো হাত দেবেন না।**

## অলঙ্ঘনীয় নিয়ম

1. **কম্পোনেন্টে কোনো ভিজ্যুয়াল সিদ্ধান্ত নয়** — রঙ তো নয়ই, `rounded-*`,
   `shadow-*`, `border-*`, `uppercase`, `tracking-*`, `font-bold` কোনোটাই না।
2. **Tailwind শুধু লেআউট** — `flex`, `grid`, `gap`, `max-w-*`, `px-*`,
   `truncate`, `overflow-*`। চেহারার জন্য নয়।
3. **কম্পোনেন্ট বলে *কী*, থিম বলে *কেমন*** — `aria-selected`, `data-sort`,
   `data-align` অবস্থা জানায়; দেখতে কেমন হবে সেটা CSS ঠিক করে।
4. **নতুন ভিজ্যুয়াল দরকার হলে আগে কনট্র্যাক্টে টোকেন যোগ করুন**, তারপর
   থিম ফাইলে মান দিন।

**একমাত্র ব্যতিক্রম — `.data-table`।** একটা results grid গোটা `<th>`/`<td>`-র
দেয়াল; প্রতিটা সেলে role class বসালে সেটা element যা বলছে তার বেশি কিছু বলে
না। তাই এই একটা ব্লক raw element স্টাইল করে — কিন্তু `.data-table`-এর ভেতরে
scoped, আর সব মান `--t-table-*` থেকে পড়ে।

## Role classes (`app/globals.css`)

| শ্রেণি | ক্লাস |
|---|---|
| Surface | `surface-app` `surface-panel` `surface-raised` `surface-well` |
| Text | `t-title` `t-label` `t-body` `t-caption` `t-mono` `t-strong` `t-accent` `t-muted` `t-ok` `t-quote` `t-link` |
| Seam | `seam` `seam-b` `seam-b-heavy` `seam-t` |
| Control | `control` + `control--primary` `control--alert` `control--quiet`; `segment-group` / `segment` |
| Chip | `chip` + `chip--accent` `chip--alert` `chip--ok` |
| Callout | `callout` + `callout--accent` `callout--alert` |
| Nav | `tab` `row` |
| **Input** | **`input`** — recessed well যাতে ইউজার মান বসায় |
| **Table** | **`data-table`** (scoped raw elements) + **`sort-head`** |

### State attributes

| অ্যাট্রিবিউট | কোথায় | অর্থ |
|---|---|---|
| `aria-selected` | `.tab` | নির্বাচিত টুল |
| `aria-sort` | `<th>` | কোন কলামে sort হচ্ছে (a11y-র জন্য) |
| `data-sort` | `.sort-head` | একই তথ্য, কিন্তু CSS-এর জন্য — `aria-sort` `button` role-এ বৈধ নয় |
| `data-align` | `.sort-head`, `<td>` | `end` হলে ডানে + tabular mono |

## টোকেন গ্রুপ (`app/themes/control-room.css`)

Type · Motion · App · Text · Depth · Surfaces · Seams · Controls · Chips ·
Callouts · Tabs · Scrollbars · **Inputs** · **Links** · **Data table**।

srdtube-এ নতুন যোগ হওয়া গ্রুপ তিনটি:

- `--t-input-*` — bg, border (+hover/focus), radius, shadow (+focus), fg,
  placeholder, family, size, padding, `--t-input-picker-filter`
  (ব্রাউজারের ক্যালেন্ডার আইকন কালো আসে; ফিল্টারে readout ইঙ্কে টানা হয়)।
- `--t-link-*` — `fg`, `fg-hover`।
- `--t-table-*` — size, fg, head bg/rule, row rule, row hover, padding;
  সাথে `--t-sort-none-glyph` / `-asc-` / `-desc-` (তীরের আকারও থিমের কথা)।
