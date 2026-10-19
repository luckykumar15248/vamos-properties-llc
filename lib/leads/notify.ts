import { Resend } from "resend";

export type LeadNotice = {
  address: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  situation: string;
  trusteeSaleDate: string;
  preferredPath: string;
  sourcePath: string;
  language: string;
};

export async function notifyFounders(lead: LeadNotice): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return "skipped";

  const recipients = to
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (recipients.length === 0) return "skipped";

  const text = [
    "A homeowner just asked for a conversation.",
    "",
    `Address: ${lead.address}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Situation: ${lead.situation}`,
    `Trustee sale date: ${lead.trusteeSaleDate || "none"}`,
    `Preferred path: ${lead.preferredPath}`,
    `Language: ${lead.language}`,
    `Page: ${lead.sourcePath}`,
    "",
    "Message:",
    lead.message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: recipients,
      subject: `New Vamos lead: ${lead.address}`,
      text,
    });
    return error ? "failed" : "sent";
  } catch {
    return "failed";
  }
}
