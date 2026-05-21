/** Shared Tailwind class tokens for the premium dashboard viewport */

export const DASHBOARD_SHELL =
  "min-h-screen w-full bg-[#0D0E0E] bg-background text-stone-300";

/** Full-bleed main canvas — no max-width constraint */
export const DASHBOARD_MAIN =
  "w-full space-y-14 px-6 pt-36 pb-24 sm:px-10 lg:px-12 lg:pt-32";

export const CARD_SURFACE = "bg-stone-900/40 backdrop-blur-md";

export const CARD_BORDER =
  "border border-stone-800/50 ring-1 ring-emerald-950/20 ring-inset";

export const CARD_BORDER_ALT =
  "border border-stone-800/50 ring-1 ring-slate-900/30 ring-inset";

export const CARD_RADIUS_SM = "rounded-xl";

export const CARD_RADIUS_LG = "rounded-2xl";

/** Fixed width for landscape carousel cards (prevents flex squish) */
export const CARD_CAROUSEL_WIDTH = "w-[320px] shrink-0";

export const CARD_MEDIA_ASPECT = "aspect-video w-full";

export const CARD_HOVER_GLOW =
  "transition-all duration-700 ease-in-out motion-reduce:transition-none hover:border-amber-500/25 hover:shadow-[0_0_40px_rgb(245_158_11/0.1)]";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/50";

export const CAROUSEL_ROW =
  "scrollbar-hide flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4";
