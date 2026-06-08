import { Search, ShoppingCart } from "lucide-react";
import Container from "@/src/components/layout/Container";
import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <nav className="w-full inset-x-0 top-0 fixed z-50 border-b">
        <Container>
          <div className="flex justify-between items-center h-16 ">
            <div className="left py-3">
              <h1 className="font-display text-text-dark-primary text-2xl font-bold">
                WindStore
              </h1>
            </div>

            <div className="right flex items-center gap-7">
              <div className="searchBar flex items-center gap-2 rounded-xl border border-text-dark-muted px-3 h-10">
                <Search
                  size={18}
                  className="text-text-dark-secondary shrink-0"
                />

                <input
                  type="search"
                  placeholder="Cari laptop, brand..."
                  className="outline-none bg-transparent flex-1 placeholder:text-text-dark-secondary text-text-dark-primary"
                />
              </div>

              <div className="shop">
                <Link
                  href="#"
                  className="text-xl text-text-dark-primary font-bold"
                >
                  Shop
                </Link>
              </div>

              <div className="cart">
                <Link href="#">
                  <ShoppingCart className="text-text-dark-primary" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
