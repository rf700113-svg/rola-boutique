"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, isAdminAuthenticated, setAdminSession, validateAdminLogin } from "@/lib/admin-auth";
import {
  type Product,
  type ProductCategory,
  createSlug,
  deleteProductById,
  getAllProducts,
  normalizePrice,
  saveProduct,
  saveProductImage,
  toArrayFromInput
} from "@/lib/products";
import {
  getBrandSettings,
  getHomeSettings,
  getSeoSettings,
  getSocialSettings,
  saveBrandSettings,
  saveHomeSettings,
  saveSeoSettings,
  saveSocialSettings
} from "@/lib/settings";
import { saveSiteImage } from "@/lib/settings";

type AdminTab = "products" | "home" | "social" | "brand" | "seo";
type ToggleField = "isActive" | "isNew" | "showOnHome";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getNumberOrUndefined(formData: FormData, key: string) {
  const value = getString(formData, key);
  if (value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function redirectWithError(tab: AdminTab, error: unknown) {
  const message = error instanceof Error ? error.message : "儲存失敗，請稍後再試。";
  const path = tab === "products" ? "/admin/products" : "/admin/settings";
  redirect(`${path}?errorMessage=${encodeURIComponent(message)}`);
}

async function ensureAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/settings");
}

function buildProductFromForm(formData: FormData, existing?: Product): Product {
  const id = existing?.id ?? crypto.randomUUID();
  const name = getString(formData, "name");
  const sortOrder = getNumberOrUndefined(formData, "sortOrder");

  if (!name) {
    throw new Error("請輸入商品名稱。");
  }

  return {
    id,
    slug: existing?.slug || createSlug(name, id),
    name,
    price: normalizePrice(getString(formData, "price")),
    category: getString(formData, "category") as ProductCategory,
    sizes: toArrayFromInput(formData.get("sizes")),
    colors: toArrayFromInput(formData.get("colors")),
    description: getString(formData, "description"),
    image: existing?.image || "/uploads/products/rola-look-01.jpg",
    ...(typeof sortOrder === "number" ? { sortOrder } : {}),
    isActive: getCheckbox(formData, "isActive"),
    isNew: getCheckbox(formData, "isNew"),
    showOnHome: getCheckbox(formData, "showOnHome"),
    isBestSeller: existing?.isBestSeller ?? false,
    lineInquiryText: getString(formData, "lineInquiryText")
  };
}

export async function loginAction(formData: FormData) {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!validateAdminLogin(username, password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin/products");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  await ensureAdmin();

  try {
    const products = await getAllProducts({ includeHidden: true });
    const idValue = getString(formData, "id");
    const existing = idValue ? products.find((product) => product.id === idValue) : undefined;
    const product = buildProductFromForm(formData, existing);
    const uploadedImage = await saveProductImage(formData.get("imageFile"));

    if (uploadedImage) {
      product.image = uploadedImage;
    }

    await saveProduct(product);
  } catch (error) {
    redirectWithError("products", error);
  }

  revalidateStorefront();
  redirect("/admin/products?saved=1");
}

export async function toggleProductFlagAction(formData: FormData) {
  await ensureAdmin();

  try {
    const id = getString(formData, "id");
    const field = getString(formData, "field") as ToggleField;
    const value = getString(formData, "value") === "true";
    const allowedFields: ToggleField[] = ["isActive", "isNew", "showOnHome"];

    if (!id || !allowedFields.includes(field)) {
      throw new Error("商品狀態更新失敗。");
    }

    const products = await getAllProducts({ includeHidden: true });
    const product = products.find((item) => item.id === id);

    if (!product) {
      throw new Error("找不到商品。");
    }

    await saveProduct({
      ...product,
      [field]: value
    });
  } catch (error) {
    redirectWithError("products", error);
  }

  revalidateStorefront();
  redirect("/admin/products?updated=1");
}

export async function deleteProductAction(formData: FormData) {
  await ensureAdmin();

  try {
    const id = getString(formData, "id");
    await deleteProductById(id);
  } catch (error) {
    redirectWithError("products", error);
  }

  revalidateStorefront();
  redirect("/admin/products?deleted=1");
}

export async function saveHomeSettingsAction(formData: FormData) {
  await ensureAdmin();

  try {
    const existing = await getHomeSettings();
    const existingBrand = await getBrandSettings();
    const heroImage = await saveSiteImage(formData.get("heroImageFile"));
    const newArrivalCount = Number(getString(formData, "newArrivalCount")) || existing.newArrivalCount;

    await saveHomeSettings({
      heroImage: heroImage || existing.heroImage,
      heroKicker: getString(formData, "heroKicker") || existing.heroKicker,
      heroTitle: getString(formData, "heroTitle") || existing.heroTitle,
      heroSubtitle: getString(formData, "heroSubtitle") || existing.heroSubtitle,
      heroDescription: getString(formData, "heroDescription"),
      primaryButtonText: getString(formData, "primaryButtonText") || existing.primaryButtonText,
      primaryButtonLink: getString(formData, "primaryButtonLink") || existing.primaryButtonLink,
      secondaryButtonText: getString(formData, "secondaryButtonText") || existing.secondaryButtonText,
      secondaryButtonLink: getString(formData, "secondaryButtonLink") || existing.secondaryButtonLink,
      newArrivalCount: Math.max(1, Math.min(8, newArrivalCount)),
      lineTitle: getString(formData, "lineTitle") || existing.lineTitle,
      lineSubtitle: getString(formData, "lineSubtitle") || existing.lineSubtitle,
      lineButtonText: getString(formData, "lineButtonText") || existing.lineButtonText,
      facebookButtonText: getString(formData, "facebookButtonText") || existing.facebookButtonText,
      footerText: getString(formData, "footerText") || existing.footerText,
      aboutTitle: getString(formData, "aboutTitle") || existing.aboutTitle,
      aboutContent: getString(formData, "aboutContent") || existing.aboutContent,
      aboutButtonText: getString(formData, "aboutButtonText") || existing.aboutButtonText
    });

    await saveBrandSettings({
      ...existingBrand,
      logoText: getString(formData, "logoText") || existingBrand.logoText,
      brandSubtitle: getString(formData, "brandSubtitle") || existingBrand.brandSubtitle,
      footerText: getString(formData, "footerText") || existingBrand.footerText
    });
  } catch (error) {
    redirectWithError("home", error);
  }

  revalidateStorefront();
  redirect("/admin/settings?saved=1");
}

export async function saveSocialSettingsAction(formData: FormData) {
  await ensureAdmin();

  try {
    const existing = await getSocialSettings();
    await saveSocialSettings({
      lineUrl: getString(formData, "lineUrl") || existing.lineUrl,
      facebookUrl: getString(formData, "facebookUrl") || existing.facebookUrl,
      instagramUrl: getString(formData, "instagramUrl"),
      showFacebookButton: getCheckbox(formData, "showFacebookButton"),
      showLineButton: getCheckbox(formData, "showLineButton"),
      showFloatingLine: getCheckbox(formData, "showFloatingLine")
    });
  } catch (error) {
    redirectWithError("social", error);
  }

  revalidateStorefront();
  redirect("/admin/settings?saved=1");
}

export async function saveBrandSettingsAction(formData: FormData) {
  await ensureAdmin();

  try {
    const existing = await getBrandSettings();
    await saveBrandSettings({
      siteName: getString(formData, "siteName") || existing.siteName,
      logoText: getString(formData, "logoText") || existing.logoText,
      brandSubtitle: getString(formData, "brandSubtitle") || existing.brandSubtitle,
      sinceYear: getString(formData, "sinceYear") || existing.sinceYear,
      footerText: getString(formData, "footerText") || existing.footerText,
      footerShowFacebook: getCheckbox(formData, "footerShowFacebook"),
      footerShowLine: getCheckbox(formData, "footerShowLine")
    });
  } catch (error) {
    redirectWithError("brand", error);
  }

  revalidateStorefront();
  redirect("/admin/settings?saved=1");
}

export async function saveSeoSettingsAction(formData: FormData) {
  await ensureAdmin();

  try {
    const existing = await getSeoSettings();
    const ogImage = await saveSiteImage(formData.get("ogImageFile"));

    await saveSeoSettings({
      title: getString(formData, "title") || existing.title,
      description: getString(formData, "description") || existing.description,
      ogImage: ogImage || existing.ogImage,
      ogTitle: getString(formData, "ogTitle") || existing.ogTitle,
      ogDescription: getString(formData, "ogDescription") || existing.ogDescription
    });
  } catch (error) {
    redirectWithError("seo", error);
  }

  revalidateStorefront();
  redirect("/admin/settings?saved=1");
}
