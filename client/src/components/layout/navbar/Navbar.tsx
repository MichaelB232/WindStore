"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Container from "@/src/components/layout/Container";
import Link from "next/link";
import UserMenu from "./UserMenu";
import NavbarSearch from "./NavbarSearch";
import { ROUTES } from "@/src/routes/routes";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !scrolled;

  // Scroll use effect
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
              <NavbarSearch key={pathname} isTransparent={isTransparent} />

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
