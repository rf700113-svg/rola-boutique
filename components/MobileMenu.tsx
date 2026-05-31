"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileMenu({
  navItems,
  isFloating = false
}: {
  navItems: { href: string; label: string }[];
  isFloating?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={`inline-flex h-10 w-10 items-center justify-center border xl:hidden ${
          isFloating ? "border-white/70 text-white" : "border-stone text-charcoal"
        }`}
        type="button"
        aria-label="開啟選單"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-charcoal/35 xl:hidden" role="dialog" aria-modal="true">
          <div className="ml-auto flex h-full w-[86%] max-w-sm flex-col bg-cream px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="block font-playfair text-2xl tracking-[0.24em] text-charcoal">ROLA</span>
                <span className="block text-[10px] uppercase tracking-[0.35em] text-charcoal/60">Boutique</span>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center border border-stone"
                type="button"
                aria-label="關閉選單"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-10 grid gap-5 overflow-y-auto pb-8 text-[22px] font-medium tracking-[0.08em] text-charcoal">
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
