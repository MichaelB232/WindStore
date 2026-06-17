export default function CatalogHero() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-6"
      style={{ background: "linear-gradient(135deg, #f8f8ff 0%, #eef0ff 60%, #D7D4F3 100%)" }}>
      {/* Subtle blob accents */}
      <div className="absolute top-0 right-0 w-72 h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[--color-accent]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-[--color-violet]/8 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 px-8 py-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-[--color-text-primary] leading-tight mb-2">
          Explore All Products
        </h1>
        <p className="text-sm text-[--color-text-secondary] max-w-md leading-relaxed mb-5">
          Browse gaming, professional, AI-powered, and creator laptops from the world&apos;s
          leading Windows brands.
        </p>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer shadow-sm">
            Shop Now
          </button>
          <button className="px-5 py-2.5 bg-transparent hover:bg-[--color-accent-muted] text-[--color-accent] font-semibold text-sm rounded-xl border border-[--color-accent] transition-colors duration-150 cursor-pointer">
            Build Your Own Laptop
          </button>
        </div>
      </div>
    </div>
  );
}