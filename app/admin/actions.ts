"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, isAdminAuthenticated, setAdminSession, validateAdminLogin } from "@/lib/admin-auth";
import {
  type Product,
  type ProductCategory,
  createSlug,
  getAllProducts,
  saveProducts,
  toArrayFromInput
} from "@/lib/products";
import { getSiteSettings, saveSiteSettings } from "@/lib/site-settings";
import { saveUploadedImage } from "@/lib/upload";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function errorRedirect(tab: "products" | "branding", error: unknown) {
  const message = error instanceof Error ? error.message : "儲存失敗，請稍後再試。";
  redirect(`/admin?tab=${tab}&errorMessage=${encodeURIComponent(message)}`);
}

async function ensureAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin");
}

function buildProductFromForm(formData: FormData, existing?: Product): Product {
  const id = existing?.id ?? Date.now();
  const name = getString(formData, "name");
  const sortValue = getString(formData, "sortOrder");
  const sortOrder = sortValue === "" ? undefined : Number(sortValue);

  return {
    id,
    slug: existing?.slug || createSlug(name, id),
    name,
    price: Number(getString(formData, "price")) || 0,
    category: getString(formData, "category") as ProductCategory,
    sizes: toArrayFromInput(formData.get("sizes")),
    colors: toArrayFromInput(formData.get("colors")),
    description: getString(formData, "description"),
    image: existing?.image || "/uploads/products/rola-look-01.jpg",
    ...(Number.isFinite(sortOrder) ? { sortOrder } : {}),
    isActive: formData.get("isActive") === "on",
    isNew: formData.get("isNew") === "on",
    isBestSeller: formData.get("isBestSeller") === "on"
  };
}

export async function loginAction(formData: FormData) {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!validateAdminLogin(username, password)) {
    redirect("/admin?error=1");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function saveProductAction(formData: FormData) {
  await ensureAdmin();

  try {
    const products = await getAllProducts({ includeHidden: true });
    const idValue = getString(formData, "id");
    const existing = idValue ? products.find((product) => product.id === Number(idValue)) : undefined;
    const product = buildProductFromForm(formData, existing);
    const uploadedImage = await saveUploadedImage(formData.get("imageFile"), "products");

    if (!product.name) {
      throw new Error("請輸入商品名稱。");
    }

    if (uploadedImage) {
      product.image = uploadedImage;
    }

    if (existing) {
      await saveProducts(products.map((item) => (item.id === product.id ? product : item)));
    } else {
      await saveProducts([product, ...products]);
    }
  } catch (error) {
    errorRedirect("products", error);
  }

  revalidateStorefront();
  redirect("/admin?tab=products&saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await ensureAdmin();

  try {
    const id = Number(getString(formData, "id"));
    const products = await getAllProducts({ includeHidden: true });
    await saveProducts(products.filter((product) => product.id !== id));
  } catch (error) {
    errorRedirect("products", error);
  }

  revalidateStorefront();
  redirect("/admin?tab=products&deleted=1");
}

export async function saveSiteSettingsAction(formData: FormData) {
  await ensureAdmin();

  try {
    const existing = await getSiteSettings();
    const logoImage = await saveUploadedImage(formData.get("logoImageFile"), "branding", { allowSvg: true });
    const heroImage = await saveUploadedImage(formData.get("heroImageFile"), "branding");
    const faviconImage = await saveUploadedImage(formData.get("faviconImageFile"), "branding", { allowSvg: true });

    await saveSiteSettings({
      logoImage: logoImage || existing.logoImage,
      heroImage: heroImage || existing.heroImage,
      faviconImage: faviconImage || existing.faviconImage,
      heroTitle: getString(formData, "heroTitle") || existing.heroTitle,
      heroSubtitle: getString(formData, "heroSubtitle") || existing.heroSubtitle,
      heroIntro: getString(formData, "heroIntro") || existing.heroIntro,
      primaryButtonText: getString(formData, "primaryButtonText") || existing.primaryButtonText,
      secondaryButtonText: getString(formData, "secondaryButtonText") || existing.secondaryButtonText,
      brandStoryTitle: getString(formData, "brandStoryTitle") || existing.brandStoryTitle,
      brandStoryContent: getString(formData, "brandStoryContent") || existing.brandStoryContent
    });
  } catch (error) {
    errorRedirect("branding", error);
  }

  revalidateStorefront();
  redirect("/admin?tab=branding&saved=1");
}
