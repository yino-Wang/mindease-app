import { CategoryLibraryView } from "@/components/dashboard/CategoryLibraryView";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardViewport } from "@/components/dashboard/DashboardViewport";
import type { LibraryCategory } from "@/lib/meditate/categories";

import type { AuthSessionUser } from "@/lib/auth/require-auth";

type CategoryPageShellProps = {
  category: LibraryCategory;
  user: AuthSessionUser;
};

export function CategoryPageShell({ category, user }: CategoryPageShellProps) {
  return (
    <DashboardViewport
      header={
        <DashboardHeader
          userEmail={user.email}
          username={user.username}
          avatarUrl={user.avatarUrl}
          displayName={user.displayName}
        />
      }
    >
      <CategoryLibraryView category={category} />
    </DashboardViewport>
  );
}
