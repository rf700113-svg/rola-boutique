"use client";

import Link from "next/link";

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-cream px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-champagne">Something went wrong</p>
        <h1 className="mt-5 font-serif text-4xl text-charcoal">頁面暫時無法顯示</h1>
        <p className="mt-5 leading-8 text-charcoal/70">
          請稍後再試，或回到商品頁重新瀏覽。
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-12 items-center justify-center border border-charcoal px-6 py-3 text-sm tracking-[0.16em] text-charcoal transition hover:bg-charcoal hover:text-white"
          >
            重新整理
          </button>
          <Link
            href="/products"
            className="inline-flex min-h-12 items-center justify-center bg-charcoal px-6 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne"
          >
            前往商品頁
          </Link>
        </div>
      </div>
    </section>
  );
}
