"use client";

import { useActionState, useState } from "react";
import { updateLeadStatus } from "@/lib/admin/actions";
import { leadStatuses, lostReasons } from "@/lib/admin/pipeline";
import { idleForm } from "@/lib/admin/schema";
import { FormNotice } from "@/components/admin/status-form";

export function MoveLead({
  leadId,
  status,
  lostReason,
}: {
  leadId: number;
  status: string;
  lostReason: string | null;
}) {
  const [state, action, pending] = useActionState(updateLeadStatus, idleForm);
  const [next, setNext] = useState(status);

  return (
    <form action={action} className="mt-3 grid gap-2" aria-busy={pending}>
      <FormNotice state={state} />
      <input type="hidden" name="leadId" value={leadId} />
      <label className="sr-only" htmlFor={`move-${leadId}`}>
        Move lead
      </label>
      <select
        id={`move-${leadId}`}
        name="status"
        value={next}
        onChange={(event) => {
          const value = event.target.value;
          setNext(value);
          if (value !== "lost") event.currentTarget.form?.requestSubmit();
        }}
        disabled={pending}
        className="min-h-11 w-full border border-line bg-paper px-2 text-base text-ink"
      >
        {leadStatuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {next === "lost" ? (
        <>
          <label className="sr-only" htmlFor={`reason-${leadId}`}>
            Why it was lost
          </label>
          <select
            id={`reason-${leadId}`}
            name="lostReason"
            defaultValue={lostReason ?? ""}
            required
            className="min-h-11 w-full border border-line bg-paper px-2 text-base text-ink"
          >
            <option value="">Why it was lost</option>
            {lostReasons.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <button type="submit" className="inline-flex min-h-11 items-center justify-center bg-navy px-3 text-sm font-semibold text-white">
            Save lost
          </button>
        </>
      ) : (
        <input type="hidden" name="lostReason" value="" />
      )}
    </form>
  );
}
