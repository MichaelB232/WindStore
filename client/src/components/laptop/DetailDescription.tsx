import { ProductDetail } from "@/src/lib/producttype/ProductType";

type DetailDescriptionProps = {
  laptop: ProductDetail;
};

export default function DetailDescription({ laptop }: DetailDescriptionProps) {
  return (
    <section id="detail-description">
      <div className="w-full rounded-3xl bg-white p-10 shadow-card mt-20">
        <div className="flex flex-col py-5">
          {/* Upper */}
          <div className="border-b border-border pb-10">
            <div className="max-w-4xl">
              <h2 className="text-5xl font-bold text-accent font-display leading-tight">
                {laptop.motto}
              </h2>
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
                {laptop.description}
              </p>
            </div>
          </div>

          {/* Lower — features */}
          <div className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {laptop.productFeatures.map((feature, idx) => (
                <div key={idx}>
                  <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
                    {feature.title}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
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