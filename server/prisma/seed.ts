import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding WindStore with Official Cloudinary Laptops...");

  // Clean existing tables in proper relation order
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
  console.log("Cleared existing database records.");

  // 1. Seed Users (Admin + Customers)
  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@windstore.com",
      passwordHash: adminPass,
      role: "admin",
    },
  });

  const customerList = [
    { username: "johndoe", email: "john@gmail.com" },
    { username: "janedoe", email: "jane@gmail.com" },
    { username: "budi_santoso", email: "budi@gmail.com" },
    { username: "siti_rahayu", email: "siti@gmail.com" },
    { username: "rizky_pratama", email: "rizky@gmail.com" },
    { username: "dewi_kusuma", email: "dewi@gmail.com" },
    { username: "andi_wijaya", email: "andi@gmail.com" },
    { username: "maya_putri", email: "maya@gmail.com" },
    { username: "fajar_nugroho", email: "fajar@gmail.com" },
    { username: "lina_marlina", email: "lina@gmail.com" },
    { username: "hendra_gunawan", email: "hendra@gmail.com" },
    { username: "ratna_sari", email: "ratna@gmail.com" },
  ];

  const customers = await Promise.all(
    customerList.map((c) =>
      prisma.user.create({
        data: {
          username: c.username,
          email: c.email,
          passwordHash: userPass,
          role: "customer",
        },
      })
    )
  );
  console.log(`Users seeded: ${customers.length + 1}`);

  // 2. Seed 5 Standard Categories
  const categoryNames = ["Gaming", "Ultrabook", "Business", "Creator", "Budget"];
  const categoriesMap: Record<string, any> = {};

  for (const cName of categoryNames) {
    const cat = await prisma.category.create({ data: { name: cName } });
    categoriesMap[cName] = cat;
  }
  console.log("Categories seeded: Gaming, Ultrabook, Business, Creator, Budget");

  // 3. Seed 7 Active Brands matching Cloudinary Assets
  const brandDefs = [
    { name: "Acer", description: "Pioneering technology from gaming powerhouses to ultra-efficient everyday computing." },
    { name: "ASUS", description: "In Search of Incredible - creator of ROG, Zenbook, and groundbreaking dual-screen laptops." },
    { name: "Dell", description: "American engineering excellence featuring Alienware and legendary XPS laptops." },
    { name: "HP", description: "Ingenuity in every machine - from OMEN gaming rigs to Spectre luxury convertibles." },
    { name: "Lenovo", description: "Smarter Technology for All - home of Legion gaming champions and ThinkPad icons." },
    { name: "MSI", description: "True Gaming and Content Creation powerhouse with military-grade engineering." },
    { name: "Samsung", description: "Next-generation Galaxy connected computing with Dynamic AMOLED 2X displays." },
  ];

  const brandsMap: Record<string, any> = {};
  for (const b of brandDefs) {
    const createdBrand = await prisma.brand.create({ data: b });
    brandsMap[b.name.toLowerCase()] = createdBrand;
  }
  console.log("Active Brands seeded: Acer, ASUS, Dell, HP, Lenovo, MSI, Samsung");

  // 4. Seed Payment Methods
  const paymentMethods = await Promise.all([
    prisma.paymentMethod.create({ data: { code: "BCA_VA", name: "BCA Virtual Account", type: "virtual_account", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "BNI_VA", name: "BNI Virtual Account", type: "virtual_account", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "MANDIRI_VA", name: "Mandiri Virtual Account", type: "virtual_account", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "GOPAY", name: "GoPay", type: "ewallet", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "OVO", name: "OVO", type: "ewallet", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "DANA", name: "DANA", type: "ewallet", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "QRIS", name: "QRIS", type: "qris", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "COD", name: "Cash on Delivery", type: "cod", isActive: true } }),
    prisma.paymentMethod.create({ data: { code: "MIDTRANS", name: "Midtrans Payment Gateway", type: "gateway", isActive: true } }),
  ]);
  console.log("Payment methods seeded.");

  // 5. Seed Real Laptops Catalog
  const products = [
  {
    "name": "Acer Nitro V 15 (ANV15-51)",
    "brandName": "Acer",
    "categoryName": "Gaming",
    "slug": "acer-nitro-v15",
    "motto": "Dual-Fan Dominance, Infinite Play",
    "badge": "Best Value Gaming",
    "description": "Laptop gaming bertenaga Intel Core generasi ke-13 dan grafis NVIDIA RTX 40 Series dengan sistem pendingin dual-fan inovatif.",
    "basePrice": BigInt("14499000"),
    "stock": 12,
    "specs": {
      "processor": "Intel Core i5-13420H (8 Cores, up to 4.6 GHz)",
      "ram": "16GB DDR5 5200MHz",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "15.6 FHD (1920x1080) IPS 144Hz",
      "gpu": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "battery": "57 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1800000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "144Hz IPS Gaming Display",
      "Dual-Fan Exhaust Cooling",
      "NitroSense Control Center",
      "Thunderbolt 4 Support"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935437/acer-nitro-v15-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935402/acer-nitro-v15-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935401/acer-nitro-v15-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935437/acer-nitro-v15-01.webp"
  },
  {
    "name": "Acer Swift Go 16 AI (SFG16-72)",
    "brandName": "Acer",
    "categoryName": "Ultrabook",
    "slug": "acer-swift-go-16-ai",
    "motto": "Next-Gen AI Performance on 3.2K OLED",
    "badge": "Copilot+ PC",
    "description": "Ultrabook tipis berlayar 3.2K OLED 120Hz ditenagai prosesor Intel Core Ultra dengan Dedicated AI Engine.",
    "basePrice": BigInt("17999000"),
    "stock": 8,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, Intel AI Boost)",
      "ram": "16GB LPDDR5X 6400MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 3.2K (3200x2000) OLED 120Hz 100% DCI-P3 500 nits",
      "gpu": "Intel Arc Graphics",
      "battery": "65 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "3.2K 120Hz OLED Display",
      "Intel AI Boost NPU",
      "1440p QHD AI Webcam",
      "TwinAir Dual Fan Cooling"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935436/acer-swift-go-16-ai-03.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935436/acer-swift-go-16-ai-01.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935435/acer-swift-go-16-ai-02.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935436/acer-swift-go-16-ai-03.webp"
  },
  {
    "name": "Acer Aspire Vero 14 (AV14-51)",
    "brandName": "Acer",
    "categoryName": "Business",
    "slug": "acer-aspire-vero",
    "motto": "Eco-Friendly Innovation for Everyday Work",
    "badge": "Eco Champion",
    "description": "Laptop ramah lingkungan dengan sasis material plastik daur ulang (PCR), sertifikasi Intel Evo, dan baterai tahan lama.",
    "basePrice": BigInt("10999000"),
    "stock": 14,
    "specs": {
      "processor": "Intel Core i5-1335U (10 Cores, up to 4.6 GHz)",
      "ram": "16GB LPDDR5 Dual Channel",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "14 FHD (1920x1080) IPS 100% sRGB Anti-Glare",
      "gpu": "Intel Iris Xe Graphics",
      "battery": "56 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "30% PCR Recycled Chassis",
      "Intel Evo Platform Certified",
      "OceanGlass Touchpad",
      "VeroSense Battery Management"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935400/acer-aspire-vero-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935436/acer-aspire-vero-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935435/acer-aspire-vero-03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935400/acer-aspire-vero-01.webp"
  },
  {
    "name": "Acer Aspire Lite 15 Pro",
    "brandName": "Acer",
    "categoryName": "Budget",
    "slug": "acer-aspire-lite-7-pro",
    "motto": "Smart Value & Reliable Daily Multitasking",
    "badge": "Best Seller",
    "description": "Solusi laptop produktivitas terjangkau dengan layar lebar 15.6 inci, prosesor kencang, dan konektivitas lengkap.",
    "basePrice": BigInt("9499000"),
    "stock": 20,
    "specs": {
      "processor": "Intel Core i7-1255U (10 Cores, up to 4.7 GHz)",
      "ram": "16GB DDR4 3200MHz",
      "storage": "512GB PCIe NVMe SSD",
      "display": "15.6 FHD (1920x1080) IPS Narrow Border",
      "gpu": "Intel Iris Xe Graphics",
      "battery": "45 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("850000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Narrow Bezel Design",
      "Numeric Keypad Built-in",
      "Type-C Fast Charging",
      "Ergonomic Hinge"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935435/acer-aspire-lite-7-pro-03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935407/acer-aspire-lite-7-pro-01.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935404/acer-aspire-lite-7-pro-02.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935435/acer-aspire-lite-7-pro-03.jpg"
  },
  {
    "name": "HP OMEN Transcend 14",
    "brandName": "HP",
    "categoryName": "Gaming",
    "slug": "hp-omen-transcend-14",
    "motto": "The World's Lightest 14 Gaming Laptop",
    "badge": "Editor's Choice",
    "description": "Laptop gaming ultra-ringkas 1.6 kg berlayar 2.8K 120Hz OLED dengan keyboard transparan RGB dan pendingin vapor chamber.",
    "basePrice": BigInt("26999000"),
    "stock": 7,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, up to 4.8 GHz)",
      "ram": "16GB LPDDR5X 7467MHz",
      "storage": "1TB PCIe Gen4 NVMe M.2 SSD",
      "display": "14 2.8K (2880x1800) OLED 120Hz 0.2ms HDR 500 nits",
      "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "battery": "71 Wh Li-ion Polymer",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Vapor Chamber Cooling System",
      "2.8K IMAX Enhanced OLED",
      "HyperX Audio Tuned",
      "Ultra-light 1.6kg Magnesium Frame"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935399/hp_omen_transcend_14_01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935393/hp_omen_transcend_14_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935390/hp_omen_transcend_14_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935399/hp_omen_transcend_14_01.jpg"
  },
  {
    "name": "HP EliteBook Ultra G1q AI PC",
    "brandName": "HP",
    "categoryName": "Business",
    "slug": "hp-elitebook-ultra-g1q",
    "motto": "Arm-Powered Enterprise Security & All-Day Battery",
    "badge": "Enterprise Pick",
    "description": "Laptop enterprise premium bertenaga Snapdragon X Elite dengan NPU 45 TOPS dan keamanan HP Wolf Security.",
    "basePrice": BigInt("25499000"),
    "stock": 10,
    "specs": {
      "processor": "Qualcomm Snapdragon X Elite X1E-78-100 (12 Cores, up to 3.4 GHz)",
      "ram": "16GB LPDDR5X 8448MHz",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "14 2.2K (2240x1400) IPS Touchscreen 300 nits 100% sRGB",
      "gpu": "Qualcomm Adreno GPU (45 TOPS Hexagon NPU)",
      "battery": "59 Wh Li-ion Polymer",
      "os": "Windows 11 Pro on ARM"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "HP Wolf Pro Security Edition",
      "45 TOPS Qualcomm AI NPU",
      "Up to 26 Hours Battery Life",
      "Corning Gorilla Glass Touch"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935395/hp_elitebook_ultra_g1q_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935394/hp_elitebook_ultra_g1q_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935399/hp_elitebook_ultra_g1q_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935395/hp_elitebook_ultra_g1q_01.webp"
  },
  {
    "name": "HP Spectre x360 14 (2024)",
    "brandName": "HP",
    "categoryName": "Creator",
    "slug": "hp-spectre-x360",
    "motto": "Artistry in Motion, Gem-Cut 2-in-1 Elegance",
    "badge": "Premium Pick",
    "description": "Laptop convertible 2-in-1 termewah dengan engsel 360 derajat, webcam 9MP AI IR, dan layar 2.8K OLED IMAX.",
    "basePrice": BigInt("27999000"),
    "stock": 6,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, Intel AI Boost)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "1TB PCIe NVMe TLC M.2 SSD",
      "display": "14 2.8K (2880x1800) OLED Touch x360 120Hz 500 nits HDR",
      "gpu": "Intel Arc Graphics",
      "battery": "68 Wh Li-ion Polymer",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "9MP AI Tracking Camera",
      "HP Tilt Pen Included",
      "Quad Speakers Poly Studio",
      "CNC Gem-Cut Aluminum Chassis"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935388/hp_spectre_x360_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935398/hp_spectre_x360_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935398/hp_spectre_x360_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935388/hp_spectre_x360_01.webp"
  },
  {
    "name": "HP Victus Gaming 16",
    "brandName": "HP",
    "categoryName": "Gaming",
    "slug": "hp-victus-16",
    "motto": "Power Through Every Match",
    "badge": "Gamer Favorite",
    "description": "Laptop gaming andal dengan layar besar 16.1 inci 144Hz, grafis RTX 4060, dan sistem pendingin OMEN Tempest.",
    "basePrice": BigInt("16499000"),
    "stock": 15,
    "specs": {
      "processor": "AMD Ryzen 7 7840HS (8 Cores, up to 5.1 GHz)",
      "ram": "16GB DDR5 5600MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16.1 FHD (1920x1080) IPS 144Hz 100% sRGB",
      "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "battery": "70 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1600000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "16.1 Gaming Screen",
      "OMEN Tempest Thermal Architecture",
      "Bang & Olufsen Audio",
      "Backlit Keyboard with Numpad"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935397/hp_victus_16_02.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935396/hp_victus_16_03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935392/hp_victus_16_01.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935397/hp_victus_16_02.webp"
  },
  {
    "name": "HP OmniBook Ultra Flip 14 Next-Gen AI",
    "brandName": "HP",
    "categoryName": "Ultrabook",
    "slug": "hp-omnibook-ultra-flip-14",
    "motto": "Lunar Lake AI Powerhouse in Flexible 360 Form",
    "badge": "New Release",
    "description": "Laptop AI generasi terbaru dengan prosesor Intel Lunar Lake Core Ultra Series 2, NPU 47 TOPS, dan desain ultra-fleksibel.",
    "basePrice": BigInt("28999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 7 256V (Lunar Lake, 47 TOPS NPU)",
      "ram": "16GB LPDDR5X 8533MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "14 2.8K (2880x1800) OLED Touch x360 120Hz VRR",
      "gpu": "Intel Arc Graphics 140V",
      "battery": "64 Wh Li-ion Polymer",
      "os": "Windows 11 Home (Copilot+ PC)"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("3000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Intel Lunar Lake Architecture",
      "47 TOPS Dedicated AI NPU",
      "Haptic Touchpad",
      "Wi-Fi 7 Connectivity"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935393/hp_omnibook_ultra_flip_14_02.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935391/hp_omnibook_ultra_flip_14_03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935387/hp_omnibook_ultra_flip_14_01.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935393/hp_omnibook_ultra_flip_14_02.webp"
  },
  {
    "name": "Dell Alienware m16 R2",
    "brandName": "Dell",
    "categoryName": "Gaming",
    "slug": "dell-alienware-m16",
    "motto": "Stealth Performance, Pure Adrenaline",
    "badge": "Flagship Gaming",
    "description": "Laptop gaming legendaris Alienware berdesain stealth yang lebih ringkas dengan layar QHD+ 240Hz dan tombol Stealth Mode instan.",
    "basePrice": BigInt("35999000"),
    "stock": 6,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, up to 4.8 GHz)",
      "ram": "16GB DDR5 5600MHz",
      "storage": "1TB PCIe NVMe M.2 SSD",
      "display": "16 QHD+ (2560x1600) 240Hz 3ms ComfortView Plus",
      "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("5000000"),
        "default": false,
        "order": 3
      }
    ],
    "features": [
      "Alienware Cryo-Tech Cooling",
      "Stealth Mode Switch",
      "AlienFX RGB Per-Key Keyboard",
      "240Hz Ultra-Fast Gaming Panel"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935374/dell_alienware_m16_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935386/dell_alienware_m16_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935384/dell_alienware_m16_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935374/dell_alienware_m16_01.webp"
  },
  {
    "name": "Dell Alienware x16 R2",
    "brandName": "Dell",
    "categoryName": "Gaming",
    "slug": "dell-alienware-x16",
    "motto": "The Apex of Luxury Gaming Engineering",
    "badge": "Ultimate Beast",
    "description": "Laptop gaming tertipis dan termewah dari Alienware bertenaga Core Ultra 9 dan RTX 4090 dengan sasis Lunar Silver magnesium alloy.",
    "basePrice": BigInt("59999000"),
    "stock": 4,
    "specs": {
      "processor": "Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "2TB PCIe Gen4 NVMe SSD",
      "display": "16 QHD+ (2560x1600) 240Hz 100% DCI-P3 G-Sync",
      "gpu": "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 4TB SSD (RAID)",
        "type": "storage",
        "modifier": BigInt("7000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Element 31 Thermal Interface",
      "Vapor Chamber & Quad Fans",
      "Lunar Light Micro-LED Stadium Ring",
      "Cherry MX Ultra Low Profile Keys"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_alienware_x16_01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935375/dell_alienware_x16_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935375/dell_alienware_x16_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_alienware_x16_01.jpg"
  },
  {
    "name": "Dell Latitude 7455 Copilot+ PC",
    "brandName": "Dell",
    "categoryName": "Business",
    "slug": "dell-latitude-7455",
    "motto": "Pioneering Snapdragon Performance for Business",
    "badge": "Enterprise AI",
    "description": "Laptop bisnis komersial berdaya tahan baterai berhari-hari dengan prosesor Snapdragon X Elite dan sertifikasi Dell Trusted Device.",
    "basePrice": BigInt("27999000"),
    "stock": 8,
    "specs": {
      "processor": "Qualcomm Snapdragon X Elite (12 Cores, up to 4.0 GHz)",
      "ram": "32GB LPDDR5X 8448MHz",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "14 QHD+ (2560x1600) IPS Touchscreen 400 nits Anti-Reflective",
      "gpu": "Qualcomm Adreno GPU (45 TOPS NPU)",
      "battery": "54 Wh Li-ion",
      "os": "Windows 11 Pro on ARM"
    },
    "configs": [
      {
        "name": "32GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1800000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Dell SafeID & SafeBIOS Security",
      "45 TOPS Qualcomm Hexagon NPU",
      "ExpressCharge 80% in 60min",
      "Quad Speakers with Waves MaxxAudio"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935386/dell_latitude_7455_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_latitude_7455_03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935376/dell_latitude_7455_02.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935386/dell_latitude_7455_01.webp"
  },
  {
    "name": "Dell Inspiron 14 Plus (7440)",
    "brandName": "Dell",
    "categoryName": "Budget",
    "slug": "dell-inspiron-14-plus",
    "motto": "Elevated Daily Power, Crafted in Aluminum",
    "badge": "Best Multitasker",
    "description": "Laptop serbaguna berbodi aluminium solid dengan prosesor Intel Core Ultra dan layar tajam 2.2K 16:10.",
    "basePrice": BigInt("16499000"),
    "stock": 12,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, Intel AI Boost)",
      "ram": "16GB LPDDR5X 6400MHz",
      "storage": "1TB PCIe NVMe M.2 SSD",
      "display": "14 2.2K (2240x1400) IPS Anti-Glare 300 nits ComfortView Plus",
      "gpu": "Intel Arc Graphics",
      "battery": "64 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "2.2K 16:10 Productivity Display",
      "FHD HDR Webcam with Privacy Shutter",
      "Mil-810H Tested Durability",
      "Thunderbolt 4 with Power Delivery"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_inspiron_14_plus_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935377/dell_inspiron_14_plus_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935376/dell_inspiron_14_plus_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_inspiron_14_plus_01.webp"
  },
  {
    "name": "Dell XPS 14 (9440)",
    "brandName": "Dell",
    "categoryName": "Ultrabook",
    "slug": "dell-xps-14-laptop-3",
    "motto": "Sculpted Elegance & Seamless Edge-to-Edge Glass",
    "badge": "Design Icon",
    "description": "Laptop ikonik Dell dengan touchpad kaca mulus tersembunyi, touch function row kapasitif, dan layar 3.2K OLED InfinityEdge.",
    "basePrice": BigInt("38999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, up to 4.8 GHz)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "14.5 3.2K (3200x2000) OLED Touch 120Hz Gorilla Glass Victus",
      "gpu": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "battery": "69.5 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("3500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Seamless Haptic Glass Touchpad",
      "Capacitive Touch Function Row",
      "Zero-Lattice Keyboard",
      "CNC Machined Aluminum Body"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_xps_14_laptop_3_03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935379/dell_xps_14_laptop_3_01.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935376/dell_xps_14_laptop_3_03_1.jpg",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935375/dell_xps_14_laptop_3_02.jpg",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935385/dell_xps_14_laptop_3_03.jpg"
  },
  {
    "name": "MSI Crosshair 16 HX AI (D14V)",
    "brandName": "MSI",
    "categoryName": "Gaming",
    "slug": "msi-crosshair-16-hx-ai",
    "motto": "Cyberpunk Precision, 240Hz Target Locked",
    "badge": "Hot Gaming",
    "description": "Laptop gaming berdesain futuristik cyberpunk dengan prosesor i7 generasi ke-14, RTX 4060 140W, dan layar super mulus 240Hz.",
    "basePrice": BigInt("22999000"),
    "stock": 9,
    "specs": {
      "processor": "Intel Core i7-14700HX (20 Cores, up to 5.5 GHz)",
      "ram": "16GB DDR5 5600MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 QHD+ (2560x1600) 240Hz 100% DCI-P3 IPS-Level",
      "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1700000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "24-Zone RGB Gaming Keyboard",
      "Cooler Boost 5 Dual Fans",
      "MSI AI Artist Engine",
      "240Hz DCI-P3 Display"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935373/msi-crosshair-16-hx-ai-03.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935369/msi-crosshair-16-hx-ai-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935369/msi-crosshair-16-hx-ai-01.webp",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935365/msi-crosshair-16-hx-ai-04.webp",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935373/msi-crosshair-16-hx-ai-03.webp"
  },
  {
    "name": "MSI Titan 18 HX Dragon Edition (Draco)",
    "brandName": "MSI",
    "categoryName": "Gaming",
    "slug": "msi-titan-18-hx-dragon-edition-draco-epic",
    "motto": "Total Supremacy, The Dragon Ascends",
    "badge": "World's Most Powerful",
    "description": "Laptop monster terkuat di dunia edisi khusus Draco dengan prosesor i9-14900HX, RTX 4090 175W, keyboard mekanik Cherry MX, dan layar Mini-LED 4K 120Hz.",
    "basePrice": BigInt("89999000"),
    "stock": 2,
    "specs": {
      "processor": "Intel Core i9-14900HX (24 Cores, up to 5.8 GHz)",
      "ram": "64GB DDR5 5600MHz (4 Slot up to 192GB)",
      "storage": "4TB (2x 2TB NVMe PCIe Gen5 RAID 0)",
      "display": "18 4K UHD+ (3840x2400) Mini-LED 120Hz DisplayHDR 1000",
      "gpu": "NVIDIA GeForce RTX 4090 16GB GDDR6 (OverBoost Ultra 270W)",
      "battery": "99.9 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "64GB / 4TB SSD (RAID)",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "128GB / 6TB SSD (Custom)",
        "type": "storage",
        "modifier": BigInt("15000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Cherry MX Ultra-Low Profile Mechanical Keys",
      "OverBoost Ultra 270W Total Power",
      "World's First Seamless RGB Haptic Touchpad",
      "Vapor Chamber Thermal Design"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935372/msi-titan-18-hx-dragon-edition-draco-epic-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935365/msi-titan-18-hx-dragon-edition-draco-epic-03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935363/msi-titan-18-hx-dragon-edition-draco-epic-02.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935372/msi-titan-18-hx-dragon-edition-draco-epic-01.webp"
  },
  {
    "name": "MSI Prestige 14 AI+ (Vincent Van Gogh Edition)",
    "brandName": "MSI",
    "categoryName": "Creator",
    "slug": "msi-prestige-14-ai-plus-vincent-van-gogh-edition",
    "motto": "Where High Technology Meets Timeless Masterpieces",
    "badge": "Collector Special",
    "description": "Laptop kreator edisi seni kolektor berlisensi resmi Museum Van Gogh dengan grafir mahakarya seni dan prosesor Intel Lunar Lake.",
    "basePrice": BigInt("29999000"),
    "stock": 4,
    "specs": {
      "processor": "Intel Core Ultra 7 258V (Lunar Lake, 47 TOPS NPU)",
      "ram": "32GB LPDDR5X (On-Package)",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "14 2.8K (2880x1800) OLED 16:10 100% DCI-P3 500 nits",
      "gpu": "Intel Arc Graphics 140V",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Official Van Gogh Museum Artwork Lid",
      "Magnesium-Aluminum Lightweight Body",
      "Massive 90Wh Battery (25h runtime)",
      "Thunderbolt 4 & Wi-Fi 7"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935372/msi-prestige-14-AI-PLUS-VINCENT-VAN-GOGH-EDITION-02.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935364/msi-prestige-14-AI-PLUS-VINCENT-VAN-GOGH-EDITION-03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935364/msi-prestige-14-AI-PLUS-VINCENT-VAN-GOGH-EDITION-01.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935372/msi-prestige-14-AI-PLUS-VINCENT-VAN-GOGH-EDITION-02.webp"
  },
  {
    "name": "MSI Modern 14 (C13X)",
    "brandName": "MSI",
    "categoryName": "Budget",
    "slug": "msi-modern-14-c13x",
    "motto": "Vibrant Daily Productivity in Urban Style",
    "badge": "Campus Pick",
    "description": "Laptop tipis 1.4 kg dengan engsel 180° lay-flat dan performa Intel Core generasi ke-13 yang efisien.",
    "basePrice": BigInt("7899000"),
    "stock": 18,
    "specs": {
      "processor": "Intel Core i5-1335U (10 Cores, up to 4.6 GHz)",
      "ram": "16GB DDR4 3200MHz",
      "storage": "512GB NVMe PCIe Gen3 SSD",
      "display": "14 FHD (1920x1080) IPS-Level Thin Bezel",
      "gpu": "Intel Iris Xe Graphics",
      "battery": "39.3 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("700000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Ultra-portable 1.4kg Weight",
      "180 Lay-Flat & Flip-n-Share",
      "Hi-Res Audio Certified",
      "Military-Grade MIL-STD-810G Durability"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935371/msi-modern-14-c13x-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935371/msi-modern-14-c13x-01.webp"
  },
  {
    "name": "MSI Modern 14 AI+ (A4S)",
    "brandName": "MSI",
    "categoryName": "Budget",
    "slug": "msi-modern-a4s-ai-plus",
    "motto": "Next-Gen AI Smarts in an Accessible Package",
    "badge": "Smart AI",
    "description": "Laptop AI modern dengan prosesor AMD Ryzen AI, grafis Radeon 780M terintegrasi, dan bodi ringkas yang elegan.",
    "basePrice": BigInt("10499000"),
    "stock": 14,
    "specs": {
      "processor": "AMD Ryzen AI 7 350 / Ryzen 7 8840HS (8 Cores)",
      "ram": "16GB LPDDR5 6400MHz",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "14 FHD (1920x1080) IPS-Level 100% sRGB",
      "gpu": "AMD Radeon 780M Graphics",
      "battery": "53.8 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("900000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "AMD Ryzen AI NPU Built-in",
      "Type-C PD Fast Charging",
      "White Backlit Ergonomic Keyboard",
      "Silky Smooth Glass Touchpad"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935371/msi-modern-a4s-ai-plus-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935370/msi-modern-a4s-ai-plus-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935370/msi-modern-a4s-ai-plus-03.webp",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935370/msi-modern-a4s-ai-plus-04.webp",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935371/msi-modern-a4s-ai-plus-01.webp"
  },
  {
    "name": "MSI Modern 14 (B5SX)",
    "brandName": "MSI",
    "categoryName": "Budget",
    "slug": "msi-modern-14-b5sx",
    "motto": "Dependable Performance for Everyday Success",
    "badge": "Value Master",
    "description": "Laptop kerja harian dengan prosesor AMD Ryzen 5, konsumsi daya hemat, dan bobot ringan untuk mahasiswa dan profesional muda.",
    "basePrice": BigInt("7499000"),
    "stock": 15,
    "specs": {
      "processor": "AMD Ryzen 5 7530U (6 Cores, 12 Threads)",
      "ram": "16GB DDR4 3200MHz",
      "storage": "512GB PCIe NVMe SSD",
      "display": "14 FHD (1920x1080) IPS-Level 60Hz Anti-Glare",
      "gpu": "AMD Radeon Graphics",
      "battery": "39.3 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Lightweight 1.4kg",
      "Precision Touchpad",
      "Full-Size SD Card Reader",
      "Nahimic 3 Audio Enhancer"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935368/msi-modern-14-b5sx-02.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935367/msi-modern-14-b5sx-03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935367/msi-modern-14-b5sx-01.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935368/msi-modern-14-b5sx-02.webp"
  },
  {
    "name": "MSI Commercial 15 (B1MX)",
    "brandName": "MSI",
    "categoryName": "Business",
    "slug": "msi-commercial-15-b1mx",
    "motto": "Enterprise Grade Defense & Continuous Workflows",
    "badge": "Enterprise Ready",
    "description": "Laptop bisnis enterprise dengan Smart Card Reader built-in, Discrete TPM 2.0, dan garansi keamanan korporasi penuh.",
    "basePrice": BigInt("12999000"),
    "stock": 11,
    "specs": {
      "processor": "Intel Core i7-1355U (10 Cores, up to 5.0 GHz)",
      "ram": "16GB DDR4 3200MHz (Dual SODIMM up to 64GB)",
      "storage": "512GB PCIe Gen4 NVMe SSD",
      "display": "15.6 FHD (1920x1080) IPS Anti-Glare 300 nits",
      "gpu": "Intel Iris Xe Graphics",
      "battery": "53.8 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2200000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Built-in Smart Card Reader",
      "NFC Module for 2FA Login",
      "Discrete TPM 2.0 Hardware Security",
      "Kensington Lock Slot"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935368/msi-commercial-15-b1mx-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935367/msi-commercial-15-b1mx-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935366/msi-commercial-15-b1mx-03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935368/msi-commercial-15-b1mx-01.webp"
  },
  {
    "name": "MSI Stealth A16 AI+ (A3V)",
    "brandName": "MSI",
    "categoryName": "Creator",
    "slug": "msi-stealth-a16-ai-plus",
    "motto": "Thin, Light, and Unstoppably Powerful",
    "badge": "Creator Favorite",
    "description": "Laptop workstation creator 16 inci tertipis berbodi magnesium-aluminium dengan Ryzen AI 9 50 TOPS dan NVIDIA RTX 4070.",
    "basePrice": BigInt("36999000"),
    "stock": 5,
    "specs": {
      "processor": "AMD Ryzen AI 9 HX 370 (12 Cores, 24 Threads, 50 TOPS NPU)",
      "ram": "32GB DDR5 5600MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 QHD+ (2560x1600) OLED 240Hz 0.2ms 100% DCI-P3",
      "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "battery": "99.9 Wh Li-ion (Max Legal Airline Capacity)",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Magnesium-Aluminum Alloy 1.9kg",
      "99.9Wh Maximum Legal Battery",
      "Dynaudio 6-Speaker Sound System",
      "240Hz OLED Display"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935366/msi-stealth-a16-ai-plus-01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935361/msi-stealth-a16-ai-plus-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935367/msi-stealth-a16-ai-plus-03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935366/msi-stealth-a16-ai-plus-01.webp"
  },
  {
    "name": "MSI Prestige 14 Flip AI+ Evo",
    "brandName": "MSI",
    "categoryName": "Ultrabook",
    "slug": "msi-prestige-14-flip-ai-plus",
    "motto": "Fluid Creativity in a 360 Dynamic Flip",
    "badge": "Versatile Pro",
    "description": "Ultrabook 2-in-1 berengsel 360 derajat dengan dukungan stylus MSI Pen 2 berteknologi haptic feedback dan baterai tahan 18 jam.",
    "basePrice": BigInt("23999000"),
    "stock": 7,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, Intel AI Boost)",
      "ram": "16GB LPDDR5X 6400MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "14 QHD+ (2560x1600) Touchscreen 360 Flip 100% DCI-P3",
      "gpu": "Intel Arc Graphics",
      "battery": "72 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "360 Hinge Convertible",
      "MSI Pen 2 with Haptic Tip",
      "Tobii Aware Privacy Screen",
      "Fingerprint & IR Face Recognition"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935364/msi-prestige-14-flip-AI-PLUS-04.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935363/msi-prestige-14-flip-AI-PLUS-02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935362/msi-prestige-14-flip-AI-PLUS-01.webp",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935361/msi-prestige-14-flip-AI-PLUS-03.webp",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935364/msi-prestige-14-flip-AI-PLUS-04.webp"
  },
  {
    "name": "ASUS ProArt P14 (H7407)",
    "brandName": "ASUS",
    "categoryName": "Creator",
    "slug": "asus-proart-p14",
    "motto": "Accelerate Creativity with Grace & Blackwell Power",
    "badge": "Studio Flagship",
    "description": "Mobile workstation profesional bertenaga platform NVIDIA Grace 20-Core dan arsitektur Blackwell dengan layar Lumina OLED 3K.",
    "basePrice": BigInt("38999000"),
    "stock": 4,
    "specs": {
      "processor": "NVIDIA Grace 20-Core Superchip / High-End Creator CPU",
      "ram": "64GB LPDDR5X Unified High-Speed Memory",
      "storage": "2TB PCIe Gen4 NVMe SSD",
      "display": "14.5 3K (2880x1800) Lumina OLED 120Hz Touch 500 nits HDR",
      "gpu": "NVIDIA Blackwell RTX 6144 Cores Dedicated GPU",
      "battery": "73 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "64GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Physical ASUS DialPad Wheel",
      "ProArt Creator Hub Suite",
      "PANTONE Validated 100% DCI-P3",
      "Military-Grade MIL-STD 810H"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-proart-p14-01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935359/asus-proart-p14-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935360/asus-proart-p14-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935346/asus-proart-p14-04.jpg",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-proart-p14-01.jpg"
  },
  {
    "name": "ASUS ProArt PX13 (HN7306)",
    "brandName": "ASUS",
    "categoryName": "Creator",
    "slug": "asus-proart-px13-gopro-black",
    "motto": "Ultra-Portable Studio in 13.3 Convertible Body",
    "badge": "Compact Creator",
    "description": "Laptop kreator 2-in-1 13.3 inci dengan engsel 360 derajat, AMD Ryzen AI 9 HX 370 50 TOPS, dan grafis NVIDIA RTX 4060.",
    "basePrice": BigInt("31999000"),
    "stock": 6,
    "specs": {
      "processor": "AMD Ryzen AI 9 HX 370 (12 Cores, 24 Threads, 50 TOPS)",
      "ram": "32GB LPDDR5X 7500MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "13.3 3K (2880x1800) OLED Touch 360 60Hz 500 nits",
      "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "battery": "73 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "ASUS DialPad on Touchpad",
      "360 Flip Form Factor",
      "50 TOPS AMD XDNA 2 NPU",
      "ASUS Pen 2.0 Stylus Included"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935351/asus-proart-px13-gopro-black-01.png",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935345/asus-proart-px13-gopro-black-02.png",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935352/asus-proart-px13-gopro-black-03.png",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935345/asus-proart-px13-gopro-black-04.png",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935351/asus-proart-px13-gopro-black-01.png"
  },
  {
    "name": "ASUS ROG Strix SCAR 18 (2024)",
    "brandName": "ASUS",
    "categoryName": "Gaming",
    "slug": "asus-rog-strix-scar-18",
    "motto": "The Undisputed Esports Sovereign",
    "badge": "Ultimate Gaming",
    "description": "Laptop gaming 18 inci paling bertenaga di dunia dengan Mini-LED Nebula HDR 240Hz, Core i9-14900HX, dan RTX 4090 175W TGP.",
    "basePrice": BigInt("68999000"),
    "stock": 3,
    "specs": {
      "processor": "Intel Core i9-14900HX (24 Cores, up to 5.8 GHz)",
      "ram": "32GB DDR5 5600MHz (up to 64GB)",
      "storage": "2TB (2x 1TB PCIe 4.0 Performance SSD in RAID 0)",
      "display": "18 QHD+ (2560x1600) ROG Nebula HDR Mini-LED 240Hz 1100 nits",
      "gpu": "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W Max TGP)",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 2TB SSD (RAID)",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "64GB / 4TB SSD (RAID)",
        "type": "storage",
        "modifier": BigInt("8000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "ROG Intelligent Cooling with Conductonaut Extreme Liquid Metal",
      "Tri-Fan Technology with Full-Surround Vents",
      "2000+ Dimming Zones Mini-LED",
      "Per-Key RGB Semi-Translucent Deck"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935353/asus-rog-strix-scar-18-02.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935350/asus-rog-strix-scar-18-04.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935346/asus-rog-strix-scar-18-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935343/asus-rog-strix-scar-18-01.jpg",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935353/asus-rog-strix-scar-18-02.jpg"
  },
  {
    "name": "ASUS ROG Zephyrus G16 (GU605)",
    "brandName": "ASUS",
    "categoryName": "Gaming",
    "slug": "asus-zephyrus-g16-mb1-grey",
    "motto": "Precision Machined Luxury, 240Hz OLED Gaming",
    "badge": "Design Marvel",
    "description": "Laptop gaming ultra-ramping 1.49 cm berbodi aluminium CNC dengan lampu Slash Lighting, Core Ultra 9, dan RTX 4080.",
    "basePrice": BigInt("42999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 9 185H (16 Cores, Intel AI Boost)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 2.5K (2560x1600) ROG Nebula OLED 240Hz 0.2ms G-Sync",
      "gpu": "NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("3000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Slash Lighting Lid Array",
      "Ultra-thin 1.49cm CNC Aluminum Unibody",
      "ROG Nebula OLED 240Hz Panel",
      "6-Speaker Sound System with Dual Woofers"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935350/asus-zephyrus-g16-mb1-grey-01.png",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935359/asus-zephyrus-g16-mb1-grey-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935348/asus-zephyrus-g16-mb1-grey-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935350/asus-zephyrus-g16-mb1-grey-01.png"
  },
  {
    "name": "ASUS TUF Gaming A16 Advantage Edition",
    "brandName": "ASUS",
    "categoryName": "Gaming",
    "slug": "asus-tuf-gaming-16",
    "motto": "Military Durability, Max-Out Frame Rates",
    "badge": "Gamer Value",
    "description": "Laptop gaming tangguh berstandar militer MIL-STD 810H dengan layar 16 inci 165Hz dan grafis RTX 4060 140W TGP.",
    "basePrice": BigInt("17999000"),
    "stock": 12,
    "specs": {
      "processor": "AMD Ryzen 7 7735HS (8 Cores, up to 4.75 GHz)",
      "ram": "16GB DDR5 4800MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 FHD+ (1920x1200) 165Hz IPS 100% sRGB G-Sync",
      "gpu": "NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)",
      "battery": "90 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("1500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Military-Grade MIL-STD-810H Tested",
      "84-Blade Arc Flow Fans",
      "Two-Way AI Noise Cancelation",
      "MUX Switch with NVIDIA Advanced Optimus"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-tuf-gaming-16-03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935350/asus-tuf-gaming-16-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935347/asus-tuf-gaming-16-01.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-tuf-gaming-16-03.jpg"
  },
  {
    "name": "ASUS Vivobook 16 (M1605)",
    "brandName": "ASUS",
    "categoryName": "Budget",
    "slug": "asus-vivobook-16-m1605",
    "motto": "Big Screen Efficiency, Smooth Everyday Flow",
    "badge": "Best Seller",
    "description": "Laptop layar lega 16 inci dengan prosesor AMD Ryzen 7, engsel 180°, dan lapisan antimikroba ASUS Antimicrobial Guard.",
    "basePrice": BigInt("9999000"),
    "stock": 22,
    "specs": {
      "processor": "AMD Ryzen 7 7730U (8 Cores, 16 Threads)",
      "ram": "16GB DDR4 (8GB Onboard + 8GB SO-DIMM)",
      "storage": "512GB M.2 NVMe PCIe 3.0 SSD",
      "display": "16 WUXGA (1920x1200) 16:10 IPS NanoEdge",
      "gpu": "AMD Radeon Graphics",
      "battery": "42 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("750000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "16-inch 16:10 Spacious Display",
      "ASUS Antimicrobial Guard Plus",
      "180 Lay-Flat Hinge",
      "Webcam Physical Privacy Shield"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935357/asus-vivobook-16-m1605-04.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935354/asus-vivobook-16-m1605-05.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935348/asus-vivobook-16-m1605-02.jpg",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935344/asus-vivobook-16-m1605-03.jpg",
        "isPrimary": false,
        "displayOrder": 4
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935342/asus-vivobook-16-m1605-01.jpg",
        "isPrimary": false,
        "displayOrder": 5
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935357/asus-vivobook-16-m1605-04.jpg"
  },
  {
    "name": "ASUS Zenbook Duo (UX8406)",
    "brandName": "ASUS",
    "categoryName": "Creator",
    "slug": "asus-zenbook-duo-ux8407",
    "motto": "Two 3K OLED Screens, Infinite Possibilities",
    "badge": "Innovation Award",
    "description": "Laptop revolusioner dengan dua layar 14 inci 3K OLED 120Hz penuh, keyboard Bluetooth lepas-pasang, dan kickstand terintegrasi.",
    "basePrice": BigInt("34999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 9 185H (16 Cores, Intel AI Boost)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "2TB PCIe Gen4 NVMe SSD",
      "display": "Dual 14 3K (2880x1800) ASUS Lumina OLED 120Hz Touchscreens",
      "gpu": "Intel Arc Graphics",
      "battery": "75 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Dual 14-inch 3K OLED Panels",
      "Detachable Full-Size Bluetooth Keyboard",
      "Integrated Kickstand (Dual Screen Mode)",
      "ASUS Pen 2.0 Stylus Included"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935356/asus-zenbook-duo-ux8407-01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935342/asus-zenbook-duo-ux8407-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935352/asus-zenbook-duo-ux8407-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935356/asus-zenbook-duo-ux8407-01.jpg"
  },
  {
    "name": "ASUS ExpertBook P5 AI PC (P5405)",
    "brandName": "ASUS",
    "categoryName": "Business",
    "slug": "asus-expertbook-p5-g1",
    "motto": "Next-Era AI Workflows for Modern Enterprises",
    "badge": "Enterprise AI",
    "description": "Laptop bisnis AI bertenaga prosesor Intel Lunar Lake dengan NPU 47 TOPS, keamanan tingkat enterprise, dan bodi aluminium tangguh.",
    "basePrice": BigInt("24999000"),
    "stock": 9,
    "specs": {
      "processor": "Intel Core Ultra 7 258V (Lunar Lake, 47 TOPS NPU)",
      "ram": "32GB LPDDR5X (On-Package)",
      "storage": "1TB M.2 PCIe Gen4 NVMe SSD (Dual Slot)",
      "display": "14 2.5K (2560x1600) 144Hz 400 nits Anti-Glare",
      "gpu": "Intel Arc Graphics 140V",
      "battery": "63 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "ASUS AI ExpertMeet Virtual Assistant",
      "Dual SSD M.2 Slots",
      "ASUS AdaptiveLock Face Recognition",
      "All-Aluminum Durable Body"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-expertbook-p5-g1-01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935353/asus-expertbook-p5-g1-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935354/asus-expertbook-p5-g1-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935355/asus-expertbook-p5-g1-01.jpg"
  },
  {
    "name": "ASUS ExpertBook B9 OLED",
    "brandName": "ASUS",
    "categoryName": "Business",
    "slug": "asus-exportbook-ultra",
    "motto": "Featherlight 990g Executive Luxury",
    "badge": "Ultralight Pro",
    "description": "Laptop bisnis ultra-ringan di bawah 1 kg berbodi magnesium-lithium dengan layar 16:10 OLED dan daya tahan baterai seharian.",
    "basePrice": BigInt("27999000"),
    "stock": 7,
    "specs": {
      "processor": "Intel Core i7-1355U (10 Cores, vPro Platform)",
      "ram": "32GB LPDDR5 5200MHz",
      "storage": "1TB PCIe Gen4 SSD",
      "display": "14 2.8K (2880x1800) OLED 16:10 400 nits 100% DCI-P3",
      "gpu": "Intel Iris Xe Graphics",
      "battery": "63 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Sub-1kg Magnesium-Lithium Body (990g)",
      "ASUS NumberPad in Touchpad",
      "NFC Log-in & Fingerprint Reader",
      "Smart Card & TPM 2.0 Security"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935357/asus-exportbook-ultra-01.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935360/asus-exportbook-ultra-02.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935358/asus-exportbook-ultra-03.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935357/asus-exportbook-ultra-01.jpg"
  },
  {
    "name": "Samsung Galaxy Book4 Ultra",
    "brandName": "Samsung",
    "categoryName": "Creator",
    "slug": "samsung-galaxy-book4-ultra",
    "motto": "The Pinnacle of Galaxy Computing & 3K AMOLED",
    "badge": "Flagship Creator",
    "description": "Laptop flagship tertipis Samsung dengan layar 3K Dynamic AMOLED 2X, Core Ultra 9, RTX 4070, dan integrasi mulus ekosistem Galaxy.",
    "basePrice": BigInt("41999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 9 185H (16 Cores, up to 5.1 GHz)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "1TB PCIe Gen4 NVMe SSD (Dual Slot)",
      "display": "16 3K (2880x1800) Dynamic AMOLED 2X 120Hz Touch Anti-Reflective",
      "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "battery": "76 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("3500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Galaxy Connected Experience (Multi Control & Phone Link)",
      "Vision Booster with Anti-Reflective Glass",
      "AKG Quad Speakers with Dolby Atmos",
      "Super Fast Charging 140W USB-C"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935339/samsung-galaxy-book4-ultra_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935340/samsung-galaxy-book4-ultra_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935339/samsung-galaxy-book4-ultra_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935339/samsung-galaxy-book4-ultra_01.webp"
  },
  {
    "name": "Samsung Galaxy Book4 Edge",
    "brandName": "Samsung",
    "categoryName": "Ultrabook",
    "slug": "samsung-galaxy-book4-edge",
    "motto": "Next-Gen AI Mobility Powered by Snapdragon X Elite",
    "badge": "Copilot+ Flagship",
    "description": "Laptop Copilot+ super tipis dengan prosesor Snapdragon X Elite, NPU 45 TOPS, dan layar sentuh 3K AMOLED 120Hz.",
    "basePrice": BigInt("23499000"),
    "stock": 8,
    "specs": {
      "processor": "Qualcomm Snapdragon X Elite X1E-80-100 (12 Cores, up to 4.0 GHz)",
      "ram": "16GB LPDDR5X 8448MHz",
      "storage": "512GB eUFS / PCIe NVMe SSD",
      "display": "14 3K (2880x1800) Dynamic AMOLED 2X Touch 120Hz 120% DCI-P3",
      "gpu": "Qualcomm Adreno GPU (45 TOPS NPU)",
      "battery": "55.9 Wh Li-ion",
      "os": "Windows 11 Home on ARM"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Copilot+ AI Features (Cocreator, Live Captions)",
      "Dynamic AMOLED 2X Touchscreen",
      "Ultra-thin 10.9mm Titanium Gray Finish",
      "Secured-core PC by Samsung Knox"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935341/samsung_galaxy_book4_edge_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935341/samsung_galaxy_book4_edge_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935341/samsung_galaxy_book4_edge_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935341/samsung_galaxy_book4_edge_01.webp"
  },
  {
    "name": "Samsung Galaxy Book5 Pro 360",
    "brandName": "Samsung",
    "categoryName": "Ultrabook",
    "slug": "samsung-galaxy-book5-pro",
    "motto": "Lunar Lake AI Brilliance with S-Pen Flexibility",
    "badge": "New Lunar Lake",
    "description": "Convertible 360 derajat generasi terbaru bertenaga Intel Lunar Lake dengan grafis Intel Arc 140V dan S-Pen berpresisi tinggi.",
    "basePrice": BigInt("29999000"),
    "stock": 6,
    "specs": {
      "processor": "Intel Core Ultra 7 256V (Lunar Lake, 47 TOPS NPU)",
      "ram": "16GB LPDDR5X (On-Package)",
      "storage": "1TB PCIe Gen4 NVMe SSD",
      "display": "16 3K (2880x1800) Dynamic AMOLED 2X Touch x360 120Hz",
      "gpu": "Intel Arc Graphics 140V",
      "battery": "76 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("3000000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Bundled Galaxy S-Pen Included",
      "360 Hinge 2-in-1 Versatility",
      "Intel Core Ultra Series 2 Architecture",
      "Vision Booster Display Technology"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935338/samsung_galaxy_book5_pro_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935340/samsung_galaxy_book5_pro_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935336/samsung_galaxy_book5_pro_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935338/samsung_galaxy_book5_pro_01.webp"
  },
  {
    "name": "Samsung Notebook Odyssey Z",
    "brandName": "Samsung",
    "categoryName": "Gaming",
    "slug": "samsung-galaxy-odyssey-z",
    "motto": "Futuristic Precision Cooling & Center-Stage Keys",
    "badge": "Unique Gaming",
    "description": "Laptop gaming Samsung berdesain unik dengan pendingin Z-AeroFlow di atas dan layout keyboard di bawah untuk kenyamanan mengetik maksimal.",
    "basePrice": BigInt("18500000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core i7-8750H (6 Cores, 12 Threads, up to 4.1 GHz)",
      "ram": "16GB DDR4 2400MHz",
      "storage": "512GB NVMe PCIe SSD",
      "display": "15.6 FHD (1920x1080) 120Hz Anti-Glare G-Sync",
      "gpu": "NVIDIA GeForce GTX 1060 Max-P 6GB GDDR5",
      "battery": "54 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Z-AeroFlow Vapor Chamber Cooling",
      "Forward-Aligned Keyboard with Precision Touchpad",
      "Beast Mode Hotkey (Maximum Fans)",
      "Dragon Blade Brushed Aluminum Shell"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935337/samsung_galaxy_odyssey_z_01.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935338/samsung_galaxy_odyssey_z_02.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935339/samsung_galaxy_odyssey_z_03.webp",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935337/samsung_galaxy_odyssey_z_01.webp"
  },
  {
    "name": "Lenovo Legion Pro 5i Gen 9 (16IRX9)",
    "brandName": "Lenovo",
    "categoryName": "Gaming",
    "slug": "lenovo-legion-pro-5",
    "motto": "The King of Esports Performance & 240Hz PureSight",
    "badge": "Best Seller Gaming",
    "description": "Laptop gaming kompetitif nomor satu Lenovo dengan Intel Core i7-14700HX, RTX 4070 140W, dan layar WQXGA 240Hz 500 nits.",
    "basePrice": BigInt("28499000"),
    "stock": 10,
    "specs": {
      "processor": "Intel Core i7-14700HX (20 Cores, 28 Threads, up to 5.5 GHz)",
      "ram": "32GB DDR5 5600MHz",
      "storage": "1TB M.2 2280 PCIe 4.0 NVMe SSD",
      "display": "16 WQXGA (2560x1600) IPS 240Hz 500 nits 100% sRGB DisplayHDR 400",
      "gpu": "NVIDIA GeForce RTX 4070 8GB GDDR6 (140W Max TGP)",
      "battery": "80 Wh Li-ion with Super Rapid Charge Pro",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Legion Coldfront 5.0 Dual Fan System",
      "Lenovo AI Engine+ with LA1 AI Chip",
      "Legion TrueStrike 4-Zone RGB Keyboard",
      "X-Rite Pantone Color Calibration"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935332/lenovo_legion_pro_5_03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_legion_pro_5_01.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_legion_pro_5_02.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935332/lenovo_legion_pro_5_03.jpg"
  },
  {
    "name": "Lenovo LOQ 15AHP9",
    "brandName": "Lenovo",
    "categoryName": "Gaming",
    "slug": "lenovo-loq-15ahp9",
    "motto": "Next-Level Gaming Access with Ryzen AI",
    "badge": "Budget King",
    "description": "Laptop gaming terlaris untuk pemula dan mahasiswa dengan AMD Ryzen 5 generasi 8000 dan grafis NVIDIA RTX 4050 105W.",
    "basePrice": BigInt("13999000"),
    "stock": 16,
    "specs": {
      "processor": "AMD Ryzen 5 8645HS (6 Cores, 12 Threads, with Ryzen AI)",
      "ram": "16GB DDR5 5600MHz (Upgradeable)",
      "storage": "512GB M.2 2242 PCIe 4.0 NVMe SSD",
      "display": "15.6 FHD (1920x1080) IPS 144Hz 100% sRGB G-Sync",
      "gpu": "NVIDIA GeForce RTX 4050 6GB GDDR6 (105W TGP)",
      "battery": "60 Wh with Rapid Charge Pro",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "16GB / 512GB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("950000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Hyperchamber Cooling Design",
      "100% sRGB 144Hz Display",
      "Nahimic 3D Gaming Audio",
      "White Backlit Gaming Keyboard"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935337/lenovo_loq_15ahp9_04.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935336/lenovo_loq_15ahp9_03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935333/lenovo_loq_15ahp9_01.jpg",
        "isPrimary": false,
        "displayOrder": 3
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_loq_15ahp9_02.webp",
        "isPrimary": false,
        "displayOrder": 4
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935337/lenovo_loq_15ahp9_04.webp"
  },
  {
    "name": "Lenovo ThinkPad X1 Carbon Gen 12",
    "brandName": "Lenovo",
    "categoryName": "Business",
    "slug": "lenovo-thinkpad-x1-carbon-gen-12-3",
    "motto": "The Gold Standard of Executive Computing",
    "badge": "Business Benchmark",
    "description": "Laptop bisnis legendaris berbodi serat karbon ultra-ringan 1.09 kg dengan prosesor Intel Core Ultra dan layar 2.8K OLED 120Hz.",
    "basePrice": BigInt("36999000"),
    "stock": 6,
    "specs": {
      "processor": "Intel Core Ultra 7 155U (12 Cores, up to 4.8 GHz)",
      "ram": "32GB LPDDR5X 6400MHz",
      "storage": "1TB M.2 2280 PCIe 4.0 Performance SSD",
      "display": "14 2.8K (2880x1800) OLED 120Hz 400 nits Anti-Reflective 100% DCI-P3",
      "gpu": "Intel Graphics",
      "battery": "57 Wh Li-ion",
      "os": "Windows 11 Pro"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 2TB SSD",
        "type": "storage",
        "modifier": BigInt("3200000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Legendary Carbon Fiber Shell (1.09kg)",
      "Communications Bar with 8MP Computer Vision Webcam",
      "TrackPoint with Quick Menu Double-Tap",
      "Dual-Fan Thermal Architecture"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935336/lenovo_thinkpad_x1_carbon_gen_12_3_03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935332/lenovo_thinkpad_x1_carbon_gen_12_3_01.jpg",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935332/lenovo_thinkpad_x1_carbon_gen_12_3_02.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935336/lenovo_thinkpad_x1_carbon_gen_12_3_03.jpg"
  },
  {
    "name": "Lenovo Yoga 9i 2-in-1 Gen 9 / Aura Edition",
    "brandName": "Lenovo",
    "categoryName": "Ultrabook",
    "slug": "lenovo-yoga-9i-aura-edition-2in1",
    "motto": "Masterpiece in Motion, Rotating Soundbar Brilliance",
    "badge": "Audiophile Pick",
    "description": "Laptop convertible 2-in-1 dengan engsel soundbar berputar Bowers & Wilkins 360 derajat dan layar PureSight OLED 2.8K.",
    "basePrice": BigInt("32999000"),
    "stock": 5,
    "specs": {
      "processor": "Intel Core Ultra 7 155H (16 Cores, Intel AI Boost)",
      "ram": "32GB LPDDR5X 7467MHz",
      "storage": "1TB M.2 PCIe 4.0 NVMe SSD",
      "display": "14 2.8K (2880x1800) PureSight OLED Touch 120Hz DisplayHDR True Black 500",
      "gpu": "Intel Arc Graphics",
      "battery": "75 Wh Li-ion",
      "os": "Windows 11 Home"
    },
    "configs": [
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      }
    ],
    "features": [
      "Rotating Soundbar by Bowers & Wilkins",
      "Comfort Edge Ergonomic Curves",
      "Lenovo Slim Pen Included",
      "PureSight 2.8K 120Hz OLED"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935335/lenovo_yoga_9i_aura_edition_2in1_02.webp",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935334/lenovo_yoga_9i_aura_edition_2in1_03.webp",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_yoga_9i_aura_edition_2in1_01.jpg",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935335/lenovo_yoga_9i_aura_edition_2in1_02.webp"
  },
  {
    "name": "Lenovo Yoga Slim 7x Copilot+ PC",
    "brandName": "Lenovo",
    "categoryName": "Ultrabook",
    "slug": "lenovo-yoga-slim-7",
    "motto": "Ultra-Slim Snapdragon Power, Limitless Creativity",
    "badge": "Next-Gen AI",
    "description": "Laptop Copilot+ ramping 12.9 mm bertenaga Qualcomm Snapdragon X Elite dengan layar 3K OLED 1000 nits dan baterai berhari-hari.",
    "basePrice": BigInt("24499000"),
    "stock": 8,
    "specs": {
      "processor": "Qualcomm Snapdragon X Elite X1E-78-100 (12 Cores, 45 TOPS NPU)",
      "ram": "16GB LPDDR5X 8448MHz",
      "storage": "1TB M.2 2242 PCIe 4.0 NVMe SSD",
      "display": "14.5 3K (2944x1840) PureSight OLED Touch 90Hz 1000 nits Peak",
      "gpu": "Qualcomm Adreno GPU",
      "battery": "70 Wh Li-ion (Up to 23 Hours Local Video)",
      "os": "Windows 11 Home on ARM"
    },
    "configs": [
      {
        "name": "16GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("0"),
        "default": true,
        "order": 1
      },
      {
        "name": "32GB / 1TB SSD",
        "type": "storage",
        "modifier": BigInt("2500000"),
        "default": false,
        "order": 2
      }
    ],
    "features": [
      "Super-slim 12.9mm Magnesium-Aluminum Body",
      "3K 1000 nits PureSight OLED",
      "45 TOPS Qualcomm Hexagon NPU",
      "Premium Suite Four-Speaker Audio"
    ],
    "images": [
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935333/lenovo_yoga_slim_7_03.jpg",
        "isPrimary": true,
        "displayOrder": 1
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_yoga_slim_7_02.avif",
        "isPrimary": false,
        "displayOrder": 2
      },
      {
        "url": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935331/lenovo_yoga_slim_7_01.png",
        "isPrimary": false,
        "displayOrder": 3
      }
    ],
    "thumbnail": "https://res.cloudinary.com/hkafdmf7/image/upload/v1793935333/lenovo_yoga_slim_7_03.jpg"
  }
];

  const createdProducts = [];

  for (const p of products) {
    const brand = brandsMap[p.brandName.toLowerCase()] || brandsMap["asus"];
    const category = categoriesMap[p.categoryName] || categoriesMap["Ultrabook"];

    const created = await prisma.product.create({
      data: {
        name: p.name,
        brandId: brand.id,
        categoryId: category.id,
        slug: p.slug,
        motto: p.motto,
        badge: p.badge,
        description: p.description,
        basePrice: p.basePrice,
        stock: p.stock,
        specs: p.specs,
        imageUrl: p.thumbnail,
        isActive: true,
      },
    });

    // Product Configurations
    for (const cfg of p.configs) {
      await prisma.productConfig.create({
        data: {
          productId: created.id,
          configName: cfg.name,
          configType: cfg.type,
          priceModifier: cfg.modifier,
          isDefault: cfg.default,
          displayOrder: cfg.order,
        },
      });
    }

    // Product Images (Cloudinary Renders)
    await prisma.productImage.createMany({
      data: p.images.map((img: any) => ({
        productId: created.id,
        imageUrl: img.url,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder,
      })),
    });

    // Product Features
    for (let fi = 0; fi < p.features.length; fi++) {
      await prisma.productFeature.create({
        data: {
          productId: created.id,
          title: p.features[fi],
          description: p.features[fi] + " engineered for optimal user experience.",
          displayOrder: fi + 1,
        },
      });
    }

    createdProducts.push(created);
  }

  console.log(`Products seeded: ${createdProducts.length} with Cloudinary images, specs & configs!`);

  // 6. Seed Realistic Reviews
  const reviewsPool = [
    { rating: 5, comment: "Performa laptop ini luar biasa, layarnya sangat tajam dan responsif untuk pekerjaan berat!" },
    { rating: 5, comment: "Kualitas build premium, keyboard empuk, dan pendinginnya sangat hening saat gaming." },
    { rating: 4.5, comment: "Baterai awet banget, bisa tahan seharian kerja tanpa perlu bawa charger." },
    { rating: 4.5, comment: "Layar OLED-nya juara! Akurasi warnanya sangat membantu untuk color grading dan desain grafis." },
    { rating: 4, comment: "Sangat puas dengan pembelian ini, pengiriman cepat dan barang original resmi." },
    { rating: 4, comment: "Port konektivitas lengkap dan bobotnya cukup ringan untuk dibawa mobile." },
    { rating: 5, comment: "Suara speakernya jernih dan bass-nya nendang, nonton film dan denger musik sangat puas." },
  ];

  let reviewCount = 0;
  for (const customer of customers) {
    const numReviews = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
    for (let r = 0; r < numReviews && r < shuffled.length; r++) {
      const prod = shuffled[r];
      const rev = reviewsPool[Math.floor(Math.random() * reviewsPool.length)];
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: prod.id,
          rating: rev.rating,
          comment: rev.comment,
        },
      });
      reviewCount++;
    }
  }
  console.log(`Reviews seeded: ${reviewCount}`);

  // 7. Seed Sample Wishlists
  const wishlistItems = [];
  for (const customer of customers) {
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      wishlistItems.push({ userId: customer.id, productId: shuffled[i].id });
    }
  }
  await prisma.wishlist.createMany({ data: wishlistItems });
  console.log(`Wishlists seeded: ${wishlistItems.length}`);

  console.log("\n=======================================================");
  console.log(" WINDSTORE DATABASE SEEDED SUCCESSFULLY!");
  console.log(` Total Brands: ${brandDefs.length}`);
  console.log(` Total Categories: ${categoryNames.length}`);
  console.log(` Total Products: ${createdProducts.length}`);
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
