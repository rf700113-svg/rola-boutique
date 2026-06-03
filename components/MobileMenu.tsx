"use client";

import Link from "next/link";
import { Facebook, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { facebookUrl, lineUrl } from "@/lib/contact";

export function MobileMenu({
  navItems,
  isFloating = false
}: {
  navItems: { href: string; label: string }[];
  isFloating?: boolean;
}) {
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

  return (
    <>
      <button
        className={`relative z-[10002] inline-flex h-12 min-h-12 w-12 min-w-12 items-center justify-center border xl:hidden ${
          isFloating ? "border-stone text-charcoal sm:border-white/75 sm:text-white" : "border-stone text-charcoal"
        }`}
        type="button"
        aria-label="開啟選單"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={24} />
      </button>

      {isOpen ? (
        <div
          className="fixed left-0 top-0 z-[10001] h-[100dvh] w-screen overflow-y-auto bg-cream xl:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex min-h-[100dvh] flex-col px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-playfair text-2xl tracking-[0.24em] text-charcoal">ROLA</span>
                <span className="block text-[10px] uppercase tracking-[0.32em] text-charcoal/60">Boutique</span>
              </div>
              <button
                className="inline-flex h-12 min-h-12 w-12 min-w-12 items-center justify-center border border-stone"
                type="button"
                aria-label="關閉選單"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-9 grid gap-4 overflow-y-auto pb-8 text-[23px] font-medium tracking-[0.08em] text-charcoal">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto grid gap-3 border-t border-stone pt-6">
              <a
                href={lineUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#06C755] bg-[#06C755] px-5 text-[15px] tracking-[0.08em] text-white transition hover:border-[#05B54D] hover:bg-[#05B54D]"
              >
                <MessageCircle size={18} />
                LINE 一對一詢問
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 border border-[#1877F2] bg-[#1877F2] px-5 text-[15px] tracking-[0.08em] text-white transition hover:border-[#166FE5] hover:bg-[#166FE5]"
              >
                <Facebook size={18} />
                Facebook 最新穿搭
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
