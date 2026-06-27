"use client";

import { useState } from "react";
import { ProductDetail, ProductConfig } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";

type DetailConfigurationProps = {
  laptop: ProductDetail;
};

type SelectionMap = Record<string, ProductConfig>;

export default function DetailConfiguration({ laptop }: DetailConfigurationProps) {
  const groups = laptop.productConfigs.reduce<Record<string, ProductConfig[]>>(
    (acc, cfg) => {
      if (!acc[cfg.configType]) acc[cfg.configType] = [];
      acc[cfg.configType].push(cfg);
      return acc;
    },
    {}
  );

  // Default selection: first option per group
  const defaultSelection: SelectionMap = Object.fromEntries(
    Object.entries(groups).map(([type, cfgs]) => [type, cfgs[0]])
  );

  const [selected, setSelected] = useState<SelectionMap>(defaultSelection);

  const basePrice = parseFloat(laptop.basePrice);
  const addonsTotal = Object.values(selected).reduce(
    (sum, cfg) => sum + parseFloat(cfg.priceModifier),
    0
  );
  const total = basePrice + addonsTotal;

  return (
    <section id="detail-configuration" className="mt-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-5xl font-bold">
          Build Your {laptop.brand.name}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Customize your setup for peak performance.
        </p>
      </div>

      {/* Content */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        {/* Config options */}
        <div className="col-span-8 space-y-8">
          {Object.entries(groups).map(([type, cfgs]) => (
            <div
              key={type}
              className="rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <h3 className="mb-6 text-3xl font-semibold">{type}</h3>
              <div className="grid grid-cols-3 gap-4">
                {cfgs.map((cfg) => {
                  const isSelected = selected[type]?.configName === cfg.configName;
                  const modifier = parseFloat(cfg.priceModifier);
                  return (
                    <button
                      key={cfg.configName}
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [type]: cfg }))
                      }
                      className={`rounded-2xl border-2 p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      <p className="font-semibold">{cfg.configName}</p>
                      <p className="mt-2 text-muted-foreground text-sm">
                        {modifier === 0
                          ? "Included"
                          : `+ ${formatPrice(cfg.priceModifier)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="col-span-4 h-fit rounded-3xl border border-border bg-card p-6 shadow-card sticky top-24">
          <h3 className="text-3xl font-semibold">Summary</h3>

          <div className="my-6 border-t border-border" />

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Price</span>
              <span className="font-medium">{formatPrice(laptop.basePrice)}</span>
            </div>

            {Object.entries(selected).map(([type, cfg]) => (
              <div key={type} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cfg.configName}</span>
                <span className="font-medium">
                  {parseFloat(cfg.priceModifier) === 0
                    ? "Included"
                    : `+ ${formatPrice(cfg.priceModifier)}`}
                </span>
              </div>
            ))}
          </div>

          <div className="my-8 border-t border-border" />

          <div className="flex items-end justify-between">
            <span className="text-3xl font-semibold">Total</span>
            <span className="text-2xl font-bold font-display">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-4 text-sm text-green-600">
            {laptop.stock > 0
              ? `In Stock (${laptop.stock} left)`
              : "Out of Stock"}
          </p>

          <button
            disabled={laptop.stock === 0}
            className="mt-8 w-full rounded-2xl bg-accent py-4 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Add to Cart
          </button>
        </aside>
      </div>
    </section>
  );
}