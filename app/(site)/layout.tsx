import type { ReactNode } from "react";
import { FloatingLineButton } from "@/components/FloatingLineButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getBrandSettings, getSocialSettings } from "@/lib/settings";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [social, brand] = await Promise.all([getSocialSettings(), getBrandSettings()]);

  return (
    <>
      <Header logoText={brand.logoText} brandSubtitle={brand.brandSubtitle} lineUrl={social.lineUrl} />
      <main>{children}</main>
      <Footer brand={brand} social={social} />
      {social.showLineButton ? <FloatingLineButton lineUrl={social.lineUrl} /> : null}
    </>
  );
}
