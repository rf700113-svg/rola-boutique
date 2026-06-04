import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FloatingLineButton } from "@/components/FloatingLineButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getBrandSettings, getSeoSettings, getSocialSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [
        { url: "/favicon.svg" },
        { url: "/favicon.png", type: "image/png" }
      ]
    },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [seo.ogImage] : []
    }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [social, brand] = await Promise.all([getSocialSettings(), getBrandSettings()]);

  return (
    <html lang="zh-Hant">
      <body className="font-sans antialiased">
        <Header logoText={brand.logoText} lineUrl={social.lineUrl} />
        <main>{children}</main>
        <Footer brand={brand} social={social} />
        {social.showLineButton ? <FloatingLineButton lineUrl={social.lineUrl} /> : null}
      </body>
    </html>
  );
}
