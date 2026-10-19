import { Suspense } from "react";
import { CallBar, CallBarLive } from "@/components/marketing/call-bar";
import { SiteFooter, SiteFooterLive } from "@/components/marketing/site-footer";
import { SiteHeader, SiteHeaderLive } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<SiteHeader spanish={false} />}>
        <SiteHeaderLive />
      </Suspense>
      <main id="content" className="pb-24 md:pb-0">
        {children}
      </main>
      <Suspense fallback={<SiteFooter spanish={false} />}>
        <SiteFooterLive />
      </Suspense>
      <Suspense fallback={<CallBar spanish={false} />}>
        <CallBarLive />
      </Suspense>
    </>
  );
}
