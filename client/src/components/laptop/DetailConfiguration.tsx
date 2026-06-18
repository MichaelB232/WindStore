export default function DetailConfiguration() {
  return (
    <section id="detail-configuration" className="mt-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-5xl font-bold">Build Your Zenith</h2>

        <p className="mt-3 text-lg text-muted-foreground">
          Customize your setup for peak performance.
        </p>
      </div>

      {/* Content */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        {/* Configuration Options */}
        <div className="col-span-8 space-y-8">
          {/* RAM */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-6 text-3xl font-semibold">Memory (RAM)</h3>

            <div className="grid grid-cols-3 gap-4">
              <button className="rounded-2xl border-2 border-accent p-4 text-left transition-all">
                <p className="font-semibold">16GB LPDDR5x</p>
                <p className="mt-2 text-muted-foreground">Included</p>
              </button>

              <button className="rounded-2xl border border-border p-4 text-left transition-all hover:border-accent">
                <p className="font-semibold">32GB LPDDR5x</p>
                <p className="mt-2 text-muted-foreground">+ $200.00</p>
              </button>

              <button className="rounded-2xl border border-border p-4 text-left transition-all hover:border-accent">
                <p className="font-semibold">64GB LPDDR5x</p>
                <p className="mt-2 text-muted-foreground">+ $400.00</p>
              </button>
            </div>
          </div>

          {/* Storage */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-6 text-3xl font-semibold">Storage</h3>

            <div className="grid grid-cols-3 gap-4">
              <button className="rounded-2xl border-2 border-accent p-4 text-left transition-all">
                <p className="font-semibold">512GB PCIe Gen4</p>
                <p className="mt-2 text-muted-foreground">Included</p>
              </button>

              <button className="rounded-2xl border border-border p-4 text-left transition-all hover:border-accent">
                <p className="font-semibold">1TB PCIe Gen4</p>
                <p className="mt-2 text-muted-foreground">+ $150.00</p>
              </button>

              <button className="rounded-2xl border border-border p-4 text-left transition-all hover:border-accent">
                <p className="font-semibold">2TB PCIe Gen4</p>
                <p className="mt-2 text-muted-foreground">+ $300.00</p>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="col-span-4 h-fit rounded-3xl border border-border bg-card p-6 shadow-card sticky top-24">
          <h3 className="text-3xl font-semibold">Summary</h3>

          <div className="my-6 border-t border-border" />

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>$1,299.00</span>
            </div>

            <div className="flex justify-between">
              <span>16GB LPDDR5x</span>
              <span>$0.00</span>
            </div>

            <div className="flex justify-between">
              <span>1TB PCIe Gen4</span>
              <span>$150.00</span>
            </div>
          </div>

          <div className="my-8 border-t border-border" />

          <div className="flex items-end justify-between">
            <span className="text-3xl font-semibold">Total</span>

            <span className="text-5xl font-bold text-accent">$1,449.00</span>
          </div>

          <p className="mt-4 text-sm text-green-600">
            In Stock • Ships Tomorrow
          </p>

          <button className="mt-8 w-full rounded-2xl bg-accent py-4 font-semibold text-white transition-colors hover:bg-accent-hover">
            Add to Cart
          </button>
        </aside>
      </div>
    </section>
  );
}
