import Link from "next/link";
import { saveProductAction, toggleProductFlagAction } from "@/app/admin/actions";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { ProductImageInput } from "@/components/admin/ProductImageInput";
import {
  categoryOptions,
  formatPrice,
  getAllProducts,
  getCategoryLabel,
  getProductImages,
  getProductStoreStatus,
  type Product
} from "@/lib/products";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
    errorMessage?: string;
    saved?: string;
    updated?: string;
    deleted?: string;
    edit?: string;
  }>;
};

type ToggleField = "isActive" | "isNew" | "showOnHome";

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";

const adminTabs = [
  { label: "商品管理", href: "/admin/products" },
  { label: "首頁設定", href: "/admin/settings#home" },
  { label: "社群設定", href: "/admin/settings#social" },
  { label: "SEO 設定", href: "/admin/settings#seo" }
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
              ? "border-charcoal bg-charcoal text-white"
              : "border-stone bg-white text-charcoal hover:border-champagne hover:text-champagne"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function Status({
  saved,
  updated,
  deleted,
  errorMessage
}: {
  saved?: string;
  updated?: string;
  deleted?: string;
  errorMessage?: string;
}) {
  return (
    <>
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已儲存。</div> : null}
      {updated ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已更新。</div> : null}
      {deleted ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已刪除。</div> : null}
      {errorMessage ? <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
    </>
  );
}

function StoreNotice({
  configured,
  requiresSupabase,
  message,
  missingEnvVars = []
}: {
  configured: boolean;
  requiresSupabase: boolean;
  message: string;
  missingEnvVars?: string[];
}) {
  if (configured) {
    return (
      <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-7 text-green-700">
        已連線 Supabase。商品資料儲存在 Supabase Database，商品圖片儲存在 Supabase Storage。
      </div>
    );
  }

  if (requiresSupabase) {
    return (
      <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
        {message || "尚未設定 Supabase，請先設定資料庫連線。"}
        {missingEnvVars.length > 0 ? <div className="mt-2">缺少環境變數：{missingEnvVars.join("、")}</div> : null}
      </div>
    );
  }

  return (
    <div className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
      目前未設定 Supabase，本機開發暫時使用 JSON fallback。部署到 Vercel 前請設定 Supabase。
      {missingEnvVars.length > 0 ? <div className="mt-2">尚未設定：{missingEnvVars.join("、")}</div> : null}
    </div>
  );
}

function AdminErrorPanel({ message }: { message: string }) {
  return (
    <section className="mt-6 border border-red-200 bg-red-50 p-5 text-red-800">
      <h2 className="text-lg font-medium">商品管理載入失敗</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{message}</p>
      <div className="mt-4 text-sm leading-7 text-red-700">
        <p>請檢查以下項目：</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Supabase 連線是否正確。</li>
          <li>products table 是否已建立。</li>
          <li>products 欄位是否與 supabase/schema.sql 一致。</li>
          <li>SUPABASE_SERVICE_ROLE_KEY 是否有權限讀寫資料。</li>
          <li>Storage bucket 是否已建立 product-images。</li>
        </ul>
      </div>
    </section>
  );
}

function ProductForm({ product, disabled = false }: { product?: Product; disabled?: boolean }) {
  const productImages = product ? getProductImages(product) : [];

  return (
    <section className="mt-8 bg-ivory p-5 sm:p-7">
      <h2 className="font-serif text-3xl text-charcoal">{product ? "編輯商品" : "新增商品"}</h2>
      <form action={saveProductAction} className="mt-7 grid gap-5">
        {product ? <input type="hidden" name="id" value={product.id} /> : null}
        <div className="grid gap-4 md:grid-cols-[1fr_180px_140px]">
          <label className={labelClass}>
            商品名稱
            <input name="name" defaultValue={product?.name} required disabled={disabled} className={inputClass} />
          </label>
          <label className={labelClass}>
            商品價格
            <input name="price" type="text" defaultValue={product?.price ?? ""} placeholder="可留空，前台顯示請洽 LINE" disabled={disabled} className={inputClass} />
          </label>
          <label className={labelClass}>
            排序
            <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? ""} disabled={disabled} className={inputClass} />
          </label>
        </div>
        <label className={labelClass}>
          商品分類
          <select name="category" defaultValue={product?.category ?? "Dresses"} disabled={disabled} className={inputClass}>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            庫存狀態
            <select name="stockStatus" defaultValue={product?.stockStatus ?? "現貨"} disabled={disabled} className={inputClass}>
              <option value="現貨">現貨</option>
              <option value="預購">預購</option>
              <option value="售完">售完</option>
            </select>
          </label>
          <label className={labelClass}>
            庫存數量
            <input name="stockQuantity" type="number" min="0" defaultValue={product?.stockQuantity ?? 0} disabled={disabled} className={inputClass} />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            商品尺寸
            <input name="sizes" defaultValue={product?.sizes.join(", ")} disabled={disabled} className={inputClass} />
          </label>
          <label className={labelClass}>
            商品顏色
            <input name="colors" defaultValue={product?.colors.join(", ")} disabled={disabled} className={inputClass} />
          </label>
        </div>
        <label className={labelClass}>
          商品描述
          <textarea name="description" rows={4} defaultValue={product?.description} disabled={disabled} className={inputClass} />
        </label>
        <label className={labelClass}>
          LINE 詢問文字
          <textarea name="lineInquiryText" rows={2} defaultValue={product?.lineInquiryText ?? ""} disabled={disabled} className={inputClass} />
        </label>
        {productImages.length > 0 ? (
          <div className="grid gap-3">
            <p className="text-sm text-charcoal/70">目前商品圖片</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {productImages.map((image, index) => (
                <div key={`${image}-${index}`} className="border border-stone bg-white p-3">
                  <img src={image} alt="" className="h-40 w-full bg-cream object-cover object-top" />
                  <input type="hidden" name="existingImages" value={image} />
                  <div className="mt-3 grid gap-2">
                    <label className="grid gap-1 text-xs text-charcoal/60">
                      排序
                      <input
                        name={`imageSort-${index}`}
                        type="number"
                        defaultValue={index + 1}
                        min="1"
                        max="10"
                        disabled={disabled}
                        className="border border-stone bg-white px-2 py-2 text-charcoal"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-red-700">
                      <input name={`removeImage-${index}`} type="checkbox" disabled={disabled} />
                      刪除此圖片
                    </label>
                    {index === 0 ? <span className="text-xs text-champagne">目前封面</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <ProductImageInput disabled={disabled} currentImage={productImages[0]} currentCount={productImages.length} />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} disabled={disabled} />
            上架
          </label>
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm">
            <input name="isNew" type="checkbox" defaultChecked={product?.isNew ?? false} disabled={disabled} />
            新品
          </label>
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm">
            <input name="showOnHome" type="checkbox" defaultChecked={product?.showOnHome ?? product?.isNew ?? false} disabled={disabled} />
            首頁顯示
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button disabled={disabled} className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-50">
            {product ? "儲存修改" : "新增商品"}
          </button>
          {product ? (
            <Link href="/admin/products" className="inline-flex min-h-12 items-center justify-center border border-stone px-5 py-3 text-sm">
              取消編輯
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function StatusBadge({ active, trueText, falseText }: { active: boolean; trueText: string; falseText: string }) {
  return (
    <span className={`inline-flex min-w-16 justify-center px-3 py-1 text-xs ${active ? "bg-charcoal text-white" : "bg-stone text-charcoal"}`}>
      {active ? trueText : falseText}
    </span>
  );
}

function ToggleButton({
  id,
  field,
  value,
  trueText,
  falseText,
  disabled
}: {
  id: string;
  field: ToggleField;
  value: boolean;
  trueText: string;
  falseText: string;
  disabled?: boolean;
}) {
  return (
    <form action={toggleProductFlagAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={String(!value)} />
      <button
        disabled={disabled}
        className={`min-h-9 w-full border px-3 py-1.5 text-xs transition disabled:cursor-not-allowed disabled:opacity-50 ${
          value
            ? "border-charcoal bg-charcoal text-white hover:bg-white hover:text-charcoal"
            : "border-stone bg-white text-charcoal hover:border-champagne hover:text-champagne"
        }`}
      >
        {value ? trueText : falseText}
      </button>
    </form>
  );
}

function ProductList({ products, disabled }: { products: Product[]; disabled: boolean }) {
  if (products.length === 0) {
    return <div className="bg-ivory px-5 py-10 text-center text-sm text-charcoal/60">目前尚未建立商品。</div>;
  }

  return (
    <div className="overflow-hidden bg-ivory">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-[0.12em] text-charcoal/55">
            <tr>
              <th className="px-4 py-4 font-medium">縮圖</th>
              <th className="px-4 py-4 font-medium">商品名稱</th>
              <th className="px-4 py-4 font-medium">價格</th>
              <th className="px-4 py-4 font-medium">分類</th>
              <th className="px-4 py-4 font-medium">圖片數量</th>
              <th className="px-4 py-4 font-medium">上架</th>
              <th className="px-4 py-4 font-medium">新品</th>
              <th className="px-4 py-4 font-medium">首頁顯示</th>
              <th className="px-4 py-4 font-medium">排序</th>
              <th className="px-4 py-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const images = getProductImages(product);
              const coverImage = images[0] || product.image;
              return (
              <tr key={product.id} className="border-t border-stone align-middle">
                <td className="px-4 py-4">
                  {coverImage ? <img src={coverImage} alt="" className="h-24 w-16 bg-cream object-cover object-top" /> : <div className="h-24 w-16 bg-stone" />}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-charcoal">{product.name}</p>
                  <p className="mt-1 max-w-xs truncate text-xs text-charcoal/45">{product.lineInquiryText || "未設定 LINE 詢問文字"}</p>
                </td>
                <td className="px-4 py-4 text-charcoal/70">{formatPrice(product.price)}</td>
                <td className="px-4 py-4 text-charcoal/70">{getCategoryLabel(product.category)}</td>
                <td className="px-4 py-4 text-charcoal/70">{images.length} 張</td>
                <td className="px-4 py-4"><StatusBadge active={product.isActive} trueText="上架" falseText="下架" /></td>
                <td className="px-4 py-4"><StatusBadge active={product.isNew} trueText="新品" falseText="一般" /></td>
                <td className="px-4 py-4"><StatusBadge active={Boolean(product.showOnHome)} trueText="顯示" falseText="隱藏" /></td>
                <td className="px-4 py-4 text-charcoal/70">{product.sortOrder ?? "未設定"}</td>
                <td className="px-4 py-4">
                  <div className="grid min-w-36 gap-2">
                    <Link href={`/admin/products?edit=${product.id}`} className="min-h-9 border border-charcoal px-3 py-1.5 text-center text-xs text-charcoal transition hover:bg-charcoal hover:text-white">
                      編輯
                    </Link>
                    <ToggleButton id={product.id} field="isActive" value={product.isActive} trueText="改為下架" falseText="改為上架" disabled={disabled} />
                    <ToggleButton id={product.id} field="isNew" value={product.isNew} trueText="取消新品" falseText="設為新品" disabled={disabled} />
                    <ToggleButton id={product.id} field="showOnHome" value={Boolean(product.showOnHome)} trueText="取消首頁" falseText="顯示首頁" disabled={disabled} />
                    <DeleteProductForm id={product.id} name={product.name} disabled={disabled} />
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {products.map((product) => {
          const images = getProductImages(product);
          const coverImage = images[0] || product.image;
          return (
          <article key={product.id} className="border border-stone bg-white p-4">
            <div className="flex gap-4">
              {coverImage ? <img src={coverImage} alt="" className="h-28 w-20 shrink-0 bg-cream object-cover object-top" /> : <div className="h-28 w-20 shrink-0 bg-stone" />}
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-charcoal">{product.name}</h3>
                <p className="mt-1 text-sm text-charcoal/60">{formatPrice(product.price)} / {getCategoryLabel(product.category)}</p>
                <p className="mt-1 text-xs text-charcoal/45">排序：{product.sortOrder ?? "未設定"}</p>
                <p className="mt-1 text-xs text-charcoal/45">圖片：{images.length} 張</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge active={product.isActive} trueText="上架" falseText="下架" />
                  <StatusBadge active={product.isNew} trueText="新品" falseText="一般" />
                  <StatusBadge active={Boolean(product.showOnHome)} trueText="首頁" falseText="不顯示" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link href={`/admin/products?edit=${product.id}`} className="min-h-10 border border-charcoal px-3 py-2 text-center text-xs text-charcoal">
                編輯
              </Link>
              <DeleteProductForm id={product.id} name={product.name} disabled={disabled} />
              <ToggleButton id={product.id} field="isActive" value={product.isActive} trueText="改為下架" falseText="改為上架" disabled={disabled} />
              <ToggleButton id={product.id} field="isNew" value={product.isNew} trueText="取消新品" falseText="設為新品" disabled={disabled} />
              <ToggleButton id={product.id} field="showOnHome" value={Boolean(product.showOnHome)} trueText="取消首頁" falseText="顯示首頁" disabled={disabled} />
            </div>
          </article>
        )})}
      </div>
    </div>
  );
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const storeStatus = getProductStoreStatus();
  let products: Product[] = [];
  let loadError = "";

  try {
    products = await getAllProducts({ includeHidden: true });
  } catch (error) {
    console.error("Admin products page error:", error);
    loadError = error instanceof Error ? error.message : String(error);
  }

  const editingProduct = params?.edit ? products.find((product) => product.id === params.edit) : undefined;
  const disableProductActions = Boolean(loadError) || (storeStatus.requiresSupabase && !storeStatus.configured);

  return (
    <>
      <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">商品管理</h1>
      <AdminTabs />
      <StoreNotice
        configured={storeStatus.configured}
        requiresSupabase={storeStatus.requiresSupabase}
        message={storeStatus.message}
        missingEnvVars={storeStatus.missingEnvVars}
      />
      <Status saved={params?.saved} updated={params?.updated} deleted={params?.deleted} errorMessage={params?.errorMessage} />
      {loadError ? <AdminErrorPanel message={loadError} /> : null}
      <ProductForm product={editingProduct} disabled={disableProductActions} />

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl text-charcoal">商品列表</h2>
            <p className="mt-2 text-sm text-charcoal/55">依排序由小到大顯示，未設定排序的商品會依新增時間排在後方。</p>
          </div>
          <p className="text-sm text-charcoal/55">{products.length} 件商品</p>
        </div>
        <ProductList products={products} disabled={disableProductActions} />
      </section>
    </>
  );
}
