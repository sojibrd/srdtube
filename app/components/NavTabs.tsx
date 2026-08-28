"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Video Search" },
  { href: "/playlist", label: "Playlist" },
];

export default function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2" aria-label="Tools">
      {TABS.map((tab) => {
        // `trailingSlash` is on, so the live pathname carries one.
        const selected = pathname.replace(/\/+$/, "") === tab.href.replace(/\/+$/, "");

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="tab px-3 py-1.5"
            aria-current={selected ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
