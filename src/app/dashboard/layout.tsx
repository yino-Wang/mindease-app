import { DASHBOARD_SHELL } from "@/lib/dashboard/styles";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={DASHBOARD_SHELL}>{children}</div>;
}
