"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/login/actions";
import { updatePassword } from "@/app/profile/actions";

const initialState: AuthActionState = {};

const inputClass =
  "sacred-glow w-full rounded-xl border border-stone-700/80 bg-stone-950/50 px-4 py-3 text-stone-200 placeholder:text-stone-600 transition-all duration-700 ease-in-out focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm tracking-wide text-stone-400">
        Current password
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm tracking-wide text-stone-400">
        New password
        <input
          type="password"
          name="newPassword"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm tracking-wide text-stone-400">
        Confirm new password
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      {state.error && (
        <p className="text-sm text-amber-600/90" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-stone-400" role="status">
          {state.success}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="sacred-glow self-start rounded-full border border-amber-500/40 bg-amber-500/15 px-8 py-3 font-serif text-sm tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25 disabled:opacity-40"
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
