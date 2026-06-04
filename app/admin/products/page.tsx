import Link from "next/link";
import { loginAction, saveProductAction } from "@/app/admin/actions";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { categoryOptions, formatPrice, getAllProducts, getCategoryLabel, type Product } from "@/lib/products";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{ error?: string; errorMessage?: string; saved?: string; deleted?: string; edit?: string }>;
};

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";

const adminTabs = [
  { label: "商品管理", href: "/admin/products" },
  { label: "首頁設定", href: "/admin/settings#home" },
  { label: "社群連結", href: "/admin/settings#social" },
  { label: "品牌設定", href: "/admin/settings#brand" },
  { label: "SEO設定", href: "/admin/settings#seo" }
];

function LoginForm({ hasError }: { hasError: boolean }) {
  return (
    <div className="mx-auto max-w-md bg-ivory p-8">
      <p className="text-xs uppercase tracking-[0.35em] text-champagne">ROLA Admin</p>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">後台登入</h1>
      {hasError ? <p className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">帳號或密碼錯誤。</p> : null}
      <form action={loginAction} className="mt-8 grid gap-4">
        <label className={labelClass}>帳號<input name="username" required className={inputClass} /></label>
        <label className={labelClass}>密碼<input name="password" type="password" required className={inputClass} /></label>
        <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white">登入後台</button>
      </form>
    </div>
  );
}

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

function Status({ saved, deleted, errorMessage }: { saved?: string; deleted?: string; errorMessage?: string }) {
  return (
    <>
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已成功儲存。</div> : null}
      {deleted ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">商品已刪除。</div> : null}
      {errorMessage ? <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
    </>
  );
}

function ProductForm({ product }: { product?: Product }) {
  return (
    <section className="mt-8 bg-ivory p-5 sm:p-7">
      <h2 className="font-serif text-3xl text-charcoal">{product ? "編輯商品" : "新增商品"}</h2>
      <form action={saveProductAction} className="mt-7 grid gap-5">
        {product ? <input type="hidden" name="id" value={product.id} /> : null}
        <div className="grid gap-4 md:grid-cols-[1fr_180px_140px]">
          <label className={labelClass}>名稱<input name="name" defaultValue={product?.name} required className={inputClass} /></label>
          <label className={labelClass}>價格<input name="price" type="number" min="0" defaultValue={product?.price ?? ""} placeholder="可留空" className={inputClass} /></label>
          <label className={labelClass}>排序<input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? ""} className={inputClass} /></label>
        </div>
        <label className={labelClass}>
          分類
          <select name="category" defaultValue={product?.category ?? "Dresses"} className={inputClass}>
            {categoryOptions.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClass}>尺寸<input name="sizes" defaultValue={product?.sizes.join(", ")} className={inputClass} /></label>
          <label className={labelClass}>顏色<input name="colors" defaultValue={product?.colors.join(", ")} className={inputClass} /></label>
        </div>
        <label className={labelClass}>描述<textarea name="description" rows={4} defaultValue={product?.description} className={inputClass} /></label>
        <label className={labelClass}>LINE 詢問文字<textarea name="lineInquiryText" rows={2} defaultValue={product?.lineInquiryText ?? ""} className={inputClass} /></label>
        <label className={labelClass}>
          圖片
          <input name="imageFile" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white" />
          <span className="text-xs text-charcoal/50">{product?.image ? `目前圖片：${product.image}` : "圖片會上傳到 public/uploads/products"}</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} />上架</label>
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="isNew" type="checkbox" defaultChecked={product?.isNew ?? false} />新品</label>
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="showOnHome" type="checkbox" defaultChecked={product?.showOnHome ?? product?.isNew ?? false} />首頁顯示</label>
          <label className="flex gap-3 border border-stone bg-white px-4 py-3 text-sm"><input name="isBestSeller" type="checkbox" defaultChecked={product?.isBestSeller ?? false} />熱銷標記</label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white">{product ? "儲存修改" : "新增商品"}</button>
          {product ? <Link href="/admin/products" className="inline-flex min-h-12 items-center justify-center border border-stone px-5 py-3 text-sm">取消編輯</Link> : null}
        </div>
      </form>
    </section>
  );
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <LoginForm hasError={params?.error === "1"} />;

  const products = await getAllProducts({ includeHidden: true });
  const editingProduct = params?.edit ? products.find((product) => product.id === Number(params.edit)) : undefined;

  return (
    <>
      <h1 className="font-serif text-4xl text-charcoal sm:text-5xl">商品管理</h1>
      <AdminTabs />
      <Status saved={params?.saved} deleted={params?.deleted} errorMessage={params?.errorMessage} />
      <ProductForm product={editingProduct} />
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
                    <p className="mt-1 text-sm text-charcoal/55">{formatPrice(product.price)} / {getCategoryLabel(product.category)}</p>
                    <p className="mt-1 text-xs text-charcoal/45">排序：{product.sortOrder ?? "未設定"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-xs ${product.isActive ? "bg-charcoal text-white" : "bg-stone text-charcoal"}`}>{product.isActive ? "上架" : "下架"}</span>
                  {product.isNew ? <span className="bg-champagne px-3 py-1 text-xs text-white">新品</span> : null}
                  {product.showOnHome ?? product.isNew ? <span className="bg-[#8E7D6B] px-3 py-1 text-xs text-white">首頁</span> : null}
                  <Link href={`/admin/products?edit=${product.id}`} className="min-h-11 border border-charcoal px-5 py-2 text-sm">編輯</Link>
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
