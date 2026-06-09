export default function BrandMarquee() {
  const brands = [
    "ASUS",
    "Dell",
    "HP",
    "Lenovo",
    "Microsoft",
    "Acer",
    "Samsung",
    "Razer",
    "MSI",
    "LG",
  ];

  const scrollBrands = [...brands, ...brands];

  return (
    <section id="brands ">
      <div className="relative border-b-2 border-t-2 border-border">
        <div className="text-center py-5">
          <h3 className="font-display font-bold tracking-widest text-2xl">
            Trusted Brands
          </h3>
        </div>

        <div className="w-full relative inline-flex flex-nowrap overflow-hidden ">
          {/* Fade kiri */}
          <div className="absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-page to-transparent" />

          {/* Fade kanan */}
          <div className="absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-page to-transparent" />

          <div className="flex items-center justify-center whitespace-nowrap animate-marquee">
            {scrollBrands.map((brand, idx) => (
              <div
                className="text-4xl font-bold font-body mx-8 text-transparent [-webkit-text-stroke:1px_#a1a1aa] hover:text-text-muted transition-colors 2s ease-in-out shrink-0 cursor-default"
                key={idx}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
