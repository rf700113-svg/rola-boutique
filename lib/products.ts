import { promises as fs } from "fs";
import path from "path";
import { categories, categoryOptions, getCategoryLabel, type ProductCategory } from "@/lib/product-categories";
import { uploadSupabaseImage, validateImageFile } from "@/lib/supabase/admin";
import {
  getSupabaseRestHeaders,
  getSupabaseStatus,
  normalizeSupabaseError,
  supabaseMissingMessage
} from "@/lib/supabase/server";

export type { ProductCategory };
export { categories, categoryOptions, getCategoryLabel };

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
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
  createdAt?: string;
  updatedAt?: string;
};

type SupabaseProductRow = {
  id: string;
  name: string | null;
  price: string | null;
  category: string | null;
  sizes: string | null;
  colors: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  is_new: boolean | null;
  show_on_home: boolean | null;
  line_text: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export function getProductStoreStatus() {
  return getSupabaseStatus();
}

function assertWritableStore() {
  const status = getProductStoreStatus();

  if (status.requiresSupabase && !status.configured) {
    throw new Error(supabaseMissingMessage);
  }
}

async function ensureProductsFile() {
  await fs.mkdir(path.dirname(productsFilePath), { recursive: true });
  try {
    await fs.access(productsFilePath);
  } catch {
    await fs.writeFile(productsFilePath, "[]\n", "utf8");
  }
}

function normalizeCategory(category: string | null | undefined): ProductCategory {
  const zhMap: Record<string, ProductCategory> = {
    洋裝: "Dresses",
    上衣: "Tops",
    褲裝: "Bottoms",
    外套: "Outerwear",
    配件: "Accessories",
    特價: "Sale"
  };
  if (category && zhMap[category]) return zhMap[category];
  const allowed = categoryOptions.map((item) => item.value);
  return allowed.includes(category as ProductCategory) ? (category as ProductCategory) : "Dresses";
}

function normalizeTextArray(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hydrateProduct(product: Partial<Product>): Product {
  const id = String(product.id ?? crypto.randomUUID());
  const name = product.name?.trim() || "未命名商品";
  const isNew = Boolean(product.isNew);
  const isBestSeller = Boolean(product.isBestSeller);

  return {
    id,
    slug: product.slug || createSlug(name, id),
    name,
    price: normalizePrice(product.price),
    category: normalizeCategory(product.category),
    sizes: normalizeTextArray(product.sizes),
    colors: normalizeTextArray(product.colors),
    description: product.description ?? "",
    image: product.image || "/uploads/products/rola-look-01.jpg",
    ...(typeof product.sortOrder === "number" ? { sortOrder: product.sortOrder } : {}),
    isActive: product.isActive ?? true,
    isNew,
    showOnHome: product.showOnHome ?? false,
    isBestSeller,
    lineInquiryText: product.lineInquiryText ?? "",
    badge: isNew ? "New" : isBestSeller ? "Best Seller" : undefined,
    featured: isNew ? "new" : isBestSeller ? "best" : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

function rowToProduct(row: SupabaseProductRow): Product {
  return hydrateProduct({
    id: row.id,
    name: row.name ?? "",
    price: row.price,
    category: normalizeCategory(row.category),
    sizes: normalizeTextArray(row.sizes),
    colors: normalizeTextArray(row.colors),
    description: row.description ?? "",
    image: row.image_url ?? "",
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : undefined,
    isActive: row.is_active ?? true,
    isNew: row.is_new ?? false,
    showOnHome: row.show_on_home ?? false,
    lineInquiryText: row.line_text ?? "",
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined
  });
}

function productToRow(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price ?? null,
    category: product.category,
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    description: product.description,
    image_url: product.image,
    sort_order: typeof product.sortOrder === "number" ? product.sortOrder : null,
    is_active: product.isActive,
    is_new: product.isNew,
    show_on_home: product.showOnHome ?? false,
    line_text: product.lineInquiryText ?? "",
    updated_at: new Date().toISOString()
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

    const aTime = Date.parse(a.createdAt ?? "");
    const bTime = Date.parse(b.createdAt ?? "");
    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }

    return b.id.localeCompare(a.id);
  });
}

async function fetchSupabaseProducts() {
  const { config, headers } = getSupabaseRestHeaders();
  const url = `${config.url}/rest/v1/products?select=*&order=sort_order.asc.nullslast,created_at.desc`;
  const response = await fetch(url, { headers, cache: "no-store" });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(normalizeSupabaseError(response.status, detail));
  }

  const rows = (await response.json()) as SupabaseProductRow[];
  return sortProducts(rows.map(rowToProduct));
}

async function readJsonProducts() {
  await ensureProductsFile();
  const content = await fs.readFile(productsFilePath, "utf8");
  const products = JSON.parse(content) as Partial<Product>[];
  return sortProducts(products.map(hydrateProduct));
}

export async function getAllProducts({ includeHidden = false } = {}) {
  const status = getProductStoreStatus();

  if (status.configured) {
    const products = await fetchSupabaseProducts();
    return includeHidden ? products : products.filter((product) => product.isActive);
  }

  if (status.requiresSupabase) {
    return [];
  }

  const products = await readJsonProducts();
  return includeHidden ? products : products.filter((product) => product.isActive);
}

export async function saveProduct(product: Product) {
  const status = getProductStoreStatus();

  if (status.configured) {
    const { config, headers } = getSupabaseRestHeaders();
    const response = await fetch(`${config.url}/rest/v1/products`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(productToRow(product))
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(normalizeSupabaseError(response.status, detail));
    }

    return;
  }

  assertWritableStore();
  const products = await readJsonProducts();
  const existing = products.some((item) => item.id === product.id);
  const nextProducts = existing ? products.map((item) => (item.id === product.id ? product : item)) : [product, ...products];
  await saveProducts(nextProducts);
}

export async function saveProducts(products: Product[]) {
  assertWritableStore();
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
    showOnHome: product.showOnHome ?? false,
    ...(typeof product.isBestSeller === "boolean" ? { isBestSeller: product.isBestSeller } : {}),
    ...(product.lineInquiryText ? { lineInquiryText: product.lineInquiryText } : {}),
    ...(product.createdAt ? { createdAt: product.createdAt } : {}),
    updatedAt: new Date().toISOString()
  }));

  await fs.writeFile(productsFilePath, `${JSON.stringify(persistedProducts, null, 2)}\n`, "utf8");
}

export async function deleteProductById(id: string) {
  const status = getProductStoreStatus();

  if (status.configured) {
    const { config, headers } = getSupabaseRestHeaders();
    const response = await fetch(`${config.url}/rest/v1/products?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(normalizeSupabaseError(response.status, detail));
    }

    return;
  }

  assertWritableStore();
  const products = await readJsonProducts();
  await saveProducts(products.filter((product) => product.id !== id));
}

export async function saveProductImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return "";
  }

  const extension = validateImageFile(file);

  const status = getProductStoreStatus();
  const safeName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

  if (status.configured) {
    return uploadSupabaseImage(file, "product-images");
  }

  assertWritableStore();
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await fs.mkdir(uploadDir, { recursive: true });
  const destination = path.join(uploadDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destination, buffer);

  return `/uploads/products/${safeName}`;
}

export async function getProductBySlug(slug: string, { includeHidden = false } = {}) {
  const products = await getAllProducts({ includeHidden });
  return products.find((product) => product.slug === slug);
}

export async function getProductsByFeature(feature: "new" | "best") {
  const products = await getAllProducts();
  return feature === "new"
    ? products.filter((product) => product.isActive && product.isNew && product.showOnHome === true)
    : products.filter((product) => product.isBestSeller);
}

export function normalizePrice(price: string | number | null | undefined) {
  if (price === null || typeof price === "undefined") {
    return null;
  }

  const value = String(price).trim();
  return value || null;
}

export function formatPrice(price: string | number | null | undefined) {
  const value = normalizePrice(price);

  if (!value) {
    return "請洽 LINE";
  }

  const numeric = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(numeric)) {
    return value;
  }

  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
  }).format(numeric);
}

export function toArrayFromInput(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return normalizeTextArray(value);
}

export function createSlug(name: string, id: string) {
  const asciiSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return asciiSlug || `product-${id}`;
}
