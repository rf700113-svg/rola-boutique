import Link from "next/link";
import {
  saveHomeSettingsAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction
} from "@/app/admin/actions";
import {
  getBrandSettings,
  getHomeSettings,
  getSeoSettings,
  getSettingsStoreStatus,
  getSocialSettings
} from "@/lib/settings";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ error?: string; errorMessage?: string; saved?: string }>;
};

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";
const cardClass = "bg-ivory p-5 sm:p-7";

const adminTabs = [
  { label: "商品管理", href: "/admin/products" },
  { label: "首頁設定", href: "#home" },
  { label: "社群設定", href: "#social" },
  { label: "SEO 設定", href: "#seo" }
];

function AdminTabs() {
  return (
    <nav className="mt-7 flex gap-3 overflow-x-auto border-b border-stone pb-4">
      {adminTabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`shrink-0 border px-4 py-2 text-sm transition ${
            tab.href === "/admin/products"
              ? "border-stone bg-white text-charcoal hover:border-champagne hover:text-champagne"
              : "border-charcoal bg-charcoal text-white"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function Status({ saved, errorMessage }: { saved?: string; errorMessage?: string }) {
  return (
    <>
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已儲存。</div> : null}
      {errorMessage ? <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
    </>
  );
}

function StoreNotice({ configured, requiresSupabase, message }: { configured: boolean; requiresSupabase: boolean; message: string }) {
  if (configured) {
    return (
      <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-7 text-green-700">
        已連線 Supabase。網站設定會儲存在 Supabase Database，網站圖片會上傳到 site-images。
      </div>
    );
  }

  if (requiresSupabase) {
    return (
      <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
        {message || "尚未設定 Supabase，請先設定資料庫連線。"}
      </div>
    );
  }

  return (
    <div className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
      目前未設定 Supabase，本機開發暫時使用 JSON fallback。部署到 Vercel 前請設定 Supabase。
    </div>
  );
}

function SaveButton() {
  return <button className="min-h-12 w-full bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white sm:w-fit">儲存設定</button>;
}

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const storeStatus = getSettingsStoreStatus();
  const [home, social, brand, seo] = await Promise.all([
    getHomeSettings(),
    getSocialSettings(),
    getBrandSettings(),
    getSeoSettings()
  ]);

  return (
    <>
      <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">網站設定</h1>
      <AdminTabs />
      <StoreNotice configured={storeStatus.configured} requiresSupabase={storeStatus.requiresSupabase} message={storeStatus.message} />
      <Status saved={params?.saved} errorMessage={params?.errorMessage} />

      <div className="mt-8 grid gap-8">
        <section id="home" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">首頁設定</h2>
          <form action={saveHomeSettingsAction} className="mt-7 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Logo 主文字<input name="logoText" defaultValue={brand.logoText} className={inputClass} /></label>
              <label className={labelClass}>Logo 副文字<input name="brandSubtitle" defaultValue={brand.brandSubtitle} className={inputClass} /></label>
            </div>
            <label className={labelClass}>
              Hero 圖片
              <input name="heroImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
              <span className="break-all text-xs text-charcoal/50">目前圖片：{home.heroImage}</span>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Hero 小標<input name="heroKicker" defaultValue={home.heroKicker} className={inputClass} /></label>
              <label className={labelClass}>Hero 主標<input name="heroTitle" defaultValue={home.heroTitle} className={inputClass} /></label>
              <label className={labelClass}>Hero 副標<input name="heroSubtitle" defaultValue={home.heroSubtitle} className={inputClass} /></label>
              <label className={labelClass}>首頁新品顯示數量<input name="newArrivalCount" type="number" min="1" max="8" defaultValue={home.newArrivalCount} className={inputClass} /></label>
            </div>
            <label className={labelClass}>Hero 內文<textarea name="heroDescription" rows={4} defaultValue={home.heroDescription} className={inputClass} /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Hero 第一顆按鈕文字<input name="primaryButtonText" defaultValue={home.primaryButtonText} className={inputClass} /></label>
              <label className={labelClass}>Hero 第一顆按鈕連結<input name="primaryButtonLink" defaultValue={home.primaryButtonLink} className={inputClass} /></label>
              <label className={labelClass}>Hero 第二顆按鈕文字<input name="secondaryButtonText" defaultValue={home.secondaryButtonText} className={inputClass} /></label>
              <label className={labelClass}>Hero 第二顆按鈕連結<input name="secondaryButtonLink" defaultValue={home.secondaryButtonLink} className={inputClass} /></label>
              <label className={labelClass}>LINE 區塊標題<input name="lineTitle" defaultValue={home.lineTitle} className={inputClass} /></label>
              <label className={labelClass}>LINE 區塊副標<input name="lineSubtitle" defaultValue={home.lineSubtitle} className={inputClass} /></label>
              <label className={labelClass}>LINE 按鈕文字<input name="lineButtonText" defaultValue={home.lineButtonText} className={inputClass} /></label>
              <label className={labelClass}>Facebook 按鈕文字<input name="facebookButtonText" defaultValue={home.facebookButtonText} className={inputClass} /></label>
              <label className={labelClass}>Footer 文字<input name="footerText" defaultValue={home.footerText} className={inputClass} /></label>
            </div>
            <SaveButton />
          </form>

        </section>

        <section id="social" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">社群設定</h2>
          <form action={saveSocialSettingsAction} className="mt-7 grid gap-5">
            <label className={labelClass}>LINE 官方帳號連結<input name="lineUrl" defaultValue={social.lineUrl} className={inputClass} /></label>
            <label className={labelClass}>Facebook 粉絲頁連結<input name="facebookUrl" defaultValue={social.facebookUrl} className={inputClass} /></label>
            <label className={labelClass}>Instagram 連結<input name="instagramUrl" defaultValue={social.instagramUrl} className={inputClass} /></label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showLineButton" type="checkbox" defaultChecked={social.showLineButton} />顯示 LINE 按鈕</label>
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showFacebookButton" type="checkbox" defaultChecked={social.showFacebookButton} />顯示 Facebook 按鈕</label>
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showFloatingLine" type="checkbox" defaultChecked={social.showFloatingLine} />顯示右下 LINE 浮動按鈕</label>
            </div>
            <SaveButton />
          </form>
        </section>

        <section id="seo" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">SEO 設定</h2>
          <form action={saveSeoSettingsAction} className="mt-7 grid gap-5">
            <label className={labelClass}>網站 Title<input name="title" defaultValue={seo.title} className={inputClass} /></label>
            <label className={labelClass}>網站 Description<textarea name="description" rows={3} defaultValue={seo.description} className={inputClass} /></label>
            <label className={labelClass}>
              OG Image
              <input name="ogImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
              <span className="break-all text-xs text-charcoal/50">目前圖片：{seo.ogImage}</span>
            </label>
            <label className={labelClass}>OG Title<input name="ogTitle" defaultValue={seo.ogTitle} className={inputClass} /></label>
            <label className={labelClass}>OG Description<textarea name="ogDescription" rows={3} defaultValue={seo.ogDescription} className={inputClass} /></label>
            <SaveButton />
          </form>
        </section>
      </div>
    </>
  );
}
