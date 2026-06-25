import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  // =====================
  // USERS
  // =====================

  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: Role.admin,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      username: "customer",
      email: "customer@example.com",
      passwordHash: customerPassword,
      role: Role.customer,
    },
  });

  // =====================
  // CATEGORIES
  // =====================

  const laptopCategory = await prisma.category.upsert({
    where: { name: "Laptop" },
    update: {},
    create: { name: "Laptop" },
  });

  const desktopCategory = await prisma.category.upsert({
    where: { name: "Desktop" },
    update: {},
    create: { name: "Desktop" },
  });

  // =====================
  // BRANDS
  // =====================

  const rog = await prisma.brand.upsert({
    where: { name: "ROG" },
    update: {},
    create: {
      name: "ROG",
      description: "Republic of Gamers",
    },
  });

  const tuf = await prisma.brand.upsert({
    where: { name: "TUF Gaming" },
    update: {},
    create: {
      name: "TUF Gaming",
      description: "The Ultimate Force",
    },
  });

  // =====================
  // PRODUCTS
  // =====================

  const zephyrus = await prisma.product.create({
    data: {
      name: "ROG Zephyrus G16",
      slug: "rog-zephyrus-g16",
      brandId: rog.id,
      categoryId: laptopCategory.id,
      motto: "Power Meets Portability",
      description: "High-end gaming laptop",
      basePrice: 35000000n,
      badge: "Best Seller",
      imageUrl: "/images/g16-main.jpg",
      stock: 20,
      isActive: true,
      specs: {
        cpu: "Intel Core Ultra 9",
        gpu: "RTX 4070",
        ram: "32GB",
        storage: "1TB SSD",
      },
    },
  });

  // =====================
  // PRODUCT IMAGES
  // =====================

  await prisma.productImage.createMany({
    data: [
      {
        productId: zephyrus.id,
        imageUrl: "/images/g16-1.jpg",
        isPrimary: true,
        displayOrder: 1,
      },
      {
        productId: zephyrus.id,
        imageUrl: "/images/g16-2.jpg",
        isPrimary: false,
        displayOrder: 2,
      },
    ],
  });

  // =====================
  // PRODUCT FEATURES
  // =====================

  await prisma.productFeature.createMany({
    data: [
      {
        productId: zephyrus.id,
        title: "RTX Graphics",
        description: "Latest NVIDIA GPU",
        displayOrder: 1,
      },
      {
        productId: zephyrus.id,
        title: "High Refresh Display",
        description: "240Hz panel",
        displayOrder: 2,
      },
    ],
  });

  // =====================
  // PRODUCT CONFIGS
  // =====================

  const ram32 = await prisma.productConfig.create({
    data: {
      productId: zephyrus.id,
      configName: "32GB RAM",
      configType: "RAM",
      priceModifier: 0n,
      isDefault: true,
      displayOrder: 1,
    },
  });

  // =====================
  // CART
  // =====================

  await prisma.cartItem.create({
    data: {
      userId: customer.id,
      productId: zephyrus.id,
      configId: ram32.id,
      quantity: 1,
    },
  });

  // =====================
  // PAYMENT METHOD
  // =====================

  const bankTransfer = await prisma.paymentMethod.upsert({
    where: { code: "BANK_TRANSFER" },
    update: {},
    create: {
      code: "BANK_TRANSFER",
      name: "Bank Transfer",
      type: "bank_transfer",
      isActive: true,
    },
  });

  // =====================
  // ORDER
  // =====================

  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalPrice: 35000000n,
      status: "PAID",
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: zephyrus.id,
      configId: ram32.id,
      quantity: 1,
      unitPrice: 35000000n,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentMethodId: bankTransfer.id,
      amount: 35000000n,
      status: "PAID",
      transactionId: "TXN-001",
    },
  });

  // =====================
  // REVIEW
  // =====================

  await prisma.review.create({
    data: {
      userId: customer.id,
      productId: zephyrus.id,
      rating: 5,
      comment: "Amazing laptop!",
    },
  });

  // =====================
  // WISHLIST
  // =====================

  await prisma.wishlist.create({
    data: {
      userId: customer.id,
      productId: zephyrus.id,
    },
  });

  console.log("✅ Seed completed");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
