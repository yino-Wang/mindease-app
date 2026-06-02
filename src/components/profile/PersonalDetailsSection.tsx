import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { EditUsernameForm } from "@/components/profile/EditUsernameForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { SignOutButton } from "@/components/profile/SignOutButton";
import {
  CARD_BORDER,
  CARD_RADIUS_LG,
  CARD_SURFACE,
} from "@/lib/dashboard/styles";
import type { ProfileRecord } from "@/lib/profile/queries";
import { getInitials } from "@/lib/profile/utils";

type PersonalDetailsSectionProps = {
  profile: ProfileRecord;
};

export function PersonalDetailsSection({ profile }: PersonalDetailsSectionProps) {
  const initials = getInitials(profile.username, profile.email);
  const showPassword = profile.authMethod !== "magic_link";

  return (
    <div className="space-y-8">
      <section
        className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-6 p-6 sm:p-8`}
      >
        <h2 className="font-serif text-xl tracking-wide text-stone-200">
          Avatar
        </h2>
        <ProfileAvatarUpload
          userId={profile.id}
          avatarUrl={profile.avatarUrl}
          initials={initials}
        />
      </section>

      <section
        className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-6 p-6 sm:p-8`}
      >
        <h2 className="font-serif text-xl tracking-wide text-stone-200">
          Username
        </h2>
        <EditUsernameForm currentUsername={profile.username} />
        <p className="text-sm text-stone-600">
          Email: <span className="text-stone-400">{profile.email}</span> (read-only)
        </p>
      </section>

      {showPassword ? (
        <section
          className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-6 p-6 sm:p-8`}
        >
          <h2 className="font-serif text-xl tracking-wide text-stone-200">
            Reset password
          </h2>
          <ChangePasswordForm />
        </section>
      ) : null}

      <section className="flex justify-center pt-2 pb-4">
        <SignOutButton />
      </section>
    </div>
  );
}
