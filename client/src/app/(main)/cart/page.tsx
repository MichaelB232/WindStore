import Container from "@/src/components/layout/Container";
import CartCard from "@/src/components/cart/CartCard";
import OrderCart from "@/src/components/cart/OrderCard";

export default function CartPage() {
  return (
    <main className="py-24 w-full">
      <Container>
        <div className="mb-10">
          <h1 className="font-bold font-display text-4xl">Your Cart</h1>
          <p className="text-sm font-sans">
            Review your selected item and configurations
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <CartCard />
            <CartCard />
          </div>

          <div className="col-span-4">
            <div className="sticky top-24">
              <OrderCart />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
