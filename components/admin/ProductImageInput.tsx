"use client";

import { useState } from "react";

const maxImageSize = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

export function ProductImageInput({ disabled = false, currentImage }: { disabled?: boolean; currentImage?: string }) {
  const [error, setError] = useState("");

  return (
    <div className="grid gap-2 text-sm text-charcoal/70">
      <span>商品圖片</span>
      <input
        name="imageFile"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={(event) => {
          const input = event.currentTarget;
          const file = input.files?.[0];
          setError("");

          if (!file) {
            return;
          }

          const lowerName = file.name.toLowerCase();
          const extensionAllowed = allowedExtensions.some((extension) => lowerName.endsWith(extension));

          if (!extensionAllowed || (file.type && !allowedTypes.has(file.type))) {
            setError("商品圖片只能上傳 jpg、jpeg、png、webp。");
            input.value = "";
            return;
          }

          if (file.size > maxImageSize) {
            setError("圖片檔案太大，請壓縮到 5MB 以下再上傳。");
            input.value = "";
          }
        }}
        className="border border-stone bg-white px-3 py-3 text-charcoal file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-white disabled:opacity-50"
      />
      {currentImage ? (
        <span className="break-all text-xs text-charcoal/50">目前圖片：{currentImage}</span>
      ) : (
        <span className="text-xs text-charcoal/50">可上傳 jpg、jpeg、png、webp，5MB 以內。</span>
      )}
      {error ? <span className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</span> : null}
    </div>
  );
}
