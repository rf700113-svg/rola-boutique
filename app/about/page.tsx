import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Ruler, Shirt } from "lucide-react";
import { lineUrl } from "@/lib/contact";

const values = [
  ["01", "版型", "重視修飾比例與舒適度，讓成熟身形也能穿得自在俐落。"],
  ["02", "布料", "偏好有垂墜、觸感與耐穿性的材質，呈現低調卻精緻的質感。"],
  ["03", "細節", "以領口、釦件、蕾絲與剪裁細節，讓簡約穿搭更有記憶點。"]
];

const promises = [
  "以 35 至 60 歲女性的日常需求作為選品核心",
  "提供尺寸與版型建議，降低線上購買的不確定感",
  "商品以實穿、耐看、好搭配為優先，不追求一次性流行",
  "透過 LINE 與 Facebook 回覆商品、庫存與搭配問題"
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">About ROLA</p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-charcoal sm:text-7xl">
              Timeless Elegance Since 2012
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-9 text-charcoal/70">
            ROLA Boutique 是一間質感女裝選品店，從 2012 年開始陪伴成熟女性建立穩定而優雅的穿衣風格。
            我們相信，真正值得留下的衣服，不只漂亮，也要能修飾身形、適合生活，並在重要時刻讓妳感到安心。
          </p>
        </div>
      </section>

      <section className="bg-ivory px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {values.map(([number, title, copy]) => (
            <div key={number} className="border-t border-charcoal pt-7">
              <p className="font-serif text-4xl text-champagne">{number}</p>
              <h2 className="mt-8 text-xl text-charcoal">{title}</h2>
              <p className="mt-4 leading-8 text-charcoal/70">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="editorial-image min-h-[440px] p-8">
            <p className="font-serif text-5xl tracking-[0.18em] text-charcoal">ROLA</p>
            <p className="mt-3 text-xs uppercase tracking-[0.36em] text-charcoal/60">Boutique Since 2012</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">Our Muse</p>
            <h2 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">
              獻給懂得生活與品味的妳
            </h2>
            <p className="mt-7 leading-8 text-charcoal/70">
              她可能正在經營一份專業、一個家庭，或一段屬於自己的自在時光。
              她喜歡簡潔，但不願失去優雅；她重視實穿，也欣賞衣服裡藏著的細膩。
              ROLA 為這樣的女性挑選衣著。
            </p>
            <Link href="/products" className="mt-9 inline-flex items-center gap-2 text-sm tracking-[0.18em] text-charcoal underline underline-offset-8 hover:text-champagne">
              探索選品
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">Trust</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">讓線上選購也有被照顧的感覺。</h2>
            <p className="mt-7 leading-8 text-white/70">
              我們不把商品只當成照片陳列，而是從顧客的場合、身形與穿搭習慣出發，提供更貼近真實生活的建議。
            </p>
          </div>
          <div className="grid gap-4">
            {promises.map((promise) => (
              <div key={promise} className="flex gap-4 border border-white/15 p-5">
                <CheckCircle2 className="mt-1 shrink-0 text-champagne" size={20} />
                <p className="leading-7 text-white/75">{promise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <div className="bg-ivory p-7">
            <Shirt className="text-champagne" size={26} />
            <h3 className="mt-6 font-serif text-2xl text-charcoal">商品詢問</h3>
            <p className="mt-4 leading-7 text-charcoal/70">確認材質、厚薄、彈性、適合場合與搭配方式。</p>
          </div>
          <div className="bg-ivory p-7">
            <Ruler className="text-champagne" size={26} />
            <h3 className="mt-6 font-serif text-2xl text-charcoal">尺寸建議</h3>
            <p className="mt-4 leading-7 text-charcoal/70">依照身高、體重、肩寬、腰臀圍與平常尺寸給予建議。</p>
          </div>
          <a href={lineUrl} target="_blank" rel="noreferrer" className="bg-charcoal p-7 text-white transition hover:bg-[#414141]">
            <MessageCircle className="text-champagne" size={26} />
            <h3 className="mt-6 font-serif text-2xl">加入 LINE</h3>
            <p className="mt-4 leading-7 text-white/70">獲得新品通知、尺寸建議與專屬優惠。</p>
          </a>
        </div>
      </section>
    </div>
  );
}
