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

function isSamePhoenixDay(createdAt: Date | string) {
  const created = new Date(createdAt instanceof Date ? createdAt.toISOString() : createdAt);
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

  return db.$transaction(async (tx) => {
    const existing = await tx.lead.findFirst({
      where: { phone, address },
      orderBy: { createdAt: "desc" },
    });

    if (
      existing &&
      existing.status !== "closed" &&
      existing.status !== "lost" &&
      isSamePhoenixDay(existing.createdAt)
    ) {
      await tx.lead.update({
        where: { id: existing.id },
        data: {
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
        },
      });
      await tx.leadEvent.create({
        data: {
          leadId: existing.id,
          author: "system",
          type: "note",
          body: "Same-day form submitted again.",
        },
      });
      return { id: existing.id };
    }

    const lead = await tx.lead.create({
      data: {
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
      },
    });

    await tx.consent.create({
      data: {
        leadId: lead.id,
        channel: "sms",
        textVersion: input.consentText,
        pageUrl: input.pageUrl,
        ipHash: input.ipHash,
      },
    });
    await tx.consent.create({
      data: {
        leadId: lead.id,
        channel: "call",
        textVersion: input.consentText,
        pageUrl: input.pageUrl,
        ipHash: input.ipHash,
      },
    });
    await tx.leadEvent.create({
      data: {
        leadId: lead.id,
        author: "system",
        type: "created",
        body: "Lead arrived from the website.",
      },
    });

    return { id: lead.id };
  });
}

export async function recordLeadEvent(leadId: number, type: string, body: string) {
  const db = getDb();
  await db.leadEvent.create({
    data: {
      leadId,
      author: "system",
      type,
      body,
    },
  });
}
