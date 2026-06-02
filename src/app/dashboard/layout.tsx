import { DASHBOARD_SHELL } from "@/lib/dashboard/styles";

export const runtime = "nodejs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={DASHBOARD_SHELL}>{children}</div>;
}
