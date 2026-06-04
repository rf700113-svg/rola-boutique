import { promises as fs } from "fs";
import path from "path";
import { categories, categoryOptions, getCategoryLabel, type ProductCategory } from "@/lib/product-categories";

export type { ProductCategory };
export { categories, categoryOptions, getCategoryLabel };

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number | null;
  category: ProductCategory;
  sizes: string[];
  colors: string[];
  description: string;
  image: string;
  sortOrder?: number;
  isActive: boolean;
  isNew: boolean;
  showOnHome?: boolean;
  isBestSeller?: boolean;
  lineInquiryText?: string;
  badge?: string;
  featured?: "new" | "best";
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");

async function ensureProductsFile() {
  await fs.mkdir(path.dirname(productsFilePath), { recursive: true });
  try {
    await fs.access(productsFilePath);
  } catch {
    await fs.writeFile(productsFilePath, "[]\n", "utf8");
  }
}

function hydrateProduct(product: Product): Product {
  return {
    ...product,
    badge: product.isNew ? "New" : product.isBestSeller ? "Best Seller" : undefined,
    featured: product.isNew ? "new" : product.isBestSeller ? "best" : undefined
  };
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    const aHasSort = typeof a.sortOrder === "number";
    const bHasSort = typeof b.sortOrder === "number";

    if (aHasSort && bHasSort && a.sortOrder !== b.sortOrder) {
      return (a.sortOrder as number) - (b.sortOrder as number);
    }

    if (aHasSort && !bHasSort) return -1;
    if (!aHasSort && bHasSort) return 1;
    return b.id - a.id;
  });
}

export async function getAllProducts({ includeHidden = false } = {}) {
  await ensureProductsFile();
  const content = await fs.readFile(productsFilePath, "utf8");
  const products = JSON.parse(content) as Product[];
  const hydrated = sortProducts(products.map(hydrateProduct));

  return includeHidden ? hydrated : hydrated.filter((product) => product.isActive);
}

export async function saveProducts(products: Product[]) {
  await ensureProductsFile();
  const persistedProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    category: product.category,
    sizes: product.sizes,
    colors: product.colors,
    description: product.description,
    image: product.image,
    ...(typeof product.sortOrder === "number" ? { sortOrder: product.sortOrder } : {}),
    isActive: product.isActive,
    isNew: product.isNew,
    ...(typeof product.showOnHome === "boolean" ? { showOnHome: product.showOnHome } : {}),
    ...(typeof product.isBestSeller === "boolean" ? { isBestSeller: product.isBestSeller } : {}),
    ...(product.lineInquiryText ? { lineInquiryText: product.lineInquiryText } : {})
  }));

  await fs.writeFile(productsFilePath, `${JSON.stringify(persistedProducts, null, 2)}\n`, "utf8");
}

export async function getProductBySlug(slug: string, { includeHidden = false } = {}) {
  const products = await getAllProducts({ includeHidden });
  return products.find((product) => product.slug === slug);
}

export async function getProductsByFeature(feature: "new" | "best") {
  const products = await getAllProducts();
  return feature === "new"
    ? products.filter((product) => product.showOnHome ?? product.isNew)
    : products.filter((product) => product.isBestSeller);
}

export function formatPrice(price: number | null | undefined) {
  if (price === null || typeof price === "undefined") {
    return "請洽 LINE";
  }

  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
  }).format(price);
}

export function toArrayFromInput(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createSlug(name: string, id: number) {
  const asciiSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return asciiSlug || `product-${id}`;
}
