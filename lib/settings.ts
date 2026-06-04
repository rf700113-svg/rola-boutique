import { promises as fs } from "fs";
import path from "path";

export type HomeSettings = {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  newArrivalCount: number;
};

export type SocialSettings = {
  lineUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  showFacebookButton: boolean;
  showLineButton: boolean;
};

export type BrandSettings = {
  siteName: string;
  logoText: string;
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

export const defaultHomeSettings: HomeSettings = {
  heroImage: "/uploads/branding/hero-rola-main.jpg",
  heroTitle: "ROLA",
  heroSubtitle: "Timeless Elegance Since 2012",
  heroIntro: "獻給懂得生活品味的妳，\n從日常到重要時刻，\n用質感穿搭展現自信與優雅。",
  primaryButtonText: "探索新品",
  primaryButtonLink: "/products?category=New%20Arrival",
  secondaryButtonText: "LINE 一對一詢問",
  secondaryButtonLink: "https://line.me/R/ti/p/@sxg2195h",
  newArrivalCount: 6
};

export const defaultSocialSettings: SocialSettings = {
  lineUrl: "https://line.me/R/ti/p/@sxg2195h",
  facebookUrl: "https://www.facebook.com/1381990545159062",
  instagramUrl: "",
  showFacebookButton: true,
  showLineButton: true
};

export const defaultBrandSettings: BrandSettings = {
  siteName: "ROLA Boutique",
  logoText: "ROLA",
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
  ogDescription: "ROLA Boutique Since 2012，專注質感與風格的女裝選品，提供新品穿搭、洋裝、外套與一對一 LINE 諮詢服務。"
};

const files = {
  home: "home-settings.json",
  social: "social-settings.json",
  brand: "brand-settings.json",
  seo: "seo-settings.json"
};

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
  const filePath = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function getHomeSettings() {
  return readJson(files.home, defaultHomeSettings);
}

export function saveHomeSettings(settings: HomeSettings) {
  return writeJson(files.home, settings);
}

export function getSocialSettings() {
  return readJson(files.social, defaultSocialSettings);
}

export function saveSocialSettings(settings: SocialSettings) {
  return writeJson(files.social, settings);
}

export function getBrandSettings() {
  return readJson(files.brand, defaultBrandSettings);
}

export function saveBrandSettings(settings: BrandSettings) {
  return writeJson(files.brand, settings);
}

export function getSeoSettings() {
  return readJson(files.seo, defaultSeoSettings);
}

export function saveSeoSettings(settings: SeoSettings) {
  return writeJson(files.seo, settings);
}
