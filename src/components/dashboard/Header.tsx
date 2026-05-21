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

function NavLinks({
  pathname,
  className,
}: {
  pathname: string;
  className?: string;
}) {
  return (
    <nav className={className} aria-label="Main modules">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const active = isNavItemActive(item, pathname);

        if (item.disabled || !item.href) {
          return (
            <span
              key={item.id}
              className="cursor-not-allowed border-b border-transparent pb-1 text-xs tracking-widest text-stone-500 uppercase opacity-40"
              aria-disabled="true"
            >
              {item.label}
            </span>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`border-b pb-1 text-xs tracking-widest uppercase transition-all duration-700 ease-in-out motion-reduce:transition-none ${FOCUS_RING} ${
              active
                ? "border-amber-500/50 text-amber-400/90"
                : "border-transparent text-stone-500 hover:text-stone-300"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-stone-900/60 bg-[#0D0E0E]/80 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex flex-1 items-center justify-start">
          <Link
            href="/dashboard"
            className={`font-serif text-lg tracking-wide text-stone-200 transition-colors duration-700 hover:text-stone-100 ${FOCUS_RING}`}
          >
            MindEase
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <NavLinks pathname={pathname} className="flex items-center gap-8" />
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Link
            href="/profile"
            className={`sacred-glow flex h-9 w-9 items-center justify-center rounded-full border border-amber-500/30 bg-stone-900/40 text-xs tracking-widest text-amber-400/80 backdrop-blur-md transition-all duration-700 ease-in-out hover:border-amber-500/50 hover:text-amber-300 ${FOCUS_RING}`}
            aria-label="Profile"
          >
            {getInitials(userEmail)}
          </Link>
        </div>
      </div>

      <div className="border-t border-stone-900/60 px-8 py-2 md:hidden">
        <NavLinks
          pathname={pathname}
          className="scrollbar-hide flex items-center justify-center gap-5 overflow-x-auto"
        />
      </div>
    </header>
  );
}
