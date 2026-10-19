import type { ReactNode } from "react";
import { AdminFrame } from "@/components/admin/admin-frame";
import { requireAdmin } from "@/lib/admin/auth";

export async function AdminShell({ current, children }: { current: string; children: ReactNode }) {
  const actor = await requireAdmin();
  return (
    <AdminFrame name={actor.name} current={current}>
      {children}
    </AdminFrame>
  );
}
