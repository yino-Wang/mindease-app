import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { SignOutButton } from "@/components/profile/SignOutButton";

type ProfileHeaderProps = {
  displayName: string;
  avatarUrl: string | null;
  initials: string;
};

export function ProfileHeader({
  displayName,
  avatarUrl,
  initials,
}: ProfileHeaderProps) {
  return (
    <header
      className="flex flex-col gap-6 border-b border-stone-800/60 pb-8 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Profile summary"
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <ProfileAvatar avatarUrl={avatarUrl} initials={initials} size="lg" />
        <div className="min-w-0">
          <h1 className="truncate font-serif text-2xl tracking-wide text-stone-100 sm:text-3xl">
            {displayName}
          </h1>
          <p className="mt-1 text-xs tracking-[0.2em] text-stone-600 uppercase">
            Your account
          </p>
        </div>
      </div>
      <SignOutButton className="self-start sm:self-center" />
    </header>
  );
}
