import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-charcoal">
      <header className="sticky top-0 z-[100] h-[72px] border-b border-[#DDD4C8] bg-[#F7F4EF]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/admin/products" className="font-serif text-2xl tracking-[0.08em] text-charcoal">
            ROLA Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="border border-stone px-4 py-2 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
              前往網站
            </Link>
            <form action={logoutAction}>
              <button className="border border-charcoal px-4 py-2 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
                登出
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-12 pb-20 sm:px-8">{children}</main>
    </div>
  );
}
