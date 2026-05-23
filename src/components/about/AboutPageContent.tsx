import Link from "next/link";
import { AboutImage } from "@/components/about/AboutImage";
import {
  ABOUT_CLOSING,
  ABOUT_HERO,
  ABOUT_MISSION,
  ABOUT_MISSION_INTRO,
  ABOUT_MODALITIES,
  ABOUT_PHILOSOPHY,
} from "@/lib/about/content";
import {
  CARD_BORDER,
  CARD_HOVER_GLOW,
  CARD_RADIUS_LG,
  CARD_SURFACE,
  FOCUS_RING,
} from "@/lib/dashboard/styles";

const bleed =
  "relative -mx-6 w-[calc(100%+3rem)] sm:-mx-10 sm:w-[calc(100%+5rem)] lg:-mx-12 lg:w-[calc(100%+6rem)]";

type AboutPageContentProps = {
  showSignInCta?: boolean;
};

export function AboutPageContent({
  showSignInCta = false,
}: AboutPageContentProps) {
  return (
    <div className={`${bleed} space-y-0 pb-16`}>
      {/* Hero — full-bleed cover */}
      <section
        className="relative min-h-[72vh] overflow-hidden"
        aria-labelledby="about-hero"
      >
        <AboutImage
          src={ABOUT_HERO.image}
          alt={ABOUT_HERO.imageAlt}
          priority
          className="object-cover object-center opacity-70"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0D0E0E] via-[#0D0E0E]/92 to-[#0D0E0E]/55"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0D0E0E] via-transparent to-[#0D0E0E]/40"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[72vh] flex-col justify-end px-6 pb-14 pt-32 sm:px-10 sm:pb-20 lg:px-12 lg:pb-24">
          <p className="text-lg font-semibold tracking-[0.35em] text-amber-400/90 uppercase">
            MindEase
          </p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <h1
              id="about-hero"
              className="max-w-5xl font-serif text-4xl leading-tight tracking-wide text-stone-50 sm:text-5xl lg:text-7xl lg:leading-[1.08]"
            >
              {ABOUT_HERO.headline}
            </h1>
            {showSignInCta && (
              <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                <Link
                  href="/login?next=/dashboard"
                  className={`sacred-glow inline-flex items-center justify-center rounded-full border border-amber-500/35 bg-amber-500/10 px-10 py-4 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:border-amber-500/55 hover:bg-amber-500/20 hover:text-amber-200 motion-reduce:transition-none ${FOCUS_RING}`}
                >
                  Sign in to explore more
                </Link>
                <p className="max-w-xs text-sm leading-relaxed tracking-wide text-stone-500 lg:text-right">
                  Create a free account to open Dashboard, modalities, and your
                  practice calendar.
                </p>
              </div>
            )}
          </div>
          <div className="mt-10 grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-12">
            <p className="text-base leading-relaxed tracking-wide text-stone-300 lg:text-lg">
              {ABOUT_HERO.subline}
            </p>
            <p className="text-base leading-relaxed tracking-wide text-stone-400 lg:text-lg">
              {ABOUT_HERO.extended}
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy — split image + copy */}
      <section
        className="grid min-h-[480px] lg:grid-cols-2"
        aria-labelledby="about-philosophy"
      >
        <div className="relative min-h-[320px] lg:min-h-full">
          <AboutImage
            src={ABOUT_PHILOSOPHY.image}
            alt={ABOUT_PHILOSOPHY.imageAlt}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0D0E0E] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0D0E0E]/30"
            aria-hidden
          />
        </div>
        <div
          className={`flex flex-col justify-center ${CARD_SURFACE} border-stone-800/50 px-6 py-14 sm:px-10 sm:py-16 lg:border-l lg:px-12 lg:py-20`}
        >
          <h2
            id="about-philosophy"
            className="font-serif text-3xl tracking-wide text-stone-100 sm:text-4xl"
          >
            {ABOUT_PHILOSOPHY.title}
          </h2>
          <p className="mt-4 font-serif text-xl text-amber-500/85 sm:text-2xl">
            {ABOUT_PHILOSOPHY.lead}
          </p>
          <div className="mt-8 space-y-6">
            {ABOUT_PHILOSOPHY.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-base leading-relaxed tracking-wide text-stone-400"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        className="space-y-10 px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
        aria-labelledby="about-mission"
      >
        <div className="space-y-4 border-l-2 border-amber-500/40 pl-6">
          <h2
            id="about-mission"
            className="font-serif text-3xl tracking-wide text-stone-100 sm:text-4xl"
          >
            Mission &amp; Purpose
          </h2>
          <p className="max-w-3xl text-base leading-relaxed tracking-wide text-stone-500 lg:text-lg">
            {ABOUT_MISSION_INTRO}
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {ABOUT_MISSION.map((pillar) => (
            <article
              key={pillar.title}
              className={`group overflow-hidden ${CARD_RADIUS_LG} ${CARD_SURFACE} ${CARD_BORDER} ${CARD_HOVER_GLOW}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <AboutImage
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent"
                  aria-hidden
                />
                <h3 className="absolute bottom-0 left-0 p-6 font-serif text-2xl tracking-wide text-stone-50 sm:text-3xl">
                  {pillar.title}
                </h3>
              </div>
              <div className="space-y-4 p-6 sm:p-8">
                <p className="text-base leading-relaxed tracking-wide text-stone-400">
                  {pillar.body}
                </p>
                <p className="text-sm leading-relaxed tracking-wide text-stone-500">
                  {pillar.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Modalities */}
      <section
        className="border-t border-stone-800/50 bg-stone-950/30 px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24"
        aria-labelledby="about-modalities"
      >
        <div className="mb-12 space-y-4 text-center lg:mb-16">
          <h2
            id="about-modalities"
            className="font-serif text-3xl tracking-wide text-stone-100 sm:text-4xl"
          >
            {ABOUT_MODALITIES.sectionTitle}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed tracking-wide text-stone-400 lg:text-lg">
            {ABOUT_MODALITIES.sectionSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ABOUT_MODALITIES.items.map((modality) => (
            <Link
              key={modality.name}
              href={modality.href}
              className={`group flex flex-col overflow-hidden ${CARD_RADIUS_LG} ${CARD_SURFACE} ${CARD_BORDER} ${CARD_HOVER_GLOW} hover:sacred-glow-subtle transition-all duration-700 ease-in-out motion-reduce:transition-none ${FOCUS_RING}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <AboutImage
                  src={modality.image}
                  alt={modality.imageAlt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"
                  aria-hidden
                />
                <span className="absolute top-3 left-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-semibold tracking-[0.2em] text-amber-400/90 uppercase backdrop-blur-sm">
                  {modality.tagline}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-2xl tracking-wide text-stone-100">
                  {modality.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed tracking-wide text-stone-400">
                  {modality.description}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed tracking-wide text-stone-500">
                  {modality.detail}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm tracking-widest text-amber-500/70 transition-colors group-hover:text-amber-400">
                  Explore {modality.name}
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing — cover backdrop */}
      <section
        className={`relative mx-6 overflow-hidden ${CARD_RADIUS_LG} sm:mx-10 lg:mx-12`}
        aria-labelledby="about-closing"
      >
        <div className="relative min-h-[360px]">
          <AboutImage
            src={ABOUT_CLOSING.image}
            alt={ABOUT_CLOSING.imageAlt}
            sizes="100vw"
            className="object-cover object-center opacity-50"
          />
          <div
            className="absolute inset-0 bg-[#0D0E0E]/85 backdrop-blur-[2px]"
            aria-hidden
          />
          <div className="relative z-10 flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center sm:px-12 sm:py-20">
            <h2
              id="about-closing"
              className="font-serif text-3xl tracking-wide text-stone-50 sm:text-4xl"
            >
              {ABOUT_CLOSING.title}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed tracking-wide text-stone-300 lg:text-lg">
              {ABOUT_CLOSING.body}
            </p>
            <Link
              href={ABOUT_CLOSING.ctaHref}
              className={`mt-10 inline-flex items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/15 px-10 py-4 font-serif text-lg tracking-widest text-amber-200 transition-all duration-700 ease-in-out hover:border-amber-500/60 hover:bg-amber-500/25 hover:sacred-glow motion-reduce:transition-none ${FOCUS_RING}`}
            >
              {ABOUT_CLOSING.ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
