import Link from "next/link";
import { ArrowRight, Facebook, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { facebookUrl, lineUrl } from "@/lib/contact";
import { getProductsByFeature } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const newArrivals = await getProductsByFeature("new");
  const visibleNewArrivals = newArrivals.slice(0, 8);

  return (
    <>
      <section
        className="relative flex h-[72vh] min-h-[540px] items-center overflow-hidden bg-charcoal bg-cover bg-[60%_center] sm:h-[clamp(680px,65vh,760px)] sm:bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(20,20,20,0.45) 0%, rgba(20,20,20,0.22) 35%, rgba(20,20,20,0.05) 70%, rgba(20,20,20,0) 100%), url('/uploads/branding/hero-rola-main.jpg')"
        }}
      >
        <div className="w-full -translate-y-[5%] px-5 pb-10 pt-24 sm:px-[9vw] sm:pb-12">
          <div className="w-[86%] max-w-[410px] text-[#F6F2ED] sm:w-full sm:max-w-[520px]">
            <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-white/75 sm:mb-6 sm:text-[12px] sm:tracking-[0.42em]">
              LUXURY FASHION BOUTIQUE
            </p>
            <h1 className="font-playfair text-[clamp(34px,9.6vw,50px)] font-medium leading-none tracking-[0.17em] sm:text-[clamp(45px,5.4vw,76px)] sm:tracking-[0.18em]">
              ROLA
            </h1>
            <p className="mt-5 whitespace-nowrap font-serif text-[clamp(15px,4.2vw,22px)] leading-tight text-[#F6F2ED] sm:mt-6 sm:text-[clamp(19px,2vw,30px)]">
              Timeless Elegance Since 2012
            </p>
            <p className="mt-5 whitespace-pre-line text-[14px] leading-[1.8] text-white/88 sm:mt-6 sm:text-[17px] sm:leading-[1.9]">
              獻給懂得生活品味的妳，{"\n"}
              從日常到重要時刻，{"\n"}
              用質感穿搭展現自信與優雅。
            </p>
            <div className="mt-7 grid gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
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
                className="inline-flex min-h-10 items-center justify-center gap-2 border border-white px-5 py-2.5 text-xs tracking-[0.14em] text-white transition hover:bg-white hover:text-black sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm sm:tracking-[0.16em]"
              >
                加入 LINE 諮詢
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 bg-cream px-4 pb-20 pt-16 sm:px-6 sm:pb-[120px] sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="NEW ARRIVAL" title="新品上市" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {visibleNewArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-charcoal px-7 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              查看全部商品
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto flex min-h-[250px] max-w-3xl flex-col items-center justify-center text-center sm:min-h-[300px]">
          <p className="text-xs uppercase tracking-[0.34em] text-champagne">ABOUT ROLA</p>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            真正的優雅，不需要刻意張揚。
          </h2>
          <div className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-8 text-charcoal/70 sm:text-base">
            ROLA Boutique 創立於 2012 年，{"\n"}
            獻給重視質感與生活品味的女性。{"\n\n"}
            從日常穿搭到重要場合，{"\n"}
            我們相信服裝不只是穿著，{"\n"}
            更是一種自信與態度。
          </div>
          <div className="mt-7 grid w-full max-w-xl gap-3 sm:flex sm:justify-center">
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center border border-charcoal px-6 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              了解品牌故事
            </Link>
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-charcoal px-6 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              <MessageCircle size={17} />
              加入 LINE
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-charcoal px-6 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              <Facebook size={17} />
              追蹤 Facebook
            </a>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-4 py-20 sm:px-6 sm:py-[120px] lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-champagne">LINE Official</p>
            <h2 className="mt-4 font-serif text-4xl text-charcoal">加入 ROLA LINE 官方帳號</h2>
            <p className="mt-5 text-charcoal/70">尺寸建議｜新品詢問｜一對一穿搭服務</p>
          </div>
          <a
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-charcoal px-7 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne"
          >
            <MessageCircle size={18} />
            立即加入 LINE
          </a>
        </div>
      </section>
    </>
  );
}
