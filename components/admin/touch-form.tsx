"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveLeadTouch } from "@/lib/admin/actions";
import { idleForm } from "@/lib/admin/schema";
import { FormNotice, Spinner } from "@/components/admin/status-form";

export function TouchForm({ leadId, hasEmail }: { leadId: number; hasEmail: boolean }) {
  const [state, action, pending] = useActionState(saveLeadTouch, idleForm);
  const [channel, setChannel] = useState("call");
  const body = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state.ok && body.current) body.current.value = "";
  }, [state.ok, state.stamp]);

  return (
    <form action={action} className="mt-4" aria-busy={pending}>
      <input type="hidden" name="leadId" value={leadId} />
      <FormNotice state={state} />
      <label className="block text-sm text-ink" htmlFor="channel">
        What happened
      </label>
      <select
        id="channel"
        name="channel"
        value={channel}
        onChange={(event) => setChannel(event.target.value)}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      >
        <option value="call">Log a call</option>
        <option value="sms">Log a text</option>
        <option value="email">Email the seller</option>
      </select>
      {channel === "sms" ? (
        <div className="mt-4">
          <label className="block text-sm text-ink" htmlFor="direction">
            Direction
          </label>
          <select id="direction" name="direction" defaultValue="out" className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
            <option value="out">We texted them</option>
            <option value="in">They texted us</option>
          </select>
        </div>
      ) : (
        <input type="hidden" name="direction" value="out" />
      )}
      {channel === "email" ? (
        <div className="mt-4">
          <label className="block text-sm text-ink" htmlFor="subject">
            Subject
          </label>
          <input id="subject" name="subject" required minLength={2} maxLength={120} className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink" />
          {hasEmail ? null : <p className="mt-1 text-sm text-muted">This lead has no email, so a message cannot be sent.</p>}
        </div>
      ) : (
        <input type="hidden" name="subject" value="" />
      )}
      <label className="mt-4 block text-sm text-ink" htmlFor="touch-body">
        {channel === "email" ? "Message" : "What was said"}
      </label>
      <textarea
        ref={body}
        id="touch-body"
        name="body"
        required
        minLength={2}
        maxLength={2000}
        rows={4}
        className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink"
      />
      <button
        type="submit"
        disabled={pending || (channel === "email" && !hasEmail)}
        className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 bg-amber px-4 text-base font-semibold text-amber-ink disabled:opacity-60"
      >
        {pending ? <Spinner label="Saving…" /> : channel === "email" ? "Send email" : "Save log"}
      </button>
    </form>
  );
}
