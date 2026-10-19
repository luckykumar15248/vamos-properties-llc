"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { submitLead, type LeadFormState } from "@/lib/leads/actions";
import { leadSchema } from "@/lib/leads/schema";
import { paths, site } from "@/lib/site";

const initialState: LeadFormState = { message: "", fieldErrors: {} };

export function ListingInquiry({ address, sourcePath }: { address: string; sourcePath: string }) {
  const [state, action, pending] = useActionState(submitLead, initialState);
  const [clientMessage, setClientMessage] = useState("");
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const fieldErrors = { ...clientErrors, ...state.fieldErrors };
  const banner = state.message || clientMessage;

  useEffect(() => {
    if (!banner) return;
    document.getElementById("inquiry-status")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [banner]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = leadSchema.safeParse({
      address: String(formData.get("address") ?? ""),
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      situation: String(formData.get("situation") ?? ""),
      trusteeSaleDate: "",
      preferredPath: String(formData.get("preferredPath") ?? ""),
      language: "en",
      sourcePath: String(formData.get("sourcePath") ?? ""),
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      consent: formData.get("consent") === "yes" ? "yes" : "",
      company: "",
    });
    if (parsed.success) {
      setClientErrors({});
      setClientMessage("");
      return;
    }
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!nextErrors[key]) nextErrors[key] = issue.message;
    }
    setClientErrors(nextErrors);
    setClientMessage("Check the highlighted fields, then send it again.");
  }

  return (
    <form action={action} onSubmit={onSubmit} className="border border-line bg-panel p-5" aria-busy={pending}>
      <h2 className="text-xl font-semibold text-ink">Ask about this home</h2>
      <p className="mt-2 text-sm leading-6 text-muted">Patrick or Jaime will call you back. This does not hold the house.</p>
      {banner ? (
        <p id="inquiry-status" role="status" className="mt-4 border border-line bg-mist px-3 py-3 text-base text-ink">
          {banner}
        </p>
      ) : null}
      <input type="hidden" name="address" value={address} />
      <input type="hidden" name="situation" value="listing_inquiry" />
      <input type="hidden" name="language" value="en" />
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input type="hidden" name="trusteeSaleDate" value="" />
      <div aria-hidden="true">
        <label className="hidden" htmlFor="inquiry-company">
          Company
        </label>
        <input id="inquiry-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" defaultValue="" />
      </div>
      <p className="mt-4 text-sm text-ink">
        Property
        <span className="mt-1 block text-base">{address}</span>
      </p>
      {fieldErrors.address ? <p className="mt-1 text-sm text-ink">{fieldErrors.address}</p> : null}
      <Field label="Your name" name="name" autoComplete="name" error={fieldErrors.name} />
      <Field label="Mobile number" name="phone" autoComplete="tel" inputMode="tel" error={fieldErrors.phone} />
      <Field label="Email" name="email" autoComplete="email" type="email" error={fieldErrors.email} />
      <label className="mt-4 block text-sm text-ink" htmlFor="inquiry-path">
        How are you thinking about it
      </label>
      <select id="inquiry-path" name="preferredPath" defaultValue="unsure" className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink">
        {paths.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {fieldErrors.preferredPath ? <p className="mt-1 text-sm text-ink">{fieldErrors.preferredPath}</p> : null}
      <label className="mt-4 block text-sm text-ink" htmlFor="inquiry-message">
        What do you want to know
      </label>
      <textarea
        id="inquiry-message"
        name="message"
        required
        minLength={5}
        rows={4}
        aria-invalid={fieldErrors.message ? true : undefined}
        className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink"
      />
      {fieldErrors.message ? <p className="mt-1 text-sm text-ink">{fieldErrors.message}</p> : null}
      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-ink">
        <input type="checkbox" name="consent" value="yes" required className="mt-1 size-5 shrink-0 accent-pine" />
        <span>{site.consentText}</span>
      </label>
      {fieldErrors.consent ? <p className="mt-1 text-sm text-ink">{fieldErrors.consent}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-amber px-4 text-base font-semibold text-amber-ink disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-amber-ink/30 border-t-amber-ink motion-reduce:animate-none" aria-hidden="true" />
            Sending…
          </>
        ) : (
          "Request a call"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  autoComplete,
  error,
  type = "text",
  inputMode,
}: {
  label: string;
  name: string;
  autoComplete: string;
  error?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
}) {
  return (
    <div className="mt-4">
      <label className="block text-sm text-ink" htmlFor={`inquiry-${name}`}>
        {label}
      </label>
      <input
        id={`inquiry-${name}`}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        className="mt-1 min-h-12 w-full border border-line bg-paper px-3 text-base text-ink"
      />
      {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
    </div>
  );
}
