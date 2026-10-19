import "server-only";

import { Resend } from "resend";

export async function sendSellerFollowUp(input: {
  to: string;
  subject: string;
  text: string;
}): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return "skipped";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return "sent";
  } catch (error) {
    console.error("seller_email_failed", {
      name: error instanceof Error ? error.name : "Error",
    });
    return "failed";
  }
}

export function resendReady() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}
