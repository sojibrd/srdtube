import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo from `/srdtube/`, so the production build
 * needs that prefix. Locally there is no prefix to honour — `npm run dev`
 * opens at the root, on Video Search.
 *
 * The cost of the split: a wrong `href` or a hand-written asset path works in
 * dev and breaks on Pages. Guard against it by using `<Link>` / `next/image`
 * (both prefix themselves) and never writing `/_next/...` or `/foo.png` by
 * hand — and by checking `out/` when you touch anything path-shaped.
 */
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/srdtube" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
