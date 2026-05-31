import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-cream px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-champagne">Not Found</p>
        <h1 className="mt-5 font-serif text-4xl text-charcoal">找不到這個頁面</h1>
        <p className="mt-5 leading-8 text-charcoal/70">
          這件商品可能已下架，或網址不存在。歡迎回到商品頁繼續瀏覽。
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-charcoal px-7 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne"
        >
          前往商品頁
        </Link>
      </div>
    </section>
  );
}
