import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { lineUrl as fallbackLineUrl } from "@/lib/contact";
import { getCategoryLabel, type Product, formatPrice } from "@/lib/products";

const fashionFallbacks: Record<string, string> = {
  Dresses: "/uploads/products/rola-look-09.jpg",
  Tops: "/uploads/products/rola-look-02.jpg",
  Bottoms: "/uploads/products/rola-look-10.jpg",
  Outerwear: "/uploads/products/rola-look-01.jpg",
  Accessories: "/uploads/products/rola-look-12.jpg",
  Sale: "/uploads/products/rola-look-11.jpg"
};

function getDisplayImage(product: Product) {
  return product.image && !product.image.startsWith("/placeholders/")
    ? product.image
    : fashionFallbacks[product.category];
}

function createInquiryUrl(product: Product, lineUrl: string) {
  const message = product.lineInquiryText || `我想詢問這件商品：${product.name}`;
  const separator = lineUrl.includes("?") ? "&" : "?";
  return `${lineUrl}${separator}text=${encodeURIComponent(message)}`;
}

export function ProductCard({ product, rank, lineUrl = fallbackLineUrl }: { product: Product; rank?: number; lineUrl?: string }) {
  const badge = rank ? `No.${rank}` : product.isNew ? "NEW" : product.isBestSeller ? "BEST" : "";

  return (
    <article className="group bg-cream/40 transition duration-[400ms] hover:-translate-y-[6px] hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[5/6] overflow-hidden bg-ivory sm:aspect-[3/4]">
          <Image
            src={getDisplayImage(product)}
            alt={product.name}
            fill
            className="object-cover object-top transition duration-[400ms] group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
          />
          {badge ? (
            <span className="absolute left-2.5 top-2.5 bg-cream px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-charcoal sm:left-3 sm:top-3 sm:px-3 sm:text-[11px] sm:tracking-[0.18em]">
              {badge}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex min-h-[140px] flex-col p-3 pt-3.5 sm:min-h-[160px] sm:p-4 sm:pt-5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-charcoal/45 sm:text-xs">{getCategoryLabel(product.category)}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-[13px] font-medium leading-5 text-charcoal transition hover:text-champagne sm:text-base sm:leading-6">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2.5 text-[16px] tracking-wide text-charcoal/80 sm:mt-3 sm:text-[15px]">
          {formatPrice(product.price)}
        </p>
        <a
          href={createInquiryUrl(product, lineUrl)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-fit items-center gap-1.5 border border-[#06C755] bg-[#06C755] px-2.5 py-1.5 text-[11px] tracking-[0.08em] text-white transition hover:border-[#05B54D] hover:bg-[#05B54D] sm:mt-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.12em]"
        >
          <MessageCircle size={14} />
          LINE 詢問尺寸
        </a>
      </div>
    </article>
  );
}
