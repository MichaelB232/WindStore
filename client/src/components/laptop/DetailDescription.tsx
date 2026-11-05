import { ProductDetail } from "@/src/lib/producttype/ProductType";

type DetailDescriptionProps = {
  laptop: ProductDetail;
};

export default function DetailDescription({ laptop }: DetailDescriptionProps) {
  return (
    <section id="detail-description">
      <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-10 shadow-card mt-12 sm:mt-20">
        <div className="flex flex-col py-2 sm:py-5">
          {/* Upper */}
          <div className="border-b border-border pb-6 sm:pb-10">
            <div className="max-w-4xl">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-accent font-display leading-tight">
                {laptop.motto}
              </h2>
              <p className="mt-4 sm:mt-8 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                {laptop.description}
              </p>
            </div>
          </div>

          {/* Lower — features */}
          <div className="pt-6 sm:pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
              {laptop.productFeatures.map((feature, idx) => (
                <div key={idx}>
                  <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
                    {feature.title}
                  </p>
                  <p className="mt-2 sm:mt-3 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
