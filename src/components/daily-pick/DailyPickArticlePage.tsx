import Link from "next/link";
import { DailyPickArticleBody } from "@/components/daily-pick/DailyPickArticleBody";
import type { DailyPickArticle } from "@/lib/daily-pick/types";
import {
  CARD_BORDER,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";

type DailyPickArticlePageProps = {
  article: DailyPickArticle;
};

function formatPublished(date: string | null): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function DailyPickArticlePage({ article }: DailyPickArticlePageProps) {
  const publishedLabel = formatPublished(article.publishedAt);
  const heroImageUrl = article.heroImageUrl ?? article.imageUrl ?? null;

  return (
    <div className="w-full max-w-none space-y-10">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard"
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/40 text-stone-300 backdrop-blur-md transition-all duration-700 ease-in-out hover:border-amber-500/30 hover:text-amber-300/90 ${FOCUS_RING}`}
          aria-label="Back to dashboard"
        >
          ←
        </Link>

        <div className="text-right">
          <p className="text-[10px] tracking-[0.25em] text-stone-600 uppercase">
            Your Top Pick Today
          </p>
        </div>
      </header>

      <div className="w-full">
        <article className="mx-auto w-full max-w-5xl min-w-0 space-y-8">
          <div className="space-y-4">
            <p className="text-sm tracking-wide text-stone-500">
              {article.sourceName}
              {publishedLabel ? ` · ${publishedLabel}` : ""}
              {article.author ? ` · ${article.author}` : ""}
            </p>
            <h1 className="font-serif text-4xl leading-tight tracking-wide text-stone-100 sm:text-5xl">
              {article.title}
            </h1>
          </div>

          {heroImageUrl ? (
            <div
              className={`relative overflow-hidden ${CARD_RADIUS_LG} border border-stone-800/50 bg-stone-950/30`}
            >
              <div className="aspect-[16/9] w-full">
                <img
                  src={heroImageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-90"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          ) : null}

          <section
            className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-5 p-6 sm:p-8`}
            aria-label="Article content"
          >
            <p className="text-sm tracking-[0.25em] text-stone-500 uppercase">
              Story
            </p>
            <DailyPickArticleBody
              contentHtml={article.contentHtml}
              contentText={article.contentText}
              excerpt={article.excerpt}
            />
          </section>
        </article>
      </div>

      <footer className="mx-auto w-full max-w-5xl space-y-6">
        <section
          className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-4 p-6`}
          aria-label="Reference"
        >
          <h2 className="font-serif text-xl tracking-wide text-stone-200">
            Reference link
          </h2>
          <p className="text-sm leading-relaxed tracking-wide text-stone-500">
            This story is sourced from an external site. Read the original for
            full context.
          </p>
          <Link
            href={article.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`sacred-glow inline-flex w-full items-center justify-center rounded-full border border-amber-500/35 bg-amber-500/10 px-8 py-3 font-serif text-sm tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:border-amber-500/55 hover:bg-amber-500/20 hover:text-amber-200 motion-reduce:transition-none ${FOCUS_RING}`}
          >
            Open original
          </Link>
          <p className="break-words text-xs text-stone-600">
            {article.referenceUrl}
          </p>
        </section>

        <section className="px-2">
          <p className="text-xs tracking-widest text-stone-600 uppercase">
            Content from external source
          </p>
        </section>
      </footer>
    </div>
  );
}
