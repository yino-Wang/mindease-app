import { DASHBOARD_MAIN } from "@/lib/dashboard/styles";

type DashboardViewportProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardViewport({ header, children }: DashboardViewportProps) {
  return (
    <>
      {header}
      <main className={DASHBOARD_MAIN}>{children}</main>
    </>
  );
}
