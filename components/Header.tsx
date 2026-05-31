"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/MobileMenu";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/products?category=New%20Arrival", label: "新品" },
  { href: "/products?category=Dresses", label: "洋裝" },
  { href: "/products?category=Tops", label: "上衣" },
  { href: "/products?category=Bottoms", label: "褲裝" },
  { href: "/products?category=Outerwear", label: "外套" },
  { href: "/about", label: "品牌故事" },
  { href: "/contact", label: "聯絡我們" }
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const isFloating = isHome && !isScrolled;
  const logoClass = isFloating ? "text-white" : "text-charcoal";
  const navClass = isFloating ? "text-white/90" : "text-[#2B2623]";

  return (
    <header
      className={`fixed left-0 top-0 z-[9999] w-full transition duration-300 ${
        isScrolled
          ? "border-b border-stone/50 bg-[#faf8f5]/95 shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-[18px]"
          : "border-b border-white/10 bg-black/10 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">
        <Link
          href="/"
          aria-label="ROLA Boutique 首頁"
          className={`font-playfair text-[30px] leading-none tracking-[0.32em] transition sm:text-[34px] ${logoClass}`}
        >
          ROLA
        </Link>

        <nav className={`hidden items-center gap-5 text-[15px] font-medium tracking-[0.08em] transition xl:flex ${navClass}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 transition after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#C8B08A] after:transition-transform hover:text-champagne hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/products" aria-label="搜尋商品" className={`transition hover:text-champagne ${navClass}`}>
            <Search size={20} strokeWidth={2.1} />
          </Link>
          <Link
            href="/contact"
            className={`border px-5 py-2.5 text-[15px] font-medium tracking-[0.12em] transition ${
              isFloating
                ? "border-white/85 text-white hover:bg-white hover:text-charcoal"
                : "border-charcoal text-charcoal hover:border-champagne hover:bg-champagne hover:text-white"
            }`}
          >
            詢問選品
          </Link>
        </div>

        <MobileMenu navItems={navItems} isFloating={isFloating} />
      </div>
    </header>
  );
}
