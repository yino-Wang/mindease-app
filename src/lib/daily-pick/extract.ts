import { Readability } from "@mozilla/readability";

export type ExtractedArticle = {
  contentText: string | null;
  heroImageUrl: string | null;
};

function cleanText(input: string | null | undefined): string | null {
  if (!input) return null;
  const normalized = input.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return normalized.length > 0 ? normalized : null;
}

function firstMetaContent(doc: Document, selectors: string[]): string | null {
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    const content = el?.getAttribute("content");
    if (content && content.startsWith("http")) return content;
  }
  return null;
}

export async function extractArticleFromUrl(
  url: string
): Promise<ExtractedArticle> {
  // jsdom is ESM; use dynamic import so Node can load it correctly in all runtimes (e.g. Vercel).
  const { JSDOM } = await import("jsdom");

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      // Helps some sites return the "real" page markup.
      "User-Agent":
        "Mozilla/5.0 (compatible; MindEaseBot/1.0; +https://example.invalid/bot)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    return { contentText: null, heroImageUrl: null };
  }

  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const doc = dom.window.document;

  const heroImageUrl =
    firstMetaContent(doc, [
      'meta[property="og:image"]',
      'meta[name="og:image"]',
      'meta[property="og:image:secure_url"]',
      'meta[name="twitter:image"]',
      'meta[property="twitter:image"]',
    ]) ?? null;

  const parsed = new Readability(doc).parse();
  const contentText = cleanText(parsed?.textContent ?? null);

  return { contentText, heroImageUrl };
}

