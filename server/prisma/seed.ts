import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clean existing data (order matters due to foreign keys) ───
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productFeature.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productConfig.deleteMany();
  await prisma.product.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing data");

  // ─── Users ───────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@windstore.com",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      username: "johndoe",
      email: "john@gmail.com",
      passwordHash: userPassword,
      role: "customer",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      username: "janedoe",
      email: "jane@gmail.com",
      passwordHash: userPassword,
      role: "customer",
    },
  });

  console.log("👤 Users seeded");

  // ─── Categories ──────────────────────────────────────────────
  const gaming = await prisma.category.create({
    data: { name: "Gaming" },
  });

  const business = await prisma.category.create({
    data: { name: "Business" },
  });

  const ultrabook = await prisma.category.create({
    data: { name: "Ultrabook" },
  });

  console.log("📂 Categories seeded");

  // ─── Brands ──────────────────────────────────────────────────
  const asus = await prisma.brand.create({
    data: {
      name: "ASUS",
      description:
        "Leading technology brand known for high-performance laptops",
    },
  });

  const lenovo = await prisma.brand.create({
    data: {
      name: "Lenovo",
      description: "Global technology company producing innovative laptops",
    },
  });

  const dell = await prisma.brand.create({
    data: {
      name: "Dell",
      description: "American technology company known for reliable laptops",
    },
  });

  console.log("🏷️  Brands seeded");

  // ─── Products ────────────────────────────────────────────────
  const rog = await prisma.product.create({
    data: {
      name: "ASUS ROG Strix G16",
      brandId: asus.id,
      categoryId: gaming.id,
      slug: "asus-rog-strix-g16",
      motto: "Dominate Every Game",
      description:
        "High performance gaming laptop with RTX 4070 and 165Hz display",
      basePrice: BigInt(25000000),
      badge: "Best Seller",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: '16" FHD 165Hz',
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      imageUrl: "https://example.com/rog-strix-g16.jpg",
      stock: 15,
      isActive: true,
    },
  });

  const thinkpad = await prisma.product.create({
    data: {
      name: "Lenovo ThinkPad X1 Carbon",
      brandId: lenovo.id,
      categoryId: business.id,
      slug: "lenovo-thinkpad-x1-carbon",
      motto: "Built for Business",
      description:
        "Ultra-lightweight business laptop with military-grade durability",
      basePrice: BigInt(22000000),
      badge: "Premium",
      specs: {
        processor: "Intel Core i7-1365U",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: '14" WUXGA IPS',
        gpu: "Intel Iris Xe",
        battery: "57Wh",
        os: "Windows 11 Pro",
      },
      imageUrl: "https://example.com/thinkpad-x1.jpg",
      stock: 10,
      isActive: true,
    },
  });

  const xps = await prisma.product.create({
    data: {
      name: "Dell XPS 15",
      brandId: dell.id,
      categoryId: ultrabook.id,
      slug: "dell-xps-15",
      motto: "Power Meets Elegance",
      description:
        "Premium ultrabook with stunning OLED display and powerful performance",
      basePrice: BigInt(28000000),
      badge: "New",
      specs: {
        processor: "Intel Core i7-13700H",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: '15.6" OLED Touch',
        gpu: "NVIDIA RTX 4060 8GB",
        battery: "86Wh",
        os: "Windows 11 Home",
      },
      imageUrl: "https://example.com/dell-xps-15.jpg",
      stock: 8,
      isActive: true,
    },
  });

  console.log("💻 Products seeded");

  // ─── Product Configs ─────────────────────────────────────────
  const rogConfig1 = await prisma.productConfig.create({
    data: {
      productId: rog.id,
      configName: "16GB RAM / 1TB SSD",
      configType: "storage",
      priceModifier: BigInt(0),
      isDefault: true,
      displayOrder: 1,
    },
  });

  const rogConfig2 = await prisma.productConfig.create({
    data: {
      productId: rog.id,
      configName: "32GB RAM / 1TB SSD",
      configType: "storage",
      priceModifier: BigInt(3000000),
      isDefault: false,
      displayOrder: 2,
    },
  });

  await prisma.productConfig.create({
    data: {
      productId: thinkpad.id,
      configName: "16GB RAM / 512GB SSD",
      configType: "storage",
      priceModifier: BigInt(0),
      isDefault: true,
      displayOrder: 1,
    },
  });

  await prisma.productConfig.create({
    data: {
      productId: xps.id,
      configName: "16GB RAM / 512GB SSD",
      configType: "storage",
      priceModifier: BigInt(0),
      isDefault: true,
      displayOrder: 1,
    },
  });

  console.log("⚙️  Product configs seeded");

  // ─── Product Images ──────────────────────────────────────────
  await prisma.productImage.createMany({
    data: [
      {
        productId: rog.id,
        imageUrl: "https://example.com/rog-1.jpg",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        productId: rog.id,
        imageUrl: "https://example.com/rog-2.jpg",
        isPrimary: false,
        displayOrder: 2,
      },
      {
        productId: thinkpad.id,
        imageUrl: "https://example.com/thinkpad-1.jpg",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        productId: xps.id,
        imageUrl: "https://example.com/xps-1.jpg",
        isPrimary: true,
        displayOrder: 1,
      },
    ],
  });

  console.log("🖼️  Product images seeded");

  // ─── Product Features ────────────────────────────────────────
  await prisma.productFeature.createMany({
    data: [
      {
        productId: rog.id,
        title: "ROG Intelligent Cooling",
        description: "Advanced thermal system keeps performance at peak",
        displayOrder: 1,
      },
      {
        productId: rog.id,
        title: "MUX Switch",
        description: "Bypass iGPU for maximum gaming performance",
        displayOrder: 2,
      },
      {
        productId: thinkpad.id,
        title: "MIL-SPEC Durability",
        description: "Tested against 12 military-grade requirements",
        displayOrder: 1,
      },
      {
        productId: xps.id,
        title: "OLED Touch Display",
        description: "Stunning colors with 100% DCI-P3 color gamut",
        displayOrder: 1,
      },
    ],
  });

  console.log("✨ Product features seeded");

  // ─── Payment Methods ─────────────────────────────────────────
  await prisma.paymentMethod.createMany({
    data: [
      {
        code: "BCA_VA",
        name: "BCA Virtual Account",
        type: "virtual_account",
        isActive: true,
      },
      {
        code: "BNI_VA",
        name: "BNI Virtual Account",
        type: "virtual_account",
        isActive: true,
      },
      { code: "GOPAY", name: "GoPay", type: "ewallet", isActive: true },
      { code: "OVO", name: "OVO", type: "ewallet", isActive: true },
      { code: "COD", name: "Cash on Delivery", type: "cod", isActive: true },
    ],
  });

  console.log("💳 Payment methods seeded");

  // ─── Wishlists ───────────────────────────────────────────────
  await prisma.wishlist.createMany({
    data: [
      { userId: customer1.id, productId: rog.id },
      { userId: customer1.id, productId: xps.id },
      { userId: customer2.id, productId: thinkpad.id },
    ],
  });

  console.log("❤️  Wishlists seeded");

  // ─── Cart Items ──────────────────────────────────────────────
  await prisma.cartItem.create({
    data: {
      userId: customer1.id,
      productId: rog.id,
      configId: rogConfig1.id,
      quantity: 1,
    },
  });

  console.log("🛒 Cart items seeded");

  // ─── Orders ──────────────────────────────────────────────────
  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: { code: "BCA_VA" },
  });

  const order = await prisma.order.create({
    data: {
      userId: customer2.id,
      totalPrice: BigInt(25000000),
      status: "paid",
      orderItems: {
        create: {
          productId: rog.id,
          configId: rogConfig1.id,
          quantity: 1,
          unitPrice: BigInt(25000000),
        },
      },
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentMethodId: paymentMethod!.id,
      amount: BigInt(25000000),
      status: "success",
      transactionId: "TXN-001-" + Date.now(),
    },
  });

  console.log("📦 Orders & payments seeded");

  // ─── Reviews ─────────────────────────────────────────────────
  await prisma.review.create({
    data: {
      userId: customer2.id,
      productId: rog.id,
      rating: 4.5,
      comment: "Great gaming laptop! Very fast and the display is amazing.",
    },
  });

  console.log("⭐ Reviews seeded");

  console.log("✅ Seeding complete!");
  console.log("");
  console.log("📋 Test Accounts:");
  console.log("   Admin    → username: admin    | password: admin123");
  console.log("   Customer → username: johndoe  | password: user123");
  console.log("   Customer → username: janedoe  | password: user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
