"use client";

import { useEffect, useState } from "react";
import { Clock, ShoppingBag, Heart, Package } from "lucide-react";
import Link from "next/link";
import Container from "./Container";
import { ROUTES } from "@/src/routes/routes";
import { getAllProduct } from "@/src/services/shop/shop.service";
import { AdminCategory } from "@/src/lib/admin/AdminType";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.263.793-.582 0-.288-.01-1.05-.016-2.062-3.338.726-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.834 2.809 1.304 3.495.997.108-.775.42-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.289 0 .322.19.7.8.581C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Nicolaus on GitHub",
    href: "https://github.com/CodebyCola",
  },
  {
    label: "Michael on GitHub",
    href: "https://github.com/MichaelB232",
  },
];

const SUPPORT_LINKS = [
  { label: "Track Order", href: ROUTES.ORDERS, icon: Package },
  { label: "My Wishlist", href: ROUTES.WISHLIST, icon: Heart },
  { label: "My Cart", href: ROUTES.CART, icon: ShoppingBag },
];

export default function Footer() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    getAllProduct()
      .then((json) => {
        if (cancelled) return;
        setCategories(json?.data?.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-dark pt-16 sm:pt-20 pb-8 border-t border-border-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-accent/20 to-transparent"></div>

      <div className="relative z-10">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 sm:mb-16">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Link
                  href={ROUTES.HOME}
                  className="font-display font-bold text-2xl tracking-tight text-text-inverse"
                >
                  WindStore
                </Link>
              </div>
              <p className="text-text-dark-secondary mb-6 text-xs sm:text-sm leading-relaxed max-w-sm">
                The ultimate destination for premium Windows laptops. Customize
                your build and conquer your workflow.
              </p>
              <div>
                <h4 className="font-display font-bold text-text-inverse mb-4 sm:mb-6 text-base sm:text-lg">
                  Connect With Developers
                </h4>
                <div className="flex gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.label}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-inverse hover:bg-accent hover:text-dark transition-all duration-150"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Shop */}
            <div>
              <h4 className="font-display font-bold text-text-inverse mb-4 sm:mb-6 text-base sm:text-lg">
                Shop
              </h4>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                <li>
                  <Link
                    href={ROUTES.SHOP}
                    className="text-text-dark-secondary hover:text-accent transition-colors text-xs sm:text-sm"
                  >
                    All Laptops
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`${ROUTES.SHOP}?category=${encodeURIComponent(category.name)}`}
                      className="text-text-dark-secondary hover:text-accent transition-colors text-xs sm:text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="font-display font-bold text-text-inverse mb-4 sm:mb-6 text-base sm:text-lg">
                Support
              </h4>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {SUPPORT_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 text-text-dark-secondary hover:text-accent transition-colors text-xs sm:text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="font-display font-bold text-text-inverse mb-4 sm:mb-6 text-base sm:text-lg">
                Stay Updated
              </h4>
              <p className="text-text-dark-secondary mb-4 text-xs sm:text-sm">
                Subscribe to get special offers, free giveaways, and
                once-in-a-lifetime deals.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  disabled
                  placeholder="Enter your email"
                  aria-disabled="true"
                  className="bg-white/5 border border-border-dark rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm text-text-inverse placeholder:text-text-dark-muted focus:outline-none w-full cursor-not-allowed opacity-70"
                />
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="bg-white/5 text-text-dark-muted p-2.5 rounded-lg shrink-0 cursor-not-allowed"
                >
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <p className="text-text-dark-muted text-[11px] sm:text-xs mt-2 italic">
                Newsletter is coming soon.
              </p>
            </div>
          </div>
        </Container>
      </div>
      <div className="pt-8 border-t border-border-dark text-center px-4 max-w-4xl mx-auto space-y-2">
        <p className="text-text-dark-muted text-xs sm:text-sm">
          &copy; {new Date().getFullYear()} WindStore. All rights reserved.
        </p>
        <p className="text-text-dark-muted/70 text-[11px] sm:text-xs leading-relaxed">
          Disclaimer: This website is a collaborative portfolio project created for demonstration purposes only. All product images, brand names, and logos belong to their respective owners (ASUS, Lenovo, Acer, Dell, etc.). No real commercial transactions are conducted.
        </p>
      </div>
    </footer>
  );
}
