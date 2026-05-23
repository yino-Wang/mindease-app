export type DashboardNavItem = {
  id: string;
  label: string;
  href: string;
  /** Path prefixes that mark this nav item active */
  activePrefixes: string[];
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: "about",
    label: "Welcome",
    href: "/about",
    activePrefixes: ["/about"],
  },
  {
    id: "dashboard",
    label: "DASHBOARD",
    href: "/dashboard",
    activePrefixes: ["/dashboard"],
  },
  {
    id: "timer",
    label: "TIMER",
    href: "/zen-timer",
    activePrefixes: ["/zen-timer"],
  },
  {
    id: "mixer",
    label: "MIXER",
    href: "/mixer",
    activePrefixes: ["/mixer"],
  },
  {
    id: "mornings",
    label: "MORNINGS",
    href: "/mornings",
    activePrefixes: ["/mornings"],
  },
  {
    id: "sleep",
    label: "SLEEP",
    href: "/sleep",
    activePrefixes: ["/sleep"],
  },

];

export function isNavItemActive(
  item: DashboardNavItem,
  pathname: string
): boolean {
  return item.activePrefixes.some((prefix) => {
    if (prefix === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
