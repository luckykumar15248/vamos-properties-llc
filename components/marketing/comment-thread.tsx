"use client";

import { useActionState } from "react";
import { submitComment, type CommentFormState } from "@/lib/blog/actions";
import { formatBlogDate } from "@/lib/blog/content";
import type { PublicComment } from "@/lib/dal/blog";

const initialState: CommentFormState = { message: "", fieldErrors: {} };

export function CommentThread({ slug, comments }: { slug: string; comments: PublicComment[] }) {
  const [state, action, pending] = useActionState(submitComment, initialState);
  const roots = comments.filter((comment) => comment.parentId == null || !comments.some((item) => item.id === comment.parentId));

  return (
    <section className="mt-12 max-w-3xl border-t border-line pt-10">
      <h2 className="text-2xl font-semibold text-ink">Comments</h2>
      {roots.length === 0 ? <p className="mt-4 text-base leading-7 text-muted">No comments yet.</p> : <ul className="mt-6 grid gap-6">{roots.map((comment) => <CommentItem key={comment.id} comment={comment} comments={comments} />)}</ul>}
      <form action={action} className="mt-8 grid gap-4" aria-busy={pending}>
        <input type="hidden" name="slug" value={slug} />
        <p className="text-sm leading-6 text-muted">Your note stays private until someone at Vamos approves it. The email is for the desk, not the public page.</p>
        {state.message ? <p className="text-base text-ink">{state.message}</p> : null}
        <Field label="Name" name="name" error={state.fieldErrors.name} />
        <Field label="Email" name="email" type="email" error={state.fieldErrors.email} />
        <div>
          <label htmlFor="comment-body" className="text-sm text-ink">
            Comment
          </label>
          <textarea id="comment-body" name="body" rows={5} maxLength={2000} required className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink" />
          {state.fieldErrors.body ? <p className="mt-1 text-sm text-ink">{state.fieldErrors.body}</p> : null}
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="comment-company">Company</label>
          <input id="comment-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" disabled={pending} className="inline-flex min-h-12 w-fit items-center bg-navy px-4 text-base font-semibold text-white">
          {pending ? "Sending…" : "Send comment"}
        </button>
      </form>
    </section>
  );
}

function CommentItem({ comment, comments }: { comment: PublicComment; comments: PublicComment[] }) {
  const replies = comments.filter((item) => item.parentId === comment.id);
  return (
    <li>
      <p className="text-base font-semibold text-ink">
        {comment.authorName}
        {comment.isStaff ? <span className="ml-2 text-sm font-medium text-muted">Vamos</span> : null}
      </p>
      <p className="text-sm text-muted">{formatBlogDate(comment.createdAt)}</p>
      <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-ink">{comment.body}</p>
      {replies.length > 0 ? (
        <ul className="mt-4 grid gap-4 border-l border-line pl-4">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} comments={comments} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={`comment-${name}`} className="text-sm text-ink">
        {label}
      </label>
      <input id={`comment-${name}`} name={name} type={type} required className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink" />
      {error ? <p className="mt-1 text-sm text-ink">{error}</p> : null}
    </div>
  );
}
