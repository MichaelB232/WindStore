"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import Container from "@/src/components/layout/Container";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { ROUTES } from "@/src/routes/routes";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;
  useEffect(() => {
    if (!isHomePage) return;
    const checkScroll = () => setScrolled(window.scrollY > 50);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScroll);
      setScrolled(false);
    };
  }, [isHomePage]);

  return (
    <header>
      <nav
        className={`w-full inset-x-0 top-0 fixed z-50 transition-all duration-300 ease-in-out
          ${
            isTransparent
              ? // Mode transparan: di homepage sebelum di-scroll
                "bg-transparent"
              : // Mode solid: di halaman lain atau sudah di-scroll lebih dari 50px
                "bg-white shadow-sm"
          }
        `}
      >
        <Container>
          <div className="flex justify-between items-center h-20">
            {/* Logo / Brand */}
            <div className="left py-3">
              <h1 className="font-display text-2xl font-bold">
                <Link
                  href={ROUTES.HOME}
                  className={`transition-colors duration-300
                    ${isTransparent ? "text-white" : "text-accent"}
                  `}
                >
                  WindStore
                </Link>
              </h1>
            </div>

            {/* Right section: search, nav links, cart */}
            <div className="right flex items-center gap-7">
              {/* Search Bar */}
              <div
                className={`group searchBar flex items-center gap-2 rounded-xl border px-3 h-10
                  transition-all duration-300
                  focus-within:shadow-focus
                  ${
                    isTransparent
                      ? // Border dan teks putih saat transparan
                        "border-white/40 focus-within:border-white"
                      : // Border gelap saat solid
                        "border-text-muted focus-within:border-accent-hover"
                  }
                `}
              >
                <Search
                  size={18}
                  className={`shrink-0 transition-colors duration-300
                    ${
                      isTransparent
                        ? "text-white/70 group-focus-within:text-white"
                        : "text-text-secondary group-focus-within:text-accent-hover"
                    }
                  `}
                />
                <input
                  type="search"
                  placeholder="Cari laptop, brand..."
                  className={`flex-1 bg-transparent outline-none border-none focus:ring-0 transition-colors duration-300
                    ${
                      isTransparent
                        ? "placeholder:text-white/50 text-white"
                        : "placeholder:text-text-muted text-text-primary"
                    }
                  `}
                />
              </div>

              {/* Shop Link */}
              <div className="shop">
                <Link
                  href={ROUTES.SHOP}
                  className={`text-xl font-bold transition-colors duration-300
                    ${
                      isTransparent
                        ? "text-white hover:text-accent"
                        : "text-text-primary hover:text-accent"
                    }
                  `}
                >
                  Shop
                </Link>
              </div>

              {/* Cart Icon */}
              <div className="cart">
                <Link href={ROUTES.CART}>
                  <ShoppingCart
                    className={`transition-colors duration-300
                      ${
                        isTransparent
                          ? "text-white hover:text-accent"
                          : "text-text-primary hover:text-accent"
                      }
                    `}
                  />
                </Link>
              </div>

              {/* Profile */}
              <div className="">
                <UserMenu isHomePage={isHomePage} scrolled={scrolled} />
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
