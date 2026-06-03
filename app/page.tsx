import Link from "next/link";
import { ArrowRight, Facebook, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { facebookUrl, lineUrl } from "@/lib/contact";
import { getProductsByFeature } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const newArrivals = await getProductsByFeature("new");
  const visibleNewArrivals = newArrivals.slice(0, 6);

  return (
    <>
      <section
        className="relative flex h-[58vh] min-h-[460px] items-center overflow-hidden bg-charcoal bg-cover bg-[60%_center] sm:h-[55vh] sm:min-h-[500px] sm:bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(20,20,20,0.45) 0%, rgba(20,20,20,0.22) 35%, rgba(20,20,20,0.05) 70%, rgba(20,20,20,0) 100%), url('/uploads/branding/hero-rola-main.jpg')"
        }}
      >
        <div className="w-full -translate-y-[5%] px-5 pb-6 pt-20 sm:px-[9vw] sm:pt-24">
          <div className="w-[86%] max-w-[390px] text-[#F6F2ED] sm:w-full sm:max-w-[520px]">
            <p className="mb-4 text-[10px] uppercase tracking-[0.32em] text-white/75 sm:mb-5 sm:text-[12px] sm:tracking-[0.42em]">
              Luxury Fashion Boutique
            </p>
            <h1 className="font-playfair text-[clamp(31px,8.4vw,46px)] font-medium leading-none tracking-[0.17em] sm:text-[clamp(42px,5vw,68px)] sm:tracking-[0.18em]">
              ROLA
            </h1>
            <p className="mt-4 whitespace-nowrap font-serif text-[clamp(14px,3.8vw,20px)] leading-tight text-[#F6F2ED] sm:mt-5 sm:text-[clamp(19px,2vw,30px)]">
              Timeless Elegance Since 2012
            </p>
            <div className="mt-6 grid gap-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-3">
              <Link
                href="/products?category=New%20Arrival"
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#F6F2ED] bg-[#F6F2ED] px-5 py-2.5 text-xs tracking-[0.14em] text-[#1D1B19] transition hover:bg-transparent hover:text-white sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
              >
                探索新品
                <ArrowRight size={16} />
              </Link>
              <a
                href={lineUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#06C755] bg-[#06C755] px-5 py-2.5 text-xs tracking-[0.14em] text-white transition hover:border-[#05B54D] hover:bg-[#05B54D] sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
              >
                <MessageCircle size={16} />
                LINE 一對一詢問
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="new-arrival" className="bg-cream px-4 py-12 sm:px-6 sm:py-18 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="NEW ARRIVAL" title="新品上市" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 sm:gap-y-11 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-12">
            {visibleNewArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 text-center sm:mt-12">
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-charcoal px-7 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              查看全部商品
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="line-official" className="bg-ivory px-4 py-11 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-champagne">LINE Official</p>
            <h2 className="mt-2 whitespace-nowrap font-serif text-[clamp(30px,8vw,42px)] leading-[1.25] tracking-normal text-charcoal sm:text-[clamp(42px,4vw,58px)]">
              加入 ROLA LINE
            </h2>
            <p className="mt-2 text-sm leading-7 text-charcoal/70 sm:text-base">
              新品詢問｜尺寸建議｜一對一穿搭服務
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:items-center">
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="mx-[30px] inline-flex h-12 items-center justify-center gap-2 border border-[#06C755] bg-[#06C755] px-6 text-[15px] tracking-[0.08em] text-white transition hover:border-[#05B54D] hover:bg-[#05B54D] sm:mx-0 sm:w-auto sm:px-7"
            >
              <MessageCircle size={18} />
              LINE 一對一詢問
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="mx-[30px] inline-flex h-12 items-center justify-center gap-2 border border-[#1877F2] bg-[#1877F2] px-6 text-[15px] tracking-[0.08em] text-white transition hover:border-[#166FE5] hover:bg-[#166FE5] sm:mx-0 sm:w-auto sm:px-7"
            >
              <Facebook size={18} />
              Facebook 最新穿搭
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
