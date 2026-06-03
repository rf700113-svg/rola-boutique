import { Facebook, MessageCircle } from "lucide-react";
import { facebookUrl, lineUrl } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-ivory">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6 sm:py-10 lg:px-8">
        <div>
          <p className="font-playfair text-[22px] tracking-[0.16em] text-charcoal sm:text-3xl sm:tracking-[0.2em]">
            ROLA Boutique
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-charcoal/60 sm:text-xs sm:tracking-[0.35em]">
            Since 2012
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center border border-[#06C755] bg-[#06C755] text-white transition hover:border-[#05B54D] hover:bg-[#05B54D] sm:h-11 sm:w-11"
            aria-label="LINE"
          >
            <MessageCircle size={18} />
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center border border-[#1877F2] bg-[#1877F2] text-white transition hover:border-[#166FE5] hover:bg-[#166FE5] sm:h-11 sm:w-11"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
        </div>
      </div>
      <div className="border-t border-stone px-4 py-4 text-center text-xs text-charcoal/50">
        © 2026 ROLA Boutique
      </div>
    </footer>
  );
}
