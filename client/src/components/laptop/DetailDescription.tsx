import { Product } from "@/src/lib/DataCatalog";

type DetailPageDescriptionProps = {
  laptop: Product;
};

export default function DetailDescription({
  laptop,
}: DetailPageDescriptionProps) {
  return (
    <section id="detail-description">
      <div className="w-full rounded-3xl bg-white p-10 shadow-card mt-20">
        {/* Container */}
        <div className="flex flex-col py-5">
          {/* Upper items */}
          <div className=" border-b border-border pb-10">
            <div className="max-w-4xl">
              <h2 className="text-5xl font-bold text-accent font-display leading-tight">
                {laptop.motto}
              </h2>

              <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
                {laptop.description}
              </p>
            </div>
          </div>

          {/* Lower items */}
          <div className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {laptop.features.map((feature, idx) => (
                <div key={idx}>
                  {/* Feature Title */}
                  <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
                    {feature.title}
                  </p>

                  {/* Feature Description */}
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
