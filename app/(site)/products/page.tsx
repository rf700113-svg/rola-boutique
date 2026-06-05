import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { categories, getAllProducts, type ProductCategory } from "@/lib/products";
import { getSocialSettings } from "@/lib/settings";

type ProductsPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const [products, social] = await Promise.all([getAllProducts(), getSocialSettings()]);
  const selected = params?.category ?? "All";
  const allowed = categories.map((category) => category.value);
  const activeCategory = allowed.includes(selected as ProductCategory | "All") ? selected : "All";
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div className="bg-cream">
      <section className="border-b border-stone px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.3em] text-champagne">Products</p>
          <h1 className="mt-4 font-serif text-4xl text-charcoal sm:text-6xl">商品選品</h1>
          <p className="mt-6 max-w-2xl leading-8 text-charcoal/70">
            精選 ROLA Boutique 質感女裝，從日常穿搭到重要場合，讓妳用簡潔優雅完成風格。
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const href =
                category.value === "All"
                  ? "/products"
                  : `/products?category=${encodeURIComponent(category.value)}`;
              const isActive = activeCategory === category.value;

              return (
                <Link
                  key={category.value}
                  href={href}
                  className={`shrink-0 border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-stone text-charcoal/70 hover:border-champagne hover:text-champagne"
                  }`}
                >
                  {category.label}
                </Link>
              );
            })}
          </div>

          <div className="mb-8 flex items-center justify-between border-b border-stone pb-5 text-sm text-charcoal/60">
            <p>{filteredProducts.length} 件商品</p>
            <p>ROLA Boutique Since 2012</p>
          </div>

          <div className="grid gap-x-5 gap-y-11 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} lineUrl={social.lineUrl} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
