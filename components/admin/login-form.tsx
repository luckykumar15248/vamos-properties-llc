"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/lib/admin/actions";
import type { LoginState } from "@/lib/admin/schema";

const initial: LoginState = { message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initial);

  return (
    <form action={action} className="mt-8" aria-busy={pending}>
      {state.message ? (
        <p id="login-status" role="alert" className="mb-4 border border-line bg-mist px-4 py-3 text-base text-ink">
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm text-ink" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      />
      <label className="mt-4 block text-sm text-ink" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        minLength={10}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-amber px-4 text-base font-semibold text-amber-ink disabled:opacity-60"
      >
        {pending ? <Spinner label="Signing in…" /> : "Sign in"}
      </button>
    </form>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <>
      <span
        className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current motion-reduce:animate-none"
        aria-hidden="true"
      />
      {label}
    </>
  );
}
