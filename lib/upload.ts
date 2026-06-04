import { promises as fs } from "fs";
import path from "path";

const rasterExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const svgExtensions = new Set([".svg"]);
const maxImageSize = 5 * 1024 * 1024;

export async function saveUploadedImage(
  file: FormDataEntryValue | null,
  folder: "products" | "branding" | "site",
  options: { allowSvg?: boolean } = {}
) {
  if (!(file instanceof File) || file.size === 0) {
    return "";
  }

  const extension = path.extname(file.name).toLowerCase();
  const extensionAllowed = rasterExtensions.has(extension) || (options.allowSvg && svgExtensions.has(extension));

  if (!extensionAllowed) {
    throw new Error(options.allowSvg ? "圖片格式僅支援 jpg、jpeg、png、webp、svg。" : "圖片格式僅支援 jpg、jpeg、png、webp。");
  }

  if (file.size > maxImageSize) {
    throw new Error("圖片大小不可超過 5MB。");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
  const destination = path.join(uploadDir, safeName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(destination, buffer);

  return `/uploads/${folder}/${safeName}`;
}
