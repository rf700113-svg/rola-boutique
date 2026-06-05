import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { ContactButtons } from "@/components/ContactButtons";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice, getAllProducts, getCategoryLabel, getProductBySlug, getProductImages } from "@/lib/products";
import { getSocialSettings } from "@/lib/settings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const fallbackProductImage = "/uploads/products/rola-look-01.jpg";

export const dynamic = "force-dynamic";

function createInquiryUrl(productName: string, lineUrl: string, customText?: string) {
  const message = customText || `我想詢問這件商品：${productName}`;
  const separator = lineUrl.includes("?") ? "&" : "?";
  return `${lineUrl}${separator}text=${encodeURIComponent(message)}`;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} | ROLA Boutique` : "商品不存在 | ROLA Boutique"
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const social = await getSocialSettings();
  const galleryImages = getProductImages(product).filter((image) => !image.startsWith("/placeholders/"));
  const safeGalleryImages = galleryImages.length > 0 ? galleryImages : [fallbackProductImage];
  const products = await getAllProducts();
  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="bg-cream">
      <section className="px-4 py-16 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-champagne">
            <ChevronLeft size={17} />
            返回商品列表
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <ProductGallery images={safeGalleryImages} productName={product.name} />

            <div className="lg:pt-8">
              {product.badge ? (
                <p className="mb-5 inline-flex bg-ivory px-3 py-1 text-xs uppercase tracking-[0.22em] text-champagne">
                  {product.badge}
                </p>
              ) : null}
              <p className="text-sm text-charcoal/50">{getCategoryLabel(product.category)}</p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-charcoal sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-5 text-xl tracking-wide text-charcoal">{formatPrice(product.price)}</p>
              <p className="mt-7 max-w-xl leading-8 text-charcoal/70">{product.description}</p>

              <div className="mt-8 grid gap-7 border-y border-stone py-8 sm:mt-10">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal/50">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="inline-flex min-w-11 justify-center border border-stone px-3 py-2 text-sm text-charcoal">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal/50">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span key={color} className="border border-stone px-4 py-2 text-sm text-charcoal/75">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <a
                  href={createInquiryUrl(product.name, social.lineUrl, product.lineInquiryText)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#06C755] px-6 py-4 text-sm tracking-[0.12em] text-white transition hover:opacity-90"
                >
                  <MessageCircle size={19} />
                  用 LINE 詢問這件商品
                </a>
                <ContactButtons social={social} />
              </div>
            </div>
          </div>

          {related.length > 0 ? (
            <section className="mt-20 border-t border-stone pt-12">
              <h2 className="font-serif text-3xl text-charcoal">相關商品</h2>
              <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} lineUrl={social.lineUrl} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
