"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import { catalogProducts } from "@/src/lib/DataCatalog";

export default function CartCard() {
  const laptop = catalogProducts[1];

  const [isExpanded, setIsExpanded] = useState(true);
  const [selected, setSelected] = useState(true);

  return (
    <div className="w-full rounded-3xl bg-white shadow-card overflow-hidden mb-5">
      {/* Header */}
      <div className="flex items-center gap-6 p-8">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => setSelected(!selected)}
          className="size-5 accent-accent"
        />

        {/* Thumbnail */}
        <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image
            src={laptop.image}
            alt={laptop.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold font-display">
            {laptop.name}
          </h3>

          <p className="mt-2 text-md text-muted-foreground">
            Custom Build
          </p>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-bold text-accent">
            {laptop.price}
          </p>
        </div>

        {/* Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-accent transition"
        >
          {isExpanded ? (
            <ChevronUp size={24} />
          ) : (
            <ChevronDown size={24} />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {isExpanded && (
        <>
          <div className="border-t border-border" />

          <div className="p-8">
            <h4 className="mb-8 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Configuration Details
            </h4>

            <div className="grid grid-cols-2 gap-x-20 gap-y-8">
              <div className="flex justify-between">
                <span>CPU</span>
                <span>Intel Core Ultra 7</span>
              </div>

              <div className="flex justify-between">
                <span>RAM</span>
                <span>32GB LPDDR5x</span>
              </div>

              <div className="flex justify-between">
                <span>Storage</span>
                <span>1TB PCIe Gen4</span>
              </div>

              <div className="flex justify-between">
                <span>GPU</span>
                <span>Intel Arc</span>
              </div>

              <div className="flex justify-between">
                <span>Display</span>
                <span>14.5&quot; 4K OLED</span>
              </div>

              <div className="flex justify-between">
                <span>OS</span>
                <span>Windows 11 Pro</span>
              </div>

              <div className="flex justify-between">
                <span>Warranty</span>
                <span>2-Year Premium</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex justify-end gap-4">
              <button className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 hover:bg-muted transition">
                <Pencil size={16} />
                Edit Build
              </button>

              <button className="flex items-center gap-2 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 transition">
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}