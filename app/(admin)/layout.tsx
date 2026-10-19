import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full bg-paper text-ink">{children}</div>;
}
