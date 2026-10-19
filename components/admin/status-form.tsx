"use client";

import { useActionState, useState } from "react";
import { updateLeadStatus } from "@/lib/admin/actions";
import { idleForm, type AdminFormState } from "@/lib/admin/schema";
import { leadStatuses, lostReasons } from "@/lib/admin/pipeline";

export function StatusForm({
  leadId,
  status,
  lostReason,
}: {
  leadId: number;
  status: string;
  lostReason: string | null;
}) {
  const [state, action, pending] = useActionState(updateLeadStatus, idleForm);
  const [nextStatus, setNextStatus] = useState(status);

  return (
    <form action={action} className="mt-4" aria-busy={pending}>
      <input type="hidden" name="leadId" value={leadId} />
      <FormNotice state={state} />
      <label className="block text-sm text-ink" htmlFor="status">
        Status
      </label>
      <select
        id="status"
        name="status"
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value)}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      >
        {leadStatuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {nextStatus === "lost" ? (
        <div className="mt-4">
          <label className="block text-sm text-ink" htmlFor="lostReason">
            Why it was lost
          </label>
          <select
            id="lostReason"
            name="lostReason"
            defaultValue={lostReason ?? ""}
            required
            className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
          >
            <option value="">Choose a reason</option>
            {lostReasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="lostReason" value="" />
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 bg-amber px-4 text-base font-semibold text-amber-ink disabled:opacity-60"
      >
        {pending ? <Spinner label="Saving…" /> : "Save status"}
      </button>
    </form>
  );
}

export function FormNotice({ state }: { state: AdminFormState }) {
  if (!state.message) return null;
  return (
    <p role="status" className="mb-4 border border-line bg-mist px-4 py-3 text-base text-ink">
      {state.message}
    </p>
  );
}

export function Spinner({ label }: { label: string }) {
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
