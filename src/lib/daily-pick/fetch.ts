import crypto from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import type { DailyPickSource } from "@/lib/daily-pick/sources";
import type { DailyPickArticle } from "@/lib/daily-pick/types";

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toId(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function firstString(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const text = (value as { "#text"?: unknown })["#text"];
    if (typeof text === "string") return text;
  }
  return null;
}

function firstImageFromHtml(html: string | null): string | null {
  if (!html) return null;
  // Very small, non-validating extraction. Good enough for RSS snippets.
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const src = match?.[1]?.trim();
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return null;
}

function getImageUrl(item: any): string | null {
  const enclosure = item?.enclosure;
  const url = enclosure?.["@_url"] ?? enclosure?.url;
  if (typeof url === "string" && url.startsWith("http")) return url;

  const media = item?.["media:content"];
  const mediaUrl =
    (Array.isArray(media) ? media[0]?.["@_url"] : media?.["@_url"]) ?? null;
  if (typeof mediaUrl === "string" && mediaUrl.startsWith("http")) return mediaUrl;

  const thumb = item?.["media:thumbnail"];
  const thumbUrl =
    (Array.isArray(thumb) ? thumb[0]?.["@_url"] : thumb?.["@_url"]) ?? null;
  if (typeof thumbUrl === "string" && thumbUrl.startsWith("http")) return thumbUrl;

  const desc =
    firstString(item?.description) ??
    firstString(item?.summary) ??
    firstString(item?.["content:encoded"]) ??
    null;
  const firstImg = firstImageFromHtml(desc);
  if (firstImg) return firstImg;

  return null;
}

function normalizeItem(source: DailyPickSource, raw: any): DailyPickArticle | null {
  const title = firstString(raw?.title)?.trim();
  const link =
    firstString(raw?.link)?.trim() ??
    firstString(raw?.guid)?.trim() ??
    (typeof raw?.link?.["@_href"] === "string" ? raw.link["@_href"].trim() : null);

  if (!title || !link) return null;

  const desc =
    firstString(raw?.description) ??
    firstString(raw?.summary) ??
    firstString(raw?.["content:encoded"]) ??
    "";

  const excerpt = stripHtml(desc);
  const author =
    firstString(raw?.author) ??
    firstString(raw?.["dc:creator"]) ??
    null;

  const publishedAt =
    firstString(raw?.pubDate) ??
    firstString(raw?.published) ??
    firstString(raw?.updated) ??
    null;

  const imageUrl = getImageUrl(raw);

  return {
    id: toId(`${source.url}::${link}`),
    title,
    excerpt,
    referenceUrl: link,
    sourceName: source.name,
    sourceUrl: source.homepage ?? source.url,
    imageUrl,
    author,
    publishedAt,
  };
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

export async function fetchRssArticles(
  source: DailyPickSource
): Promise<DailyPickArticle[]> {
  const res = await fetch(source.url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });

  if (!res.ok) return [];

  const xml = await res.text();
  const data = parser.parse(xml);

  const rssItems = asArray(data?.rss?.channel?.item);
  const atomEntries = asArray(data?.feed?.entry);

  const items = rssItems.length > 0 ? rssItems : atomEntries;
  return items
    .map((raw: any) => normalizeItem(source, raw))
    .filter((x: DailyPickArticle | null): x is DailyPickArticle => Boolean(x))
    .filter((item) => item.excerpt.length > 0);
}
