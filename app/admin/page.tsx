import Link from "next/link";
import { redirect } from "next/navigation";
import {
  loginAction,
  logoutAction,
  saveBrandSettingsAction,
  saveHomeSettingsAction,
  saveProductAction,
  saveSeoSettingsAction,
  saveSocialSettingsAction
} from "@/app/admin/actions";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { categoryOptions, formatPrice, getAllProducts, getCategoryLabel, type Product } from "@/lib/products";
import {
  type BrandSettings,
  type HomeSettings,
  type SeoSettings,
  type SocialSettings,
  getBrandSettings,
  getHomeSettings,
  getSeoSettings,
  getSocialSettings
} from "@/lib/settings";

export const dynamic = "force-dynamic";

type AdminTab = "products" | "home" | "social" | "brand" | "seo";

type AdminPageProps = {
  searchParams?: Promise<{
    tab?: AdminTab;
    error?: string;
    errorMessage?: string;
    saved?: string;
    deleted?: string;
    edit?: string;
  }>;
};

const tabs: { id: AdminTab; label: string }[] = [
  { id: "products", label: "商品管理" },
  { id: "home", label: "首頁設定" },
  { id: "social", label: "社群連結" },
  { id: "brand", label: "品牌設定" },
  { id: "seo", label: "SEO 設定" }
];

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";
const cardClass = "bg-ivory p-5 sm:p-7";

function TextInput({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required = false,
  min
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        min={min}
        className={inputClass}
      />
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-3 border border-stone bg-white px-4 py-3 text-sm text-charcoal">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

function ProductFields({ product }: { product?: Product }) {
  return (
    <>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-4 md:grid-cols-[1fr_180px_140px]">
        <TextInput label="商品名稱" name="name" defaultValue={product?.name} required />
        <TextInput label="商品價格" name="price" type="number" min="0" defaultValue={product?.price} placeholder="可留空" />
        <TextInput label="商品排序" name="sortOrder" type="number" defaultValue={product?.sortOrder} placeholder="數字越小越前面" />
      </div>

      <label className={labelClass}>
        商品分類
        <select name="category" defaultValue={product?.category ?? "Dresses"} className={inputClass}>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="商品尺寸" name="sizes" defaultValue={product?.sizes.join(", ")} placeholder="例如：M, L, XL" />
        <TextInput label="商品顏色" name="colors" defaultValue={product?.colors.join(", ")} placeholder="例如：奶茶色, 黑色" />
      </div>

      <label className={labelClass}>
        商品描述
        <textarea name="description" defaultValue={product?.description} rows={4} className={inputClass} />
      </label>

      <label className={labelClass}>
        LINE 詢問文字
        <textarea
          name="lineInquiryText"
          defaultValue={product?.lineInquiryText ?? (product ? `我想詢問這件商品：${product.name}` : "")}
          rows={2}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        商品圖片
        <input
          name="imageFile"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white"
        />
        <span className="text-xs text-charcoal/50">
          支援 jpg、jpeg、png、webp，5MB 以內。{product?.image ? `目前圖片：${product.image}` : ""}
        </span>
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <Checkbox label="上架到前台" name="isActive" defaultChecked={product?.isActive ?? true} />
        <Checkbox label="顯示在首頁新品" name="isNew" defaultChecked={product?.isNew ?? false} />
        <Checkbox label="保留熱銷標記" name="isBestSeller" defaultChecked={product?.isBestSeller ?? false} />
      </div>
    </>
  );
}

function LoginForm({ hasError }: { hasError: boolean }) {
  return (
    <div className="min-h-[calc(100svh-73px)] bg-cream px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md bg-ivory p-7 sm:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-champagne">ROLA Admin</p>
        <h1 className="mt-4 font-serif text-4xl text-charcoal">後台登入</h1>
        <p className="mt-4 leading-7 text-charcoal/65">請輸入管理員帳號密碼，登入後即可管理網站內容。</p>

        {hasError ? (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            帳號或密碼錯誤，請確認環境變數 ADMIN_USERNAME / ADMIN_PASSWORD。
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 grid gap-4">
          <TextInput label="帳號" name="username" required />
          <TextInput label="密碼" name="password" type="password" required />
          <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne">
            登入後台
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusMessages({ saved, deleted, errorMessage }: { saved?: string; deleted?: string; errorMessage?: string }) {
  return (
    <>
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已成功儲存。</div> : null}
      {deleted ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">商品已刪除。</div> : null}
      {errorMessage ? (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}
    </>
  );
}

function ProductsAdmin({ products, editId }: { products: Product[]; editId?: string }) {
  const editingProduct = editId ? products.find((product) => product.id === Number(editId)) : undefined;

  return (
    <>
      <section className={cardClass}>
        <h2 className="font-serif text-3xl text-charcoal">{editingProduct ? "編輯商品" : "新增商品"}</h2>
        <form action={saveProductAction} className="mt-7 grid gap-5">
          <ProductFields product={editingProduct} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne">
              {editingProduct ? "儲存修改" : "新增商品"}
            </button>
            {editingProduct ? (
              <Link href="/admin?tab=products" className="inline-flex min-h-12 items-center justify-center border border-stone px-5 py-3 text-sm text-charcoal">
                取消編輯
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-charcoal">商品列表</h2>
          <p className="text-sm text-charcoal/55">{products.length} 件商品</p>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-ivory p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt="" className="h-24 w-16 bg-cream object-cover object-top" />
                  <div>
                    <h3 className="text-lg font-medium text-charcoal">{product.name}</h3>
                    <p className="mt-1 text-sm text-charcoal/55">
                      {formatPrice(product.price)} / {getCategoryLabel(product.category)}
                    </p>
                    <p className="mt-1 text-xs text-charcoal/45">排序：{product.sortOrder ?? "未設定"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-xs ${product.isActive ? "bg-charcoal text-white" : "bg-stone text-charcoal"}`}>
                    {product.isActive ? "上架" : "下架"}
                  </span>
                  {product.isNew ? <span className="bg-champagne px-3 py-1 text-xs text-white">新品</span> : null}
                  <Link href={`/admin?tab=products&edit=${product.id}`} className="min-h-11 border border-charcoal px-5 py-2 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
                    編輯
                  </Link>
                  <DeleteProductForm id={product.id} name={product.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function HomeSettingsAdmin({ settings }: { settings: HomeSettings }) {
  return (
    <section className={cardClass}>
      <h2 className="font-serif text-3xl text-charcoal">首頁設定</h2>
      <form action={saveHomeSettingsAction} className="mt-7 grid gap-5">
        <label className={labelClass}>
          Hero 圖片
          <input name="heroImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
          <span className="text-xs text-charcoal/50">目前圖片：{settings.heroImage}</span>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Hero 主標" name="heroTitle" defaultValue={settings.heroTitle} />
          <TextInput label="Hero 副標" name="heroSubtitle" defaultValue={settings.heroSubtitle} />
        </div>
        <label className={labelClass}>
          Hero 內文
          <textarea name="heroIntro" defaultValue={settings.heroIntro} rows={4} className={inputClass} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="第一顆按鈕文字" name="primaryButtonText" defaultValue={settings.primaryButtonText} />
          <TextInput label="第一顆按鈕連結" name="primaryButtonLink" defaultValue={settings.primaryButtonLink} />
          <TextInput label="第二顆按鈕文字" name="secondaryButtonText" defaultValue={settings.secondaryButtonText} />
          <TextInput label="第二顆按鈕連結" name="secondaryButtonLink" defaultValue={settings.secondaryButtonLink} />
          <TextInput label="首頁新品顯示數量" name="newArrivalCount" type="number" defaultValue={settings.newArrivalCount} />
        </div>
        <SaveButton />
      </form>
    </section>
  );
}

function SocialSettingsAdmin({ settings }: { settings: SocialSettings }) {
  return (
    <section className={cardClass}>
      <h2 className="font-serif text-3xl text-charcoal">社群連結</h2>
      <form action={saveSocialSettingsAction} className="mt-7 grid gap-5">
        <TextInput label="LINE 官方帳號連結" name="lineUrl" defaultValue={settings.lineUrl} />
        <TextInput label="Facebook 粉絲頁連結" name="facebookUrl" defaultValue={settings.facebookUrl} />
        <TextInput label="Instagram 連結" name="instagramUrl" defaultValue={settings.instagramUrl} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="顯示 LINE 按鈕" name="showLineButton" defaultChecked={settings.showLineButton} />
          <Checkbox label="顯示 Facebook 按鈕" name="showFacebookButton" defaultChecked={settings.showFacebookButton} />
        </div>
        <SaveButton />
      </form>
    </section>
  );
}

function BrandSettingsAdmin({ settings }: { settings: BrandSettings }) {
  return (
    <section className={cardClass}>
      <h2 className="font-serif text-3xl text-charcoal">品牌設定</h2>
      <form action={saveBrandSettingsAction} className="mt-7 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="網站名稱" name="siteName" defaultValue={settings.siteName} />
          <TextInput label="Logo 文字" name="logoText" defaultValue={settings.logoText} />
          <TextInput label="Since 年份" name="sinceYear" defaultValue={settings.sinceYear} />
          <TextInput label="Footer 文字" name="footerText" defaultValue={settings.footerText} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="Footer 顯示 LINE" name="footerShowLine" defaultChecked={settings.footerShowLine} />
          <Checkbox label="Footer 顯示 Facebook" name="footerShowFacebook" defaultChecked={settings.footerShowFacebook} />
        </div>
        <SaveButton />
      </form>
    </section>
  );
}

function SeoSettingsAdmin({ settings }: { settings: SeoSettings }) {
  return (
    <section className={cardClass}>
      <h2 className="font-serif text-3xl text-charcoal">SEO 設定</h2>
      <form action={saveSeoSettingsAction} className="mt-7 grid gap-5">
        <TextInput label="網站 Title" name="title" defaultValue={settings.title} />
        <label className={labelClass}>
          網站 Description
          <textarea name="description" defaultValue={settings.description} rows={4} className={inputClass} />
        </label>
        <label className={labelClass}>
          Open Graph 分享圖
          <input name="ogImageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
          <span className="text-xs text-charcoal/50">目前圖片：{settings.ogImage}</span>
        </label>
        <TextInput label="分享標題" name="ogTitle" defaultValue={settings.ogTitle} />
        <label className={labelClass}>
          分享描述
          <textarea name="ogDescription" defaultValue={settings.ogDescription} rows={4} className={inputClass} />
        </label>
        <SaveButton />
      </form>
    </section>
  );
}

function SaveButton() {
  return (
    <button className="min-h-12 w-full bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne sm:w-fit">
      儲存設定
    </button>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginForm hasError={params?.error === "1"} />;
  }

  if (!process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }

  const activeTab = tabs.some((tab) => tab.id === params?.tab) ? (params?.tab as AdminTab) : "products";
  const [products, homeSettings, socialSettings, brandSettings, seoSettings] = await Promise.all([
    getAllProducts({ includeHidden: true }),
    getHomeSettings(),
    getSocialSettings(),
    getBrandSettings(),
    getSeoSettings()
  ]);

  return (
    <div className="bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 border-b border-stone pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">ROLA Admin</p>
            <h1 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">網站管理後台</h1>
            <p className="mt-4 leading-7 text-charcoal/65">管理商品、首頁、社群、品牌與 SEO，不需要修改程式碼。</p>
          </div>
          <form action={logoutAction}>
            <button className="border border-charcoal px-5 py-3 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
              登出
            </button>
          </form>
        </div>

        <StatusMessages saved={params?.saved} deleted={params?.deleted} errorMessage={params?.errorMessage} />

        <nav className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin?tab=${tab.id}`}
              className={`shrink-0 border px-4 py-2 text-sm transition ${
                activeTab === tab.id
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-stone bg-white text-charcoal hover:border-champagne hover:text-champagne"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          {activeTab === "products" ? <ProductsAdmin products={products} editId={params?.edit} /> : null}
          {activeTab === "home" ? <HomeSettingsAdmin settings={homeSettings} /> : null}
          {activeTab === "social" ? <SocialSettingsAdmin settings={socialSettings} /> : null}
          {activeTab === "brand" ? <BrandSettingsAdmin settings={brandSettings} /> : null}
          {activeTab === "seo" ? <SeoSettingsAdmin settings={seoSettings} /> : null}
        </div>
      </div>
    </div>
  );
}
