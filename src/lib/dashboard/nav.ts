export type DashboardNavItem = {
  id: string;
  label: string;
  href?: string;
  disabled?: boolean;
  /** Path prefixes that mark this nav item active */
  activePrefixes?: string[];
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: "timer",
    label: "TIMER",
    href: "/timer",
    activePrefixes: ["/timer"],
  },
  {
    id: "mixer",
    label: "MIXER",
    disabled: true,
  },
  {
    id: "mornings",
    label: "MORNINGS",
    href: "/courses",
    activePrefixes: ["/courses", "/daily"],
  },
  {
    id: "sleep",
    label: "SLEEP",
    disabled: true,
  },
];

export function isNavItemActive(
  item: DashboardNavItem,
  pathname: string
): boolean {
  if (!item.activePrefixes?.length) return false;
  return item.activePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
