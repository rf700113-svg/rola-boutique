import Link from "next/link";
import {
  saveBrandSettingsAction,
  saveHomeSettingsAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction
} from "@/app/admin/actions";
import { getBrandSettings, getHomeSettings, getSeoSettings, getSocialSettings } from "@/lib/settings";

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
  { label: "社群連結", href: "#social" },
  { label: "品牌設定", href: "#brand" },
  { label: "SEO設定", href: "#seo" }
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
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已成功儲存，前台會立即更新。</div> : null}
      {errorMessage ? <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
    </>
  );
}

function SaveButton() {
  return <button className="min-h-12 w-full bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white sm:w-fit">儲存設定</button>;
}

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [home, social, brand, seo] = await Promise.all([
    getHomeSettings(),
    getSocialSettings(),
    getBrandSettings(),
    getSeoSettings()
  ]);

  return (
    <>
      <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">Site Settings</h1>
      <AdminTabs />
      <Status saved={params?.saved} errorMessage={params?.errorMessage} />

      <div className="mt-8 grid gap-8">
        <section id="brand" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">品牌設定</h2>
          <form action={saveBrandSettingsAction} className="mt-7 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>網站名稱<input name="siteName" defaultValue={brand.siteName} className={inputClass} /></label>
              <label className={labelClass}>品牌名稱<input name="logoText" defaultValue={brand.logoText} className={inputClass} /></label>
              <label className={labelClass}>品牌副標<input name="brandSubtitle" defaultValue={brand.brandSubtitle} className={inputClass} /></label>
              <label className={labelClass}>Since 年份<input name="sinceYear" defaultValue={brand.sinceYear} className={inputClass} /></label>
              <label className={labelClass}>Footer 文字<input name="footerText" defaultValue={brand.footerText} className={inputClass} /></label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="footerShowLine" type="checkbox" defaultChecked={brand.footerShowLine} />Footer 顯示 LINE</label>
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="footerShowFacebook" type="checkbox" defaultChecked={brand.footerShowFacebook} />Footer 顯示 Facebook</label>
            </div>
            <SaveButton />
          </form>
        </section>

        <section id="home" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">首頁設定</h2>
          <form action={saveHomeSettingsAction} className="mt-7 grid gap-5">
            <label className={labelClass}>
              Hero Banner
              <input name="heroImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
              <span className="text-xs text-charcoal/50">目前圖片：{home.heroImage}</span>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>Hero 標題<input name="heroTitle" defaultValue={home.heroTitle} className={inputClass} /></label>
              <label className={labelClass}>Hero 副標題<input name="heroSubtitle" defaultValue={home.heroSubtitle} className={inputClass} /></label>
            </div>
            <label className={labelClass}>Hero 內文<textarea name="heroDescription" rows={4} defaultValue={home.heroDescription} className={inputClass} /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className={labelClass}>按鈕 1 文字<input name="primaryButtonText" defaultValue={home.primaryButtonText} className={inputClass} /></label>
              <label className={labelClass}>按鈕 1 連結<input name="primaryButtonLink" defaultValue={home.primaryButtonLink} className={inputClass} /></label>
              <label className={labelClass}>按鈕 2 文字<input name="secondaryButtonText" defaultValue={home.secondaryButtonText} className={inputClass} /></label>
              <label className={labelClass}>按鈕 2 連結<input name="secondaryButtonLink" defaultValue={home.secondaryButtonLink} className={inputClass} /></label>
              <label className={labelClass}>首頁新品顯示數量<input name="newArrivalCount" type="number" max="8" min="1" defaultValue={home.newArrivalCount} className={inputClass} /></label>
            </div>
            <label className={labelClass}>品牌故事標題<input name="aboutTitle" defaultValue={home.aboutTitle} className={inputClass} /></label>
            <label className={labelClass}>品牌故事內容<textarea name="aboutContent" rows={4} defaultValue={home.aboutContent} className={inputClass} /></label>
            <label className={labelClass}>品牌故事按鈕文字<input name="aboutButtonText" defaultValue={home.aboutButtonText} className={inputClass} /></label>
            <SaveButton />
          </form>
        </section>

        <section id="social" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">社群連結</h2>
          <form action={saveSocialSettingsAction} className="mt-7 grid gap-5">
            <label className={labelClass}>LINE 連結<input name="lineUrl" defaultValue={social.lineUrl} className={inputClass} /></label>
            <label className={labelClass}>Facebook 連結<input name="facebookUrl" defaultValue={social.facebookUrl} className={inputClass} /></label>
            <label className={labelClass}>Instagram 連結<input name="instagramUrl" defaultValue={social.instagramUrl} className={inputClass} /></label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showLineButton" type="checkbox" defaultChecked={social.showLineButton} />顯示 LINE 按鈕</label>
              <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showFacebookButton" type="checkbox" defaultChecked={social.showFacebookButton} />顯示 Facebook 按鈕</label>
            </div>
            <SaveButton />
          </form>
        </section>

        <section id="seo" className={cardClass}>
          <h2 className="font-serif text-3xl text-charcoal">SEO設定</h2>
          <form action={saveSeoSettingsAction} className="mt-7 grid gap-5">
            <label className={labelClass}>網站 Title<input name="title" defaultValue={seo.title} className={inputClass} /></label>
            <label className={labelClass}>網站 Description<textarea name="description" rows={3} defaultValue={seo.description} className={inputClass} /></label>
            <label className={labelClass}>
              Open Graph 分享圖
              <input name="ogImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
              <span className="text-xs text-charcoal/50">目前圖片：{seo.ogImage}</span>
            </label>
            <label className={labelClass}>分享標題<input name="ogTitle" defaultValue={seo.ogTitle} className={inputClass} /></label>
            <label className={labelClass}>分享描述<textarea name="ogDescription" rows={3} defaultValue={seo.ogDescription} className={inputClass} /></label>
            <SaveButton />
          </form>
        </section>
      </div>
    </>
  );
}
