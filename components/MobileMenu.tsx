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
        className={`relative z-[10000] inline-flex h-11 w-11 items-center justify-center border xl:hidden ${
          isFloating ? "border-white/75 text-white" : "border-stone text-charcoal"
        }`}
        type="button"
        aria-label="開啟選單"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {isOpen ? (
        <div className="fixed left-0 top-0 z-[10001] h-[100dvh] w-screen bg-cream xl:hidden" role="dialog" aria-modal="true">
          <div className="flex h-full flex-col px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-playfair text-2xl tracking-[0.24em] text-charcoal">ROLA</span>
                <span className="block text-[10px] uppercase tracking-[0.32em] text-charcoal/60">Boutique</span>
              </div>
              <button
                className="inline-flex h-11 w-11 items-center justify-center border border-stone"
                type="button"
                aria-label="關閉選單"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-10 grid gap-[18px] overflow-y-auto pb-8 text-[23px] font-medium tracking-[0.08em] text-charcoal">
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
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-charcoal px-5 py-2.5 text-sm tracking-[0.14em] text-white"
              >
                <MessageCircle size={17} />
                加入 LINE
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-charcoal px-5 py-2.5 text-sm tracking-[0.14em] text-charcoal"
              >
                <Facebook size={17} />
                追蹤 Facebook
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
