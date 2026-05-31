import { Facebook, MessageCircle } from "lucide-react";
import { facebookUrl, lineUrl } from "@/lib/contact";

export function ContactButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap gap-3" : "grid gap-3 sm:flex"}>
      <a
        href={lineUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-charcoal px-6 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne"
      >
        <MessageCircle size={18} />
        LINE Official
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-2 border border-charcoal px-6 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:border-champagne hover:text-champagne"
      >
        <Facebook size={18} />
        Facebook
      </a>
    </div>
  );
}
