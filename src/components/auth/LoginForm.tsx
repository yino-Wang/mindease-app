"use client";

import { useActionState, useState } from "react";
import {
  sendMagicLink,
  signIn,
  signUp,
  type AuthActionState,
} from "@/app/login/actions";

type AuthMode = "signin" | "signup" | "magic";

const initialState: AuthActionState = {};

const inputClass =
  "sacred-glow w-full rounded-xl border border-stone-700/80 bg-stone-950/50 px-4 py-3 text-stone-200 placeholder:text-stone-600 transition-all duration-700 ease-in-out focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

export function LoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState
  );
  const [magicState, magicAction, magicPending] = useActionState(
    sendMagicLink,
    initialState
  );

  const state =
    mode === "signin" ? signInState : mode === "signup" ? signUpState : magicState;
  const pending =
    mode === "signin"
      ? signInPending
      : mode === "signup"
        ? signUpPending
        : magicPending;
  const action =
    mode === "signin" ? signInAction : mode === "signup" ? signUpAction : magicAction;

  const tabs: { id: AuthMode; label: string }[] = [
    { id: "signin", label: "Sign in" },
    { id: "signup", label: "Sign up" },
    { id: "magic", label: "Magic link" },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex rounded-full border border-stone-800/60 bg-stone-900/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`flex-1 rounded-full py-2 text-sm tracking-widest uppercase transition-all duration-700 ease-in-out ${
              mode === tab.id
                ? "sacred-glow bg-amber-500/15 text-amber-300"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form action={action} className="flex flex-col gap-4">
        {next && <input type="hidden" name="next" value={next} />}

        <label className="flex flex-col gap-2 text-sm tracking-wide text-stone-400">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>

        {mode !== "magic" && (
          <label className="flex flex-col gap-2 text-sm tracking-wide text-stone-400">
            Password
            <input
              type="password"
              name="password"
              required
              minLength={mode === "signup" ? 6 : undefined}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              placeholder="••••••••"
              className={inputClass}
            />
          </label>
        )}

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
          className="sacred-glow mt-2 rounded-full border border-amber-500/40 bg-amber-500/15 py-3 font-serif text-lg tracking-widest text-amber-300 transition-all duration-700 ease-in-out hover:bg-amber-500/25 disabled:opacity-40"
        >
          {pending
            ? "Please wait…"
            : mode === "signin"
              ? "Enter sanctuary"
              : mode === "signup"
                ? "Create account"
                : "Send magic link"}
        </button>
      </form>
    </div>
  );
}
