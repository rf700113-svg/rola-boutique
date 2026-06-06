"use client";

import Link from "next/link";
import { Facebook, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { facebookUrl, lineUrl } from "@/lib/contact";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export function MobileMenu({ navItems }: { navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
      return;
    }

    document.body.style.overflow = "hidden";
    document.body.classList.add("mobile-menu-open");

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="relative z-[10003] flex h-12 min-h-12 w-12 min-w-12 items-center justify-center border border-stone text-charcoal xl:hidden"
        type="button"
        aria-label={isOpen ? "關閉選單" : "開啟選單"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen ? (
        <div
          className="fixed left-0 top-0 z-[10002] flex h-[100dvh] w-screen flex-col overflow-y-auto bg-cream px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-[88px] xl:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="grid gap-4 text-[23px] font-medium tracking-[0.08em] text-charcoal">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="mt-auto grid gap-3 border-t border-stone pt-6">
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#06C755] bg-[#06C755] px-5 text-[15px] tracking-[0.08em] text-white transition hover:opacity-90"
            >
              <MessageCircle size={18} />
              LINE 一對一詢問
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#1877F2] bg-[#1877F2] px-5 text-[15px] tracking-[0.08em] text-white transition hover:opacity-90"
            >
              <Facebook size={18} />
              Facebook 最新穿搭
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

