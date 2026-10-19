import { replyLabel, type ReplyMark } from "@/lib/admin/clock";

export function ReplyBadge({ mark }: { mark: ReplyMark }) {
  const urgent = mark.kind === "due" || mark.kind === "waiting" || mark.kind === "late";
  return (
    <span
      className={
        urgent
          ? "inline-flex min-h-7 items-center border border-amber bg-amber/20 px-2 text-sm font-medium text-ink"
          : "inline-flex min-h-7 items-center border border-line bg-panel px-2 text-sm text-muted"
      }
    >
      {replyLabel(mark)}
    </span>
  );
}
