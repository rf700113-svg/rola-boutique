import Link from "next/link";
import { Facebook, MessageCircle } from "lucide-react";
import { facebookUrl, lineUrl } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-stone bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-playfair text-3xl tracking-[0.2em] text-charcoal">ROLA Boutique</p>
          <p className="mt-2 text-xs uppercase tracking-[0.35em] text-charcoal/60">Since 2012</p>
          <p className="mt-6 max-w-sm whitespace-pre-line leading-7 text-charcoal/70">
            獻給重視質感與生活品味的女性。{"\n"}
            從日常穿搭到重要場合，{"\n"}
            以優雅與自信完成屬於妳的風格。
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal">Collection</p>
          <div className="mt-5 grid gap-3 text-sm text-charcoal/70">
            <Link href="/products?category=New%20Arrival">新品上市</Link>
            <Link href="/products?category=Dresses">洋裝</Link>
            <Link href="/products?category=Tops">上衣</Link>
            <Link href="/products?category=Bottoms">褲裝</Link>
            <Link href="/products?category=Outerwear">外套</Link>
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal">Contact</p>
          <div className="mt-5 grid gap-3 text-sm text-charcoal/70">
            <Link href="/about">品牌故事</Link>
            <Link href="/contact">聯絡我們</Link>
            <a href={facebookUrl} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href={lineUrl} target="_blank" rel="noreferrer">
              LINE Official
            </a>
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center border border-charcoal text-charcoal transition hover:border-champagne hover:text-champagne"
              aria-label="Facebook"
            >
              <Facebook size={19} />
            </a>
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center border border-charcoal text-charcoal transition hover:border-champagne hover:text-champagne"
              aria-label="LINE Official"
            >
              <MessageCircle size={19} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-stone px-4 py-5 text-center text-xs text-charcoal/50">
        © 2026 ROLA Boutique Demo. All rights reserved.
      </div>
    </footer>
  );
}
