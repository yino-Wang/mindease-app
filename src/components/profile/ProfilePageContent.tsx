"use client";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileAvatarUpload } from "@/components/profile/ProfileAvatarUpload";
import { EditUsernameForm } from "@/components/profile/EditUsernameForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import {
  CARD_BORDER,
  CARD_RADIUS_LG,
  CARD_SURFACE,
} from "@/lib/dashboard/styles";
import type { ReactNode } from "react";
import type { ProfileRecord } from "@/lib/profile/queries";
import { displayName, getInitials } from "@/lib/profile/queries";

type ProfilePageContentProps = {
  profile: ProfileRecord;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} space-y-6 p-6 sm:p-8`}
    >
      <h2 className="font-serif text-xl tracking-wide text-stone-200">{title}</h2>
      {children}
    </section>
  );
}

export function ProfilePageContent({ profile }: ProfilePageContentProps) {
  const name = displayName(profile.username, profile.email);
  const initials = getInitials(profile.username, profile.email);
  const showPassword = profile.authMethod !== "magic_link";

  return (
    <div className="mx-auto w-full max-w-xl space-y-8">
      <section
        className={`${CARD_SURFACE} ${CARD_BORDER} ${CARD_RADIUS_LG} flex flex-col items-center gap-4 p-8 text-center`}
      >
        <ProfileAvatar
          avatarUrl={profile.avatarUrl}
          initials={initials}
          size="lg"
        />
        <div>
          <h1 className="font-serif text-3xl tracking-wide text-stone-100">
            {name}
          </h1>
          <p className="mt-2 text-sm tracking-wide text-stone-500">
            {profile.email}
          </p>
        </div>
      </section>

      <Section title="Edit username">
        <EditUsernameForm currentUsername={profile.username} />
      </Section>

      <Section title="Edit avatar">
        <ProfileAvatarUpload
          userId={profile.id}
          avatarUrl={profile.avatarUrl}
          initials={initials}
        />
      </Section>

      {showPassword && (
        <Section title="Change password">
          <ChangePasswordForm />
        </Section>
      )}

      <section className="flex flex-col items-center gap-4 pt-4 pb-8">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full border border-stone-700/80 bg-stone-900/40 px-10 py-3 text-sm tracking-widest text-stone-400 uppercase transition-all duration-700 ease-in-out hover:border-stone-600 hover:text-stone-200"
          >
            Sign out
          </button>
        </form>
      </section>
    </div>
  );
}
