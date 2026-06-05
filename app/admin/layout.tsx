import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ROLA Admin",
  description: "ROLA Boutique 網站管理後台",
  openGraph: {
    title: "ROLA Admin",
    description: "ROLA Boutique 網站管理後台",
    images: []
  }
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
