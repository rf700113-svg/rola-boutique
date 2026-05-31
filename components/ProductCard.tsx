import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { createLineProductInquiryUrl } from "@/lib/contact";
import { type Product, formatPrice } from "@/lib/products";

const fashionFallbacks: Record<string, string> = {
  "New Arrival": "/uploads/products/rola-look-01.jpg",
  Tops: "/uploads/products/rola-look-02.jpg",
  Bottoms: "/uploads/products/rola-look-12.jpg",
  Dresses: "/uploads/products/rola-look-09.jpg",
  Outerwear: "/uploads/products/rola-look-10.jpg",
  Sale: "/uploads/products/rola-look-11.jpg"
};

function getDisplayImage(product: Product) {
  return product.image && !product.image.startsWith("/placeholders/")
    ? product.image
    : fashionFallbacks[product.category];
}

export function ProductCard({ product, rank }: { product: Product; rank?: number }) {
  const badge = rank ? `No.${rank}` : product.isNew ? "NEW" : product.isBestSeller ? "BEST" : "";

  return (
    <article className="group bg-cream/40 transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
          <Image
            src={getDisplayImage(product)}
            alt={product.name}
            fill
            className="object-cover object-top transition duration-700 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
          />
          {badge ? (
            <span className="absolute left-2.5 top-2.5 bg-cream px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-charcoal sm:left-3 sm:top-3 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              {badge}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex min-h-[154px] flex-col p-3 pt-4 sm:min-h-[166px] sm:p-4 sm:pt-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-charcoal/45 sm:text-xs">{product.category}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-[13px] font-medium leading-5 text-charcoal transition hover:text-champagne sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>
        <p className="mt-3 text-sm tracking-wide text-charcoal/75">{formatPrice(product.price)}</p>
        <a
          href={createLineProductInquiryUrl(product.name)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-fit items-center gap-1.5 border border-stone px-2.5 py-1.5 text-[11px] tracking-[0.1em] text-charcoal transition hover:border-champagne hover:bg-champagne hover:text-white sm:gap-2 sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.12em]"
        >
          <MessageCircle size={14} />
          LINE 詢問
        </a>
      </div>
    </article>
  );
}
