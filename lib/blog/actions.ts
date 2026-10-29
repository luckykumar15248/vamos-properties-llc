"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { allowLead } from "@/lib/leads/rate-limit";
import { getDb } from "@/src/prisma/db";

const commentSchema = z.object({
  slug: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1, "Add your name.").max(80),
  email: z.string().trim().email("Use a real email. It stays off the page.").max(180),
  body: z.string().trim().min(1, "Write a comment first.").max(2000),
  company: z.string().max(0),
});

export type CommentFormState = {
  message: string;
  fieldErrors: Record<string, string>;
};

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitComment(_previous: CommentFormState, formData: FormData): Promise<CommentFormState> {
  if (field(formData, "company").trim() !== "") {
    return { message: "Thanks. We will read it before it shows on the page.", fieldErrors: {} };
  }
  const parsed = commentSchema.safeParse({
    slug: field(formData, "slug"),
    name: field(formData, "name"),
    email: field(formData, "email"),
    body: field(formData, "body"),
    company: "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { message: "Check the highlighted fields.", fieldErrors };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowLead(`comment:${ip}`, 5)) {
    return { message: "That is enough comments for now. Try again in a little while.", fieldErrors: {} };
  }

  try {
    const db = getDb();
    const post = await db.orm.public.Post.where({ slug: parsed.data.slug }).select("id", "status").first();
    if (!post || post.status !== "published") {
      return { message: "That article is not open for comments.", fieldErrors: {} };
    }
    await db.orm.public.Comment.create({
      postId: post.id,
      authorName: parsed.data.name,
      authorEmail: parsed.data.email,
      body: parsed.data.body,
      status: "pending",
      isStaff: false,
    });
  } catch (error) {
    console.error("comment_write_failed", {
      id: randomUUID(),
      name: error instanceof Error ? error.name : "Error",
    });
    return { message: "We could not save that comment. Try again in a minute.", fieldErrors: {} };
  }

  return { message: "Thanks. We will read it before it shows on the page.", fieldErrors: {} };
}
