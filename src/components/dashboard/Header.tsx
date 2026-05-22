"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DASHBOARD_NAV_ITEMS,
  isNavItemActive,
} from "@/lib/dashboard/nav";
import { FOCUS_RING } from "@/lib/dashboard/styles";

type DashboardHeaderProps = {
  userEmail?: string | null;
};

function getInitials(email: string | null | undefined): string {
  if (!email) return "ME";
  const part = email.split("@")[0];
  return part.slice(0, 2).toUpperCase();
}

function NavItem({
  item,
  active,
}: {
  item: (typeof DASHBOARD_NAV_ITEMS)[number];
  active: boolean;
}) {
  const tabClass = `group relative flex flex-col items-center px-3 py-1.5 transition-colors duration-500 ease-in-out motion-reduce:transition-none ${FOCUS_RING} ${
    active
      ? "rounded border border-amber-500/50 text-amber-400"
      : "text-stone-500 hover:text-stone-200"
  }`;

  const underline = active ? (
    <span
      className="absolute right-0 -bottom-0.5 left-0 h-0.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgb(245_158_11/0.55)]"
      aria-hidden
    />
  ) : null;

  return (
    <Link
      href={item.href}
      className={tabClass}
      aria-current={active ? "page" : undefined}
    >
      <span className="text-xs font-semibold tracking-widest uppercase">
        {item.label}
      </span>
      {underline}
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav
      className="flex items-center justify-center gap-6 lg:gap-10"
      aria-label="Main modules"
    >
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          active={isNavItemActive(item, pathname)}
        />
      ))}
    </nav>
  );
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-stone-900/60 bg-[#0D0E0E]/80 backdrop-blur-xl">
      <div className="hidden w-full grid-cols-3 items-center px-12 py-6 md:grid">
        <div className="flex items-center justify-start">
          <Link
            href="/dashboard"
            className={`font-serif text-xl font-semibold tracking-[0.15em] transition-opacity duration-700 hover:opacity-90 ${FOCUS_RING}`}
          >
            <span className="bg-gradient-to-r from-stone-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              MindEase
            </span>
          </Link>
        </div>

        <div className="flex justify-center">
          <DesktopNav pathname={pathname} />
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/profile"
            className={`rounded-full border border-stone-800/80 p-[2px] transition-all duration-700 hover:border-amber-500/40 ${FOCUS_RING}`}
            aria-label="Profile"
          >
            <span className="sacred-glow flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/60 text-xs font-semibold tracking-widest text-amber-400/90 backdrop-blur-md">
              {getInitials(userEmail)}
            </span>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 px-6 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className={`font-serif text-lg font-semibold tracking-[0.12em] ${FOCUS_RING}`}
          >
            <span className="bg-gradient-to-r from-stone-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
              MindEase
            </span>
          </Link>
          <Link
            href="/profile"
            className={`rounded-full border border-stone-800/80 p-[2px] ${FOCUS_RING}`}
            aria-label="Profile"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/60 text-xs text-amber-400/90">
              {getInitials(userEmail)}
            </span>
          </Link>
        </div>
        <div className="scrollbar-hide overflow-x-auto border-t border-stone-900/50 pt-3">
          <DesktopNav pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
