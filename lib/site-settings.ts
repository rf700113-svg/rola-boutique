import { promises as fs } from "fs";
import path from "path";

export type SiteSettings = {
  logoImage: string;
  heroImage: string;
  faviconImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  brandStoryTitle: string;
  brandStoryContent: string;
};

export const defaultSiteSettings: SiteSettings = {
  logoImage: "/uploads/branding/rola-logo.svg",
  heroImage: "/uploads/branding/hero-rola-main.jpg",
  faviconImage: "/uploads/branding/rola-monogram.svg",
  heroTitle: "ROLA",
  heroSubtitle: "Timeless Elegance Since 2012",
  heroIntro: "獻給懂得生活品味的妳，\n從日常到重要時刻，\n用質感穿搭展現自信與優雅。",
  primaryButtonText: "探索新品",
  secondaryButtonText: "品牌故事",
  brandStoryTitle: "真正的優雅，不需要刻意張揚",
  brandStoryContent:
    "ROLA Boutique 自 2012 年開始，陪伴女性尋找日常與重要時刻的質感穿搭。\n\n我們相信服裝不只是穿著，更是一種生活態度。真正耐看的風格，來自版型、質地，以及穿上後的從容自信。"
};

const settingsFilePath = path.join(process.cwd(), "data", "site-settings.json");

export async function getSiteSettings() {
  try {
    const content = await fs.readFile(settingsFilePath, "utf8");
    return { ...defaultSiteSettings, ...(JSON.parse(content) as Partial<SiteSettings>) };
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings) {
  await fs.writeFile(settingsFilePath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
}
