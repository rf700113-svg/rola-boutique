import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { FloatingLineButton } from "@/components/FloatingLineButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "ROLA Boutique｜質感女裝選品店",
  description:
    "ROLA Boutique Since 2012，專注質感與風格的女裝選品，提供新品穿搭、洋裝、外套與一對一 LINE 諮詢服務。",
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/favicon.png", type: "image/png" }
    ]
  },
  openGraph: {
    title: "ROLA Boutique｜質感女裝選品店",
    description:
      "ROLA Boutique Since 2012，專注質感與風格的女裝選品，提供新品穿搭、洋裝、外套與一對一 LINE 諮詢服務。",
    images: ["/uploads/branding/hero-rola-main.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingLineButton />
      </body>
    </html>
  );
}
