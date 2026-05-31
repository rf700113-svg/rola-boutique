import { ContactButtons } from "@/components/ContactButtons";

export default function ContactPage() {
  return (
    <div className="bg-cream">
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">Contact</p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-charcoal sm:text-7xl">
              聯絡我們
            </h1>
            <p className="mt-7 max-w-lg leading-8 text-charcoal/70">
              歡迎透過 LINE 或 Facebook 詢問尺寸、庫存、穿搭建議與訂購方式。ROLA 會以細緻的選品經驗，協助妳找到適合的日常質感。
            </p>
            <div className="mt-9">
              <ContactButtons />
            </div>
          </div>

          <div className="bg-ivory p-6 sm:p-10">
            <div className="grid gap-8">
              <div className="border-b border-stone pb-7">
                <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">Service</p>
                <p className="mt-3 text-xl text-charcoal">尺寸建議、商品詢問、穿搭搭配</p>
              </div>
              <div className="border-b border-stone pb-7">
                <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">Hours</p>
                <p className="mt-3 text-xl text-charcoal">週一至週六 11:00 - 20:00</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-charcoal/50">Brand</p>
                <p className="mt-3 text-xl text-charcoal">ROLA Boutique Since 2012</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
