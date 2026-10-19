import { CallBar } from "@/components/marketing/call-bar";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main id="content" className="pb-24 md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <CallBar />
    </>
  );
}
