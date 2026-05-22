import { CategoryLibraryView } from "@/components/dashboard/CategoryLibraryView";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import type { LibraryCategory } from "@/lib/meditate/categories";

type CategoryPageShellProps = {
  category: LibraryCategory;
  userEmail: string;
};

export function CategoryPageShell({
  category,
  userEmail,
}: CategoryPageShellProps) {
  return (
    <DashboardViewport header={<DashboardHeader userEmail={userEmail} />}>
      <CategoryLibraryView category={category} />
    </DashboardViewport>
  );
}
