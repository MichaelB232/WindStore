import { Search, ShoppingCart } from "lucide-react";
import Container from "@/src/components/layout/Container";
import Link from "next/link";

export default function Navbar() {
  return (
    <header>
      <nav className="w-full inset-x-0 top-0 fixed z-50 bg-transparent">
        <Container>
          <div className="flex justify-between items-center h-16">
            <div className="left py-3">
              <h1 className="font-display text-text-dark-primary text-2xl font-bold">
                <Link href="/">WindStore</Link>
              </h1>
            </div>

            <div className="right flex items-center gap-7">
              <div
                className="group searchBar flex items-center gap-2 rounded-xl border border-text-dark-muted px-3 h-10
              transition-all base
              focus-within:border-accent-hover
              focus-within:shadow-focus
              
              "
              >
                <Search
                  size={18}
                  className="
                  text-text-dark-secondary 
                  shrink-0
                  transition-colors
                  group-focus-within:text-accent-hover"
                />

                <input
                  type="search"
                  placeholder="Cari laptop, brand..."
                  className="flex-1
                  bg-transparent
                  outline-none
                  border-none
                  focus:ring-0
                  placeholder:text-text-dark-secondary
                  text-text-dark-primary"
                />
              </div>

              <div className="shop">
                <Link
                  href="#"
                  className="text-xl text-text-dark-primary font-bold
                  transition duration-300 ease-in-out 
                  hover:text-text-dark-accent"
                >
                  Shop
                </Link>
              </div>

              <div className="cart">
                <Link href="#">
                  <ShoppingCart
                    className="text-text-dark-primary
                  transition duration-300 ease-in-out 
                  hover:text-text-dark-accent
                  "
                  />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  );
}
