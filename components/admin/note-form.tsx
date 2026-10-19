"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveLeadNote } from "@/lib/admin/actions";
import { idleForm } from "@/lib/admin/schema";
import { FormNotice, Spinner } from "@/components/admin/status-form";

export function NoteForm({ leadId }: { leadId: number }) {
  const [state, action, pending] = useActionState(saveLeadNote, idleForm);
  const note = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.ok && note.current) note.current.value = "";
  }, [state.ok, state.stamp]);

  return (
    <form action={action} className="mt-4" aria-busy={pending}>
      <input type="hidden" name="leadId" value={leadId} />
      <FormNotice state={state} />
      <label className="block text-sm text-ink" htmlFor="body">
        Internal note
      </label>
      <textarea
        ref={note}
        id="body"
        name="body"
        required
        minLength={2}
        maxLength={2000}
        rows={4}
        className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink"
        placeholder="What you heard, or the next step."
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 bg-navy px-4 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? <Spinner label="Saving…" /> : "Save note"}
      </button>
    </form>
  );
}
