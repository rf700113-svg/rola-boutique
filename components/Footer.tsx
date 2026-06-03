import { Facebook, MessageCircle } from "lucide-react";
import { facebookUrl, lineUrl } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-ivory">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-10 text-center sm:px-6 lg:px-8">
        <div>
          <p className="font-playfair text-[26px] tracking-[0.18em] text-charcoal sm:text-3xl sm:tracking-[0.2em]">
            ROLA Boutique
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/60 sm:text-xs sm:tracking-[0.35em]">
            Since 2012
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-charcoal text-charcoal transition hover:border-champagne hover:text-champagne"
            aria-label="LINE"
          >
            <MessageCircle size={19} />
          </a>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center border border-charcoal text-charcoal transition hover:border-champagne hover:text-champagne"
            aria-label="Facebook"
          >
            <Facebook size={19} />
          </a>
        </div>
      </div>
      <div className="border-t border-stone px-4 py-5 text-center text-xs text-charcoal/50">
        © 2026 ROLA Boutique
      </div>
    </footer>
  );
}
