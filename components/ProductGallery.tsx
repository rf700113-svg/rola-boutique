"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  if (!activeImage) {
    return (
      <div className="relative aspect-[3/4] max-h-[68vh] overflow-hidden bg-stone sm:max-h-none">
        <div className="absolute inset-0 flex items-center justify-center text-sm tracking-[0.16em] text-charcoal/45">
          NO IMAGE
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[3/4] max-h-[68vh] overflow-hidden bg-ivory sm:max-h-none">
        <Image
          src={activeImage}
          alt={productName}
          fill
          className="object-contain object-top lg:object-cover lg:object-top"
          sizes="(min-width: 1024px) 52vw, 100vw"
          priority
        />
      </div>
      {safeImages.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden border bg-ivory sm:w-auto ${
                activeIndex === index ? "border-charcoal" : "border-stone"
              }`}
              aria-label={`查看商品圖片 ${index + 1}`}
            >
              <Image src={image} alt="" fill className="object-cover object-top" sizes="90px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
