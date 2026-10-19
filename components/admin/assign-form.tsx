"use client";

import { useActionState } from "react";
import { saveLeadAssignment } from "@/lib/admin/actions";
import { idleForm } from "@/lib/admin/schema";
import { FormNotice, Spinner } from "@/components/admin/status-form";

export function AssignForm({
  leadId,
  assignedToId,
  staff,
}: {
  leadId: number;
  assignedToId: number | null;
  staff: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState(saveLeadAssignment, idleForm);

  return (
    <form action={action} className="mt-4" aria-busy={pending}>
      <input type="hidden" name="leadId" value={leadId} />
      <FormNotice state={state} />
      <label className="block text-sm text-ink" htmlFor="assignedToId">
        Who is working this
      </label>
      <select
        id="assignedToId"
        name="assignedToId"
        defaultValue={assignedToId ? String(assignedToId) : ""}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      >
        <option value="">Unassigned</option>
        {staff.map((person) => (
          <option key={person.id} value={person.id}>
            {person.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-12 items-center justify-center bg-navy px-4 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? <Spinner label="Saving…" /> : "Save assignment"}
      </button>
    </form>
  );
}
