import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ROLA Admin",
  description: "ROLA Boutique 後台管理",
  openGraph: {
    title: "ROLA Admin",
    description: "ROLA Boutique 後台管理",
    images: []
  }
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
