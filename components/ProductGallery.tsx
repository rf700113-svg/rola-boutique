"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const safeImages = images.length > 0 ? images : ["/uploads/products/rola-look-01.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

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
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[3/4] overflow-hidden border bg-ivory ${
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
