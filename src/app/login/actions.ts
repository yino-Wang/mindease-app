"use server";

import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/auth/ensure-user";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function getCallbackUrl(next?: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = new URL("/auth/callback", base);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}

export async function signIn(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || undefined;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureUser(data.user);
  }

  redirect(next ?? "/timer");
}

export async function signUp(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "") || undefined;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getCallbackUrl(next),
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await ensureUser(data.user);
  }

  if (data.session) {
    redirect(next ?? "/timer");
  }

  return {
    success: "Check your email to confirm your account, then sign in.",
  };
}

export async function sendMagicLink(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const next = String(formData.get("next") ?? "") || undefined;

  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getCallbackUrl(next),
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Magic link sent. Check your email to continue.",
  };
}
