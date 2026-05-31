import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction, logoutAction, saveProductAction } from "@/app/admin/actions";
import { DeleteProductForm } from "@/components/admin/DeleteProductForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { categoryOptions, formatPrice, getAllProducts, type Product } from "@/lib/products";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
    errorMessage?: string;
    saved?: string;
    deleted?: string;
    edit?: string;
  }>;
};

const inputClass = "border border-stone bg-white px-3 py-3 text-charcoal outline-none focus:border-champagne";
const labelClass = "grid gap-2 text-sm text-charcoal/70";

function ProductFields({ product }: { product?: Product }) {
  return (
    <>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-4 md:grid-cols-[1fr_160px_140px]">
        <label className={labelClass}>
          商品名稱
          <input name="name" defaultValue={product?.name} required className={inputClass} />
        </label>
        <label className={labelClass}>
          價格
          <input name="price" type="number" min="0" defaultValue={product?.price} required className={inputClass} />
        </label>
        <label className={labelClass}>
          排序
          <input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? ""} placeholder="小在前" className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        分類
        <select name="category" defaultValue={product?.category ?? "New Arrival"} className={inputClass}>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          尺寸
          <input name="sizes" defaultValue={product?.sizes.join(", ")} placeholder="例如：S, M, L" className={inputClass} />
        </label>
        <label className={labelClass}>
          顏色
          <input name="colors" defaultValue={product?.colors.join(", ")} placeholder="例如：奶油白, 深灰" className={inputClass} />
        </label>
      </div>

      <label className={labelClass}>
        商品描述
        <textarea name="description" defaultValue={product?.description} rows={4} className={inputClass} />
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
        <label className="flex items-center gap-3 border border-stone bg-white px-4 py-3 text-sm text-charcoal">
          <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} />
          顯示在前台
        </label>
        <label className="flex items-center gap-3 border border-stone bg-white px-4 py-3 text-sm text-charcoal">
          <input name="isNew" type="checkbox" defaultChecked={product?.isNew ?? false} />
          新品
        </label>
        <label className="flex items-center gap-3 border border-stone bg-white px-4 py-3 text-sm text-charcoal">
          <input name="isBestSeller" type="checkbox" defaultChecked={product?.isBestSeller ?? false} />
          熱銷
        </label>
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
        <p className="mt-4 leading-7 text-charcoal/65">請使用環境變數設定的帳號密碼登入。</p>

        {hasError ? (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            帳號或密碼錯誤，或尚未設定 ADMIN_PASSWORD。
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 grid gap-4">
          <label className={labelClass}>
            帳號
            <input name="username" autoComplete="username" required className={inputClass} />
          </label>
          <label className={labelClass}>
            密碼
            <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
          </label>
          <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne">
            登入後台
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusMessages({
  saved,
  deleted,
  errorMessage
}: {
  saved?: string;
  deleted?: string;
  errorMessage?: string;
}) {
  return (
    <>
      {saved ? <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">已儲存。</div> : null}
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
      <section className="mt-10 bg-ivory p-5 sm:p-7">
        <h2 className="font-serif text-3xl text-charcoal">{editingProduct ? "編輯商品" : "新增商品"}</h2>
        <form action={saveProductAction} className="mt-7 grid gap-5">
          <ProductFields product={editingProduct} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="min-h-12 bg-charcoal px-5 py-3 text-sm tracking-[0.16em] text-white transition hover:bg-champagne">
              {editingProduct ? "儲存修改" : "新增商品"}
            </button>
            {editingProduct ? (
              <Link href="/admin" className="inline-flex min-h-12 items-center justify-center border border-stone px-5 py-3 text-sm text-charcoal">
                取消編輯
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-3xl text-charcoal">現有商品</h2>
          <p className="text-sm text-charcoal/55">{products.length} 件</p>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-ivory p-4 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt="" className="h-24 w-16 bg-cream object-cover" />
                  <div>
                    <h3 className="text-lg font-medium text-charcoal">{product.name}</h3>
                    <p className="mt-1 text-sm text-charcoal/55">
                      {formatPrice(product.price)} · {categoryOptions.find((item) => item.value === product.category)?.label}
                    </p>
                    <p className="mt-1 text-xs text-charcoal/45">排序：{product.sortOrder ?? "未設定"}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 text-xs ${product.isActive ? "bg-charcoal text-white" : "bg-stone text-charcoal"}`}>
                    {product.isActive ? "上架" : "隱藏"}
                  </span>
                  {product.isNew ? <span className="bg-champagne px-3 py-1 text-xs text-white">新品</span> : null}
                  {product.isBestSeller ? <span className="bg-[#8E7D6B] px-3 py-1 text-xs text-white">熱銷</span> : null}
                  <Link href={`/admin?edit=${product.id}`} className="min-h-11 border border-charcoal px-5 py-2 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
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

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginForm hasError={params?.error === "1"} />;
  }

  if (!process.env.ADMIN_PASSWORD) {
    redirect("/admin?error=1");
  }

  const products = await getAllProducts({ includeHidden: true });

  return (
    <div className="bg-cream px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 border-b border-stone pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-champagne">ROLA Admin</p>
            <h1 className="mt-4 font-serif text-4xl text-charcoal sm:text-5xl">商品管理後台</h1>
            <p className="mt-4 leading-7 text-charcoal/65">品牌設定已暫時移除，先確保商品管理與後台正常開啟。</p>
          </div>
          <form action={logoutAction}>
            <button className="border border-charcoal px-5 py-3 text-sm text-charcoal transition hover:border-champagne hover:text-champagne">
              登出
            </button>
          </form>
        </div>

        <StatusMessages saved={params?.saved} deleted={params?.deleted} errorMessage={params?.errorMessage} />
        <ProductsAdmin products={products} editId={params?.edit} />
      </div>
    </div>
  );
}
