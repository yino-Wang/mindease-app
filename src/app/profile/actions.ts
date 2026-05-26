"use server";

import { revalidatePath } from "next/cache";
import type { AuthActionState } from "@/app/login/actions";
import { ensureUser } from "@/lib/auth/ensure-user";
import { isAllowedAvatarPublicUrl } from "@/lib/profile/avatar-url";
import { normalizeUsername, validateUsername } from "@/lib/profile/validation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthedProfileUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in." as const };
  }

  await ensureUser({ id: user.id, email: user.email });

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, authMethod: true },
  });

  if (!profile) {
    return { error: "Profile not found." as const };
  }

  return { supabase, authUser: user, profile };
}

function revalidateProfilePaths() {
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function updateUsername(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const authed = await getAuthedProfileUser();
  if ("error" in authed) return { error: authed.error };

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const validationError = validateUsername(username);
  if (validationError) return { error: validationError };

  const taken = await prisma.user.findFirst({
    where: {
      username,
      NOT: { id: authed.profile.id },
    },
    select: { id: true },
  });
  if (taken) {
    return { error: "That username is already taken." };
  }

  await prisma.user.update({
    where: { id: authed.profile.id },
    data: { username },
  });

  revalidateProfilePaths();
  return { success: "Username updated." };
}

export async function updatePassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const authed = await getAuthedProfileUser();
  if ("error" in authed) return { error: authed.error };

  if (authed.profile.authMethod !== "password") {
    return { error: "Password change is not available for this account." };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return { error: "Current and new passwords are required." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const { error: verifyError } = await authed.supabase.auth.signInWithPassword({
    email: authed.profile.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error: updateError } = await authed.supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: "Password updated." };
}

export async function saveAvatarUrl(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const authed = await getAuthedProfileUser();
  if ("error" in authed) return { error: authed.error };

  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  if (!avatarUrl || !isAllowedAvatarPublicUrl(avatarUrl)) {
    return { error: "Invalid avatar URL." };
  }

  await prisma.user.update({
    where: { id: authed.profile.id },
    data: { avatarUrl },
  });

  revalidateProfilePaths();
  return { success: "Avatar updated." };
}

export async function removeAvatar(
  _prev: AuthActionState
): Promise<AuthActionState> {
  const authed = await getAuthedProfileUser();
  if ("error" in authed) return { error: authed.error };

  const existing = await prisma.user.findUnique({
    where: { id: authed.profile.id },
    select: { avatarUrl: true },
  });

  await prisma.user.update({
    where: { id: authed.profile.id },
    data: { avatarUrl: null },
  });

  if (existing?.avatarUrl) {
    try {
      const marker = "/storage/v1/object/public/avatars/";
      const idx = existing.avatarUrl.indexOf(marker);
      if (idx !== -1) {
        const storagePath = decodeURIComponent(
          existing.avatarUrl.slice(idx + marker.length)
        );
        await authed.supabase.storage.from("avatars").remove([storagePath]);
      }
    } catch {
      // Storage cleanup is best-effort
    }
  }

  revalidateProfilePaths();
  return { success: "Avatar removed." };
}
