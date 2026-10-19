import { getDb } from "@/src/prisma/db";
import type { LeadInput } from "@/lib/leads/schema";

type NewLead = LeadInput & {
  consentText: string;
  pageUrl: string;
  ipHash: string;
};

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isSamePhoenixDay(createdAt: string) {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return false;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Phoenix",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(created) === formatter.format(new Date());
}

export async function saveLead(input: NewLead) {
  const db = getDb();
  const phone = input.phone;
  const address = input.address.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const trusteeSaleDate = emptyToNull(input.trusteeSaleDate);
  const utmSource = emptyToNull(input.utmSource);
  const utmMedium = emptyToNull(input.utmMedium);
  const utmCampaign = emptyToNull(input.utmCampaign);

  return db.transaction(async (tx) => {
    const existing = await tx.orm.public.Lead.where({ phone, address })
      .orderBy((lead) => lead.createdAt.desc())
      .first();

    if (
      existing &&
      existing.status !== "closed" &&
      existing.status !== "lost" &&
      isSamePhoenixDay(String(existing.createdAt))
    ) {
      await tx.orm.public.Lead.where({ id: existing.id }).update({
        name: input.name.trim(),
        email,
        message,
        situation: input.situation,
        trusteeSaleDate,
        preferredPath: input.preferredPath,
        language: input.language,
        sourcePath: input.sourcePath,
        utmSource,
        utmMedium,
        utmCampaign,
      });
      await tx.orm.public.LeadEvent.create({
        leadId: existing.id,
        author: "system",
        type: "note",
        body: "Same-day form submitted again.",
      });
      return { id: existing.id };
    }

    const lead = await tx.orm.public.Lead.create({
      address,
      name: input.name.trim(),
      phone,
      email,
      message,
      situation: input.situation,
      trusteeSaleDate,
      preferredPath: input.preferredPath,
      language: input.language,
      status: "new",
      sourcePath: input.sourcePath,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    await tx.orm.public.Consent.create({
      leadId: lead.id,
      channel: "sms",
      textVersion: input.consentText,
      pageUrl: input.pageUrl,
      ipHash: input.ipHash,
    });
    await tx.orm.public.Consent.create({
      leadId: lead.id,
      channel: "call",
      textVersion: input.consentText,
      pageUrl: input.pageUrl,
      ipHash: input.ipHash,
    });
    await tx.orm.public.LeadEvent.create({
      leadId: lead.id,
      author: "system",
      type: "created",
      body: "Lead arrived from the website.",
    });

    return { id: lead.id };
  });
}

export async function recordLeadEvent(leadId: number, type: string, body: string) {
  const db = getDb();
  await db.orm.public.LeadEvent.create({
    leadId,
    author: "system",
    type,
    body,
  });
}
