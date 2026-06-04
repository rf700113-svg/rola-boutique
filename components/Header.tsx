"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/MobileMenu";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

function buildNavItems(lineUrl: string): NavItem[] {
  return [
    { href: "/", label: "首頁" },
    { href: "/products?category=New%20Arrival", label: "新品上市" },
    { href: "/products?category=Dresses", label: "洋裝" },
    { href: "/products?category=Tops", label: "上衣" },
    { href: "/products?category=Bottoms", label: "褲裝" },
    { href: "/products?category=Outerwear", label: "外套" },
    { href: lineUrl, label: "LINE諮詢", external: true }
  ];
}

export function Header({ logoText, lineUrl }: { logoText: string; lineUrl: string }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const navItems = buildNavItems(lineUrl);

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

  const isFloatingDesktop = isHome && !isScrolled;
  const desktopLogoClass = isFloatingDesktop ? "sm:text-white" : "sm:text-charcoal";
  const desktopNavClass = isFloatingDesktop ? "sm:text-white/90" : "sm:text-[#2B2623]";

  return (
    <header
      className={`fixed left-0 top-0 z-[10000] h-16 w-full border-b border-stone/50 bg-[#f7f4ef]/[0.96] backdrop-blur-[16px] transition duration-300 sm:h-auto ${
        isScrolled
          ? "sm:border-stone/50 sm:bg-[#faf8f5]/95 sm:shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:backdrop-blur-[18px]"
          : "sm:border-white/10 sm:bg-transparent sm:backdrop-blur-0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-[18px] sm:h-auto sm:px-6 sm:py-4 lg:px-10">
        <Link
          href="/"
          aria-label="ROLA Boutique 首頁"
          className={`font-playfair text-[28px] leading-none tracking-[0.28em] text-charcoal sm:text-[34px] sm:tracking-[0.32em] ${desktopLogoClass}`}
        >
          {logoText}
        </Link>

        <nav className={`hidden items-center gap-5 text-[15px] font-medium tracking-[0.08em] transition xl:flex ${desktopNavClass}`}>
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="relative py-2 transition after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#C8B08A] after:transition-transform hover:text-champagne hover:after:scale-x-100"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-2 transition after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[#C8B08A] after:transition-transform hover:text-champagne hover:after:scale-x-100"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/products"
            aria-label="搜尋商品"
            className={`text-charcoal transition hover:text-champagne ${desktopNavClass}`}
          >
            <Search size={20} strokeWidth={2.1} />
          </Link>
          <a
            href={lineUrl}
            target="_blank"
            rel="noreferrer"
            className={`border px-5 py-2.5 text-[15px] font-medium tracking-[0.12em] transition ${
              isFloatingDesktop
                ? "border-charcoal text-charcoal hover:border-champagne hover:bg-champagne hover:text-white sm:border-white/85 sm:text-white sm:hover:bg-white sm:hover:text-charcoal"
                : "border-charcoal text-charcoal hover:border-champagne hover:bg-champagne hover:text-white"
            }`}
          >
            LINE諮詢
          </a>
        </div>

        <MobileMenu navItems={navItems} />
      </div>
    </header>
  );
}
