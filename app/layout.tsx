import type { Metadata } from "next";
import { Barlow_Semi_Condensed, JetBrains_Mono } from "next/font/google";
import NavTabs from "./components/NavTabs";
import "./globals.css";

/**
 * The font shelf. Families are declared once here; the theme decides which
 * role gets which family through `--t-font-sans` / `--t-font-mono`. Adding a
 * family no theme uses yet is the only reason to edit this file.
 */
const condensed = Barlow_Semi_Condensed({
  variable: "--font-condensed",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "srdtube — YouTube search & playlist sorting",
    template: "%s — srdtube",
  },
  description:
    "Search YouTube by keyword and date range, or load a playlist, and sort the results by length, upload date, views, likes or comments.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${condensed.variable} ${mono.variable} antialiased`}
    >
      <body className="surface-app min-h-dvh">
        <header className="seam-b">
          <div className="mx-auto max-w-6xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h1 className="t-title text-xl">srdtube</h1>
              <p className="t-label">YouTube search &amp; playlist sorting</p>
            </div>
            <NavTabs />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
