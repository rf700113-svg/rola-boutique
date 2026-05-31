"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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
        <div className="fixed inset-0 z-[10001] bg-charcoal/35 xl:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="關閉選單背景"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[86%] max-w-sm flex-col bg-cream px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-5 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
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

            <nav className="mt-9 grid gap-[18px] overflow-y-auto pb-10 text-[22px] font-medium tracking-[0.08em] text-charcoal">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
