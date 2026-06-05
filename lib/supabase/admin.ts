import { getSupabaseConfig, supabaseBucketMissingMessage, supabaseMissingMessage } from "@/lib/supabase/server";

const maxImageSize = 5 * 1024 * 1024;
const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file: File) {
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));

  if (!allowedImageExtensions.has(extension) || (file.type && !allowedImageTypes.has(file.type))) {
    throw new Error("圖片只能上傳 jpg、jpeg、png、webp。");
  }

  if (file.size > maxImageSize) {
    throw new Error("圖片檔案太大，請壓縮到 5MB 以下再上傳。");
  }

  return extension;
}

export async function uploadSupabaseImage(file: FormDataEntryValue | null, bucket: "product-images" | "site-images") {
  if (!(file instanceof File) || file.size === 0) {
    return "";
  }

  const config = getSupabaseConfig();

  if (!config.configured) {
    throw new Error(supabaseMissingMessage);
  }

  const extension = validateImageFile(file);
  const safeName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const response = await fetch(`${config.url}/storage/v1/object/${bucket}/${safeName}`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true"
    },
    body: buffer
  });

  if (!response.ok) {
    const detail = await response.text();
    if (response.status === 404 || detail.toLowerCase().includes("bucket")) {
      throw new Error(supabaseBucketMissingMessage);
    }
    throw new Error(`Supabase 圖片上傳失敗：${response.status} ${detail}`);
  }

  return `${config.url}/storage/v1/object/public/${bucket}/${safeName}`;
}
