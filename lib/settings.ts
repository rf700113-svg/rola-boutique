import { promises as fs } from "fs";
import path from "path";
import { uploadSupabaseImage, validateImageFile } from "@/lib/supabase/admin";
import {
  getSupabaseRestHeaders,
  getSupabaseStatus,
  normalizeSupabaseError,
  supabaseMissingMessage
} from "@/lib/supabase/server";

export type HomeSettings = {
  heroImage: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  newArrivalCount: number;
  lineTitle: string;
  lineSubtitle: string;
  lineButtonText: string;
  facebookButtonText: string;
  footerText: string;
  aboutTitle: string;
  aboutContent: string;
  aboutButtonText: string;
};

export type SocialSettings = {
  lineUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  showFacebookButton: boolean;
  showLineButton: boolean;
  showFloatingLine: boolean;
};

export type BrandSettings = {
  siteName: string;
  logoText: string;
  brandSubtitle: string;
  sinceYear: string;
  footerText: string;
  footerShowFacebook: boolean;
  footerShowLine: boolean;
};

export type SeoSettings = {
  title: string;
  description: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
};

type SiteSettingsRow = {
  id: string;
  logo_text: string | null;
  logo_subtitle: string | null;
  hero_image_url: string | null;
  hero_kicker: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_primary_text: string | null;
  hero_primary_url: string | null;
  hero_secondary_text: string | null;
  hero_secondary_url: string | null;
  line_title: string | null;
  line_subtitle: string | null;
  line_button_text: string | null;
  facebook_button_text: string | null;
  footer_text: string | null;
  homepage_product_limit: number | null;
};

type SocialSettingsRow = {
  id: string;
  line_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  show_line_button: boolean | null;
  show_facebook_button: boolean | null;
  show_floating_line: boolean | null;
};

type SeoSettingsRow = {
  id: string;
  title: string | null;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
};

export const defaultHomeSettings: HomeSettings = {
  heroImage: "/uploads/site/hero-boutique-showroom.png",
  heroKicker: "LUXURY FASHION BOUTIQUE",
  heroTitle: "ROLA",
  heroSubtitle: "Timeless Elegance Since 2012",
  heroDescription: "獻給懂得生活品味的妳，\n從日常到重要時刻，\n用質感穿搭展現自信與優雅。",
  primaryButtonText: "探索新品",
  primaryButtonLink: "#new-arrivals",
  secondaryButtonText: "LINE 一對一詢問",
  secondaryButtonLink: "https://line.me/R/ti/p/@sxg2195h",
  newArrivalCount: 6,
  lineTitle: "加入 ROLA LINE",
  lineSubtitle: "新品詢問｜尺寸建議｜一對一穿搭服務",
  lineButtonText: "LINE 一對一詢問",
  facebookButtonText: "Facebook 最新穿搭",
  footerText: "© 2026 ROLA Boutique",
  aboutTitle: "",
  aboutContent: "",
  aboutButtonText: ""
};

export const defaultSocialSettings: SocialSettings = {
  lineUrl: "https://line.me/R/ti/p/@sxg2195h",
  facebookUrl: "https://www.facebook.com/1381990545159062",
  instagramUrl: "",
  showFacebookButton: true,
  showLineButton: true,
  showFloatingLine: true
};

export const defaultBrandSettings: BrandSettings = {
  siteName: "ROLA Boutique",
  logoText: "ROLA",
  brandSubtitle: "BOUTIQUE",
  sinceYear: "2012",
  footerText: "© 2026 ROLA Boutique",
  footerShowFacebook: true,
  footerShowLine: true
};

export const defaultSeoSettings: SeoSettings = {
  title: "ROLA Boutique｜質感女裝選品店",
  description: "ROLA Boutique Since 2012，專注質感與風格的女裝選品，提供新品穿搭、洋裝、外套與一對一 LINE 諮詢服務。",
  ogImage: "/uploads/branding/hero-rola-main.jpg",
  ogTitle: "ROLA Boutique｜質感女裝選品店",
  ogDescription: "質感女裝選品、新品穿搭、洋裝、外套與 LINE 一對一諮詢。"
};

const files = {
  home: "home-settings.json",
  social: "social-settings.json",
  brand: "brand-settings.json",
  seo: "seo-settings.json"
};

export function getSettingsStoreStatus() {
  return getSupabaseStatus();
}

async function readJson<T>(fileName: string, defaults: T): Promise<T> {
  const filePath = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    const content = await fs.readFile(filePath, "utf8");
    return { ...defaults, ...(JSON.parse(content) as Partial<T>) };
  } catch {
    await fs.writeFile(filePath, `${JSON.stringify(defaults, null, 2)}\n`, "utf8");
    return defaults;
  }
}

async function writeJson<T>(fileName: string, data: T) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(supabaseMissingMessage);
  }

  const filePath = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function fetchSingleRow<T>(table: string): Promise<T | null> {
  const status = getSupabaseStatus();

  if (!status.configured) {
    return null;
  }

  const { config, headers } = getSupabaseRestHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}?select=*&id=eq.default&limit=1`, {
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(normalizeSupabaseError(response.status, detail));
  }

  const rows = (await response.json()) as T[];
  return rows[0] ?? null;
}

async function upsertRow(table: string, payload: Record<string, unknown>) {
  const { config, headers } = getSupabaseRestHeaders();
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify({ id: "default", ...payload, updated_at: new Date().toISOString() })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(normalizeSupabaseError(response.status, detail));
  }
}

function siteRowToHome(row: SiteSettingsRow | null): HomeSettings {
  if (!row) return defaultHomeSettings;

  return {
    ...defaultHomeSettings,
    heroImage: row.hero_image_url || defaultHomeSettings.heroImage,
    heroKicker: row.hero_kicker || defaultHomeSettings.heroKicker,
    heroTitle: row.hero_title || defaultHomeSettings.heroTitle,
    heroSubtitle: row.hero_subtitle || defaultHomeSettings.heroSubtitle,
    heroDescription: row.hero_description || defaultHomeSettings.heroDescription,
    primaryButtonText: row.hero_primary_text || defaultHomeSettings.primaryButtonText,
    primaryButtonLink: row.hero_primary_url || defaultHomeSettings.primaryButtonLink,
    secondaryButtonText: row.hero_secondary_text || defaultHomeSettings.secondaryButtonText,
    secondaryButtonLink: row.hero_secondary_url || defaultHomeSettings.secondaryButtonLink,
    newArrivalCount: row.homepage_product_limit || defaultHomeSettings.newArrivalCount,
    lineTitle: row.line_title || defaultHomeSettings.lineTitle,
    lineSubtitle: row.line_subtitle || defaultHomeSettings.lineSubtitle,
    lineButtonText: row.line_button_text || defaultHomeSettings.lineButtonText,
    facebookButtonText: row.facebook_button_text || defaultHomeSettings.facebookButtonText,
    footerText: row.footer_text || defaultHomeSettings.footerText
  };
}

function siteRowToBrand(row: SiteSettingsRow | null): BrandSettings {
  if (!row) return defaultBrandSettings;

  return {
    ...defaultBrandSettings,
    logoText: row.logo_text || defaultBrandSettings.logoText,
    brandSubtitle: row.logo_subtitle || defaultBrandSettings.brandSubtitle,
    footerText: row.footer_text || defaultBrandSettings.footerText
  };
}

function socialRowToSettings(row: SocialSettingsRow | null): SocialSettings {
  if (!row) return defaultSocialSettings;

  return {
    lineUrl: row.line_url || defaultSocialSettings.lineUrl,
    facebookUrl: row.facebook_url || defaultSocialSettings.facebookUrl,
    instagramUrl: row.instagram_url || "",
    showLineButton: row.show_line_button ?? true,
    showFacebookButton: row.show_facebook_button ?? true,
    showFloatingLine: row.show_floating_line ?? true
  };
}

function seoRowToSettings(row: SeoSettingsRow | null): SeoSettings {
  if (!row) return defaultSeoSettings;

  return {
    title: row.title || defaultSeoSettings.title,
    description: row.description || defaultSeoSettings.description,
    ogTitle: row.og_title || defaultSeoSettings.ogTitle,
    ogDescription: row.og_description || defaultSeoSettings.ogDescription,
    ogImage: row.og_image_url || defaultSeoSettings.ogImage
  };
}

function homeToSitePayload(settings: HomeSettings) {
  return {
    hero_image_url: settings.heroImage,
    hero_kicker: settings.heroKicker,
    hero_title: settings.heroTitle,
    hero_subtitle: settings.heroSubtitle,
    hero_description: settings.heroDescription,
    hero_primary_text: settings.primaryButtonText,
    hero_primary_url: settings.primaryButtonLink,
    hero_secondary_text: settings.secondaryButtonText,
    hero_secondary_url: settings.secondaryButtonLink,
    line_title: settings.lineTitle,
    line_subtitle: settings.lineSubtitle,
    line_button_text: settings.lineButtonText,
    facebook_button_text: settings.facebookButtonText,
    footer_text: settings.footerText,
    homepage_product_limit: settings.newArrivalCount
  };
}

function brandToSitePayload(settings: BrandSettings) {
  return {
    logo_text: settings.logoText,
    logo_subtitle: settings.brandSubtitle,
    footer_text: settings.footerText
  };
}

export async function getHomeSettings() {
  const status = getSupabaseStatus();
  if (status.configured) return siteRowToHome(await fetchSingleRow<SiteSettingsRow>("site_settings"));
  if (status.requiresSupabase) return defaultHomeSettings;
  return readJson(files.home, defaultHomeSettings);
}

export async function saveHomeSettings(settings: HomeSettings) {
  const status = getSupabaseStatus();
  if (status.configured) return upsertRow("site_settings", homeToSitePayload(settings));
  return writeJson(files.home, settings);
}

export async function getSocialSettings() {
  const status = getSupabaseStatus();
  if (status.configured) return socialRowToSettings(await fetchSingleRow<SocialSettingsRow>("social_settings"));
  if (status.requiresSupabase) return defaultSocialSettings;
  return readJson(files.social, defaultSocialSettings);
}

export async function saveSocialSettings(settings: SocialSettings) {
  const status = getSupabaseStatus();
  if (status.configured) {
    return upsertRow("social_settings", {
      line_url: settings.lineUrl,
      facebook_url: settings.facebookUrl,
      instagram_url: settings.instagramUrl,
      show_line_button: settings.showLineButton,
      show_facebook_button: settings.showFacebookButton,
      show_floating_line: settings.showFloatingLine
    });
  }
  return writeJson(files.social, settings);
}

export async function getBrandSettings() {
  const status = getSupabaseStatus();
  if (status.configured) return siteRowToBrand(await fetchSingleRow<SiteSettingsRow>("site_settings"));
  if (status.requiresSupabase) return defaultBrandSettings;
  return readJson(files.brand, defaultBrandSettings);
}

export async function saveBrandSettings(settings: BrandSettings) {
  const status = getSupabaseStatus();
  if (status.configured) return upsertRow("site_settings", brandToSitePayload(settings));
  return writeJson(files.brand, settings);
}

export async function getSeoSettings() {
  const status = getSupabaseStatus();
  if (status.configured) return seoRowToSettings(await fetchSingleRow<SeoSettingsRow>("seo_settings"));
  if (status.requiresSupabase) return defaultSeoSettings;
  return readJson(files.seo, defaultSeoSettings);
}

export async function saveSeoSettings(settings: SeoSettings) {
  const status = getSupabaseStatus();
  if (status.configured) {
    return upsertRow("seo_settings", {
      title: settings.title,
      description: settings.description,
      og_title: settings.ogTitle,
      og_description: settings.ogDescription,
      og_image_url: settings.ogImage
    });
  }
  return writeJson(files.seo, settings);
}

export async function saveSiteImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return "";
  }

  const status = getSupabaseStatus();
  validateImageFile(file);

  if (status.configured) {
    return uploadSupabaseImage(file, "site-images");
  }

  if (status.requiresSupabase) {
    throw new Error(supabaseMissingMessage);
  }

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  const uploadDir = path.join(process.cwd(), "public", "uploads", "site");
  await fs.mkdir(uploadDir, { recursive: true });
  const safeName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const destination = path.join(uploadDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destination, buffer);
  return `/uploads/site/${safeName}`;
}
