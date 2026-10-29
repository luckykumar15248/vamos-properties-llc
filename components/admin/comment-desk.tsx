"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteComment, replyToComment, setCommentStatus } from "@/lib/admin/blog-actions";
import { formatBlogDate } from "@/lib/blog/content";
import type { AdminComment } from "@/lib/dal/blog";

export function CommentDesk({ comments }: { comments: AdminComment[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function run(task: Promise<{ ok: boolean; message: string }>) {
    const result = await task;
    setMessage(result.message);
    if (result.ok) router.refresh();
  }

  return (
    <div className="mt-8">
      {message ? <p className="mb-4 border border-line bg-panel px-4 py-3 text-base text-ink">{message}</p> : null}
      {comments.length === 0 ? <p className="border border-line bg-panel px-4 py-6 text-base text-ink">No comments in this view.</p> : null}
      <ul className="grid gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border border-line bg-panel p-4">
            <p className="text-sm text-muted">
              {comment.status}
              {comment.isStaff ? " · staff" : ""} · {formatBlogDate(comment.createdAt)} · {comment.postTitle}
            </p>
            <p className="mt-2 text-base font-semibold text-ink">{comment.authorName}</p>
            {comment.authorEmail ? <p className="text-sm text-muted">{comment.authorEmail}</p> : null}
            <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-ink">{comment.body}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void run(setCommentStatus(comment.id, "approved"))} className="inline-flex min-h-11 items-center bg-navy px-3 text-sm font-semibold text-white">
                Approve
              </button>
              <button type="button" onClick={() => void run(setCommentStatus(comment.id, "flagged"))} className="inline-flex min-h-11 items-center border border-line px-3 text-sm font-semibold text-ink">
                Flag
              </button>
              <button type="button" onClick={() => void run(setCommentStatus(comment.id, "pending"))} className="inline-flex min-h-11 items-center border border-line px-3 text-sm font-semibold text-ink">
                Hold
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Remove this comment and its replies?")) return;
                  void run(deleteComment(comment.id));
                }}
                className="inline-flex min-h-11 items-center px-3 text-sm text-ink"
              >
                Remove
              </button>
            </div>
            <ReplyBox commentId={comment.id} onDone={(text) => void run(replyToComment({ commentId: comment.id, body: text }))} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReplyBox({ commentId, onDone }: { commentId: number; onDone: (body: string) => void }) {
  const [body, setBody] = useState("");
  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        onDone(body);
        setBody("");
      }}
    >
      <label htmlFor={`reply-${commentId}`} className="text-sm text-ink">
        Reply as Vamos
      </label>
      <textarea id={`reply-${commentId}`} value={body} onChange={(event) => setBody(event.target.value)} rows={3} className="mt-1 w-full border border-line bg-paper px-3 py-3 text-base text-ink" />
      <button type="submit" className="mt-2 inline-flex min-h-11 items-center bg-amber px-3 text-sm font-semibold text-amber-ink">
        Publish reply
      </button>
    </form>
  );
}
