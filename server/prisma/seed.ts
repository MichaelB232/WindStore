import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const laptopImages = {
  gaming: [
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    "https://images.unsplash.com/photo-1484788984921-03950022c38b?w=800&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    "https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800&q=80",
  ],
  ultrabook: [
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
    "https://images.unsplash.com/photo-1560762484-813fc97650a0?w=800&q=80",
    "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
  ],
  creator: [
    "https://images.unsplash.com/photo-1526657782461-9fe13402a841?w=800&q=80",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  ],
  budget: [
    "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
    "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=800&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    "https://images.unsplash.com/photo-1471666875520-c75081f42081?w=800&q=80",
  ],
};

const getImage = (category: string, index: number) => {
  const imgs =
    laptopImages[category as keyof typeof laptopImages] ||
    laptopImages.business;
  return imgs[index % imgs.length];
};

const reviewComments = [
  "Absolutely love this laptop! Performance is top notch.",
  "Great build quality and very fast. Worth every penny.",
  "Battery life could be better but overall amazing machine.",
  "Perfect for my work. Runs everything smoothly.",
  "Stunning display and lightweight. My favorite laptop so far.",
  "Incredible gaming performance. No thermal throttling at all.",
  "The keyboard feels premium and typing is a joy.",
  "Boots up in seconds. Very responsive and snappy.",
  "Screen is gorgeous, colors are very accurate.",
  "Solid build, great specs for the price.",
  "Fan noise is minimal even under load. Impressive.",
  "Highly recommend for students and professionals alike.",
  "Best laptop I have owned. Worth the upgrade.",
  "Good performance but a bit heavy for travel.",
  "Excellent value for money. Would buy again.",
  "Smooth experience all around. Very happy with purchase.",
  "Great for video editing and 3D rendering.",
  "Runs all my games at ultra settings. Phenomenal.",
  "The trackpad is super smooth and accurate.",
  "Delivery was fast and packaging was excellent.",
];

async function main() {
  console.log("Seeding massive database...");

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
  console.log("Cleared existing data");

  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@windstore.com",
      passwordHash: adminPass,
      role: "admin",
    },
  });

  const customerData = [
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
    { username: "doni_firmansyah", email: "doni@gmail.com" },
    { username: "eka_wulandari", email: "eka@gmail.com" },
    { username: "yusuf_hakim", email: "yusuf@gmail.com" },
    { username: "nadia_permata", email: "nadia@gmail.com" },
    { username: "bagas_setiawan", email: "bagas@gmail.com" },
    { username: "putri_anggraini", email: "putri@gmail.com" },
    { username: "rendi_saputra", email: "rendi@gmail.com" },
    { username: "fitri_handayani", email: "fitri@gmail.com" },
    { username: "tommy_hidayat", email: "tommy@gmail.com" },
    { username: "vina_oktaviani", email: "vina@gmail.com" },
    { username: "gilang_ramadhan", email: "gilang@gmail.com" },
    { username: "ayu_lestari", email: "ayu@gmail.com" },
    { username: "ivan_kurniawan", email: "ivan@gmail.com" },
    { username: "sarah_amelia", email: "sarah@gmail.com" },
    { username: "dimas_ardianto", email: "dimas@gmail.com" },
    { username: "rini_susanti", email: "rini@gmail.com" },
    { username: "arif_rahman", email: "arif@gmail.com" },
    { username: "mega_wati", email: "mega@gmail.com" },
  ];

  const customers = await Promise.all(
    customerData.map((c) =>
      prisma.user.create({
        data: {
          username: c.username,
          email: c.email,
          passwordHash: userPass,
          role: "customer",
        },
      }),
    ),
  );
  console.log("Users seeded: " + (customers.length + 1));

  const [gaming, business, ultrabook, creator, budget] = await Promise.all([
    prisma.category.create({ data: { name: "Gaming" } }),
    prisma.category.create({ data: { name: "Business" } }),
    prisma.category.create({ data: { name: "Ultrabook" } }),
    prisma.category.create({ data: { name: "Creator" } }),
    prisma.category.create({ data: { name: "Budget" } }),
  ]);
  console.log("Categories seeded");

  const [asus, lenovo, dell, hp, msi, acer, apple, razer, samsung, lg] =
    await Promise.all([
      prisma.brand.create({
        data: {
          name: "ASUS",
          description:
            "Leading technology brand known for high-performance laptops",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Lenovo",
          description: "Global technology company producing innovative laptops",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Dell",
          description: "American technology company known for reliable laptops",
        },
      }),
      prisma.brand.create({
        data: {
          name: "HP",
          description:
            "Hewlett-Packard produces versatile laptops for every segment",
        },
      }),
      prisma.brand.create({
        data: {
          name: "MSI",
          description:
            "Micro-Star International specializes in gaming and creator laptops",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Acer",
          description:
            "Taiwanese brand offering budget-friendly to premium laptops",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Apple",
          description: "Premium MacBook lineup with Apple Silicon chips",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Razer",
          description: "Premium gaming laptops with sleek design",
        },
      }),
      prisma.brand.create({
        data: {
          name: "Samsung",
          description: "Korean tech giant with Galaxy Book lineup",
        },
      }),
      prisma.brand.create({
        data: {
          name: "LG",
          description: "LG Gram series known for ultra-lightweight design",
        },
      }),
    ]);
  console.log("Brands seeded");

  const allPaymentMethods = await Promise.all([
    prisma.paymentMethod.create({
      data: {
        code: "BCA_VA",
        name: "BCA Virtual Account",
        type: "virtual_account",
        isActive: true,
      },
    }),
    prisma.paymentMethod.create({
      data: {
        code: "BNI_VA",
        name: "BNI Virtual Account",
        type: "virtual_account",
        isActive: true,
      },
    }),
    prisma.paymentMethod.create({
      data: {
        code: "MANDIRI_VA",
        name: "Mandiri Virtual Account",
        type: "virtual_account",
        isActive: true,
      },
    }),
    prisma.paymentMethod.create({
      data: { code: "GOPAY", name: "GoPay", type: "ewallet", isActive: true },
    }),
    prisma.paymentMethod.create({
      data: { code: "OVO", name: "OVO", type: "ewallet", isActive: true },
    }),
    prisma.paymentMethod.create({
      data: { code: "DANA", name: "DANA", type: "ewallet", isActive: true },
    }),
    prisma.paymentMethod.create({
      data: { code: "QRIS", name: "QRIS", type: "qris", isActive: true },
    }),
    prisma.paymentMethod.create({
      data: {
        code: "COD",
        name: "Cash on Delivery",
        type: "cod",
        isActive: true,
      },
    }),
    prisma.paymentMethod.create({
      data: {
        code: "MIDTRANS",
        name: "Midtrans",
        type: "gateway",
        isActive: true,
      },
    }),
  ]);
  console.log("Payment methods seeded");

  const productsData = [
    {
      name: "ASUS ROG Strix G16",
      brand: asus,
      category: gaming,
      slug: "asus-rog-strix-g16",
      motto: "Dominate Every Game",
      badge: "Best Seller",
      description:
        "High performance gaming laptop with RTX 4070 and 165Hz display.",
      basePrice: 25000000n,
      stock: 15,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 FHD 165Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 4000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "ROG Intelligent Cooling",
        "MUX Switch",
        "PCIe 4.0 SSD",
        "165Hz Display",
      ],
    },
    {
      name: "ASUS ROG Zephyrus G14",
      brand: asus,
      category: gaming,
      slug: "asus-rog-zephyrus-g14",
      motto: "Compact Powerhouse",
      badge: "Popular",
      description: "Ultra-slim gaming laptop with AMD Ryzen 9 and RTX 4060.",
      basePrice: 23000000n,
      stock: 12,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 9 7940HS",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "14 QHD 165Hz",
        gpu: "NVIDIA RTX 4060 8GB",
        battery: "76Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 2500000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "AniMe Matrix Display",
        "Whisper Mode",
        "Dolby Atmos",
        "MUX Switch",
      ],
    },
    {
      name: "ASUS ROG Flow X16",
      brand: asus,
      category: gaming,
      slug: "asus-rog-flow-x16",
      motto: "Play Without Limits",
      badge: "New",
      description: "2-in-1 gaming laptop with 360-degree hinge.",
      basePrice: 28000000n,
      stock: 8,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 9 7940HX",
        ram: "32GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 QHD+ 240Hz Touch",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: ["360 Hinge", "XG Mobile Port", "Touch Display", "ROG Nebula"],
    },
    {
      name: "ASUS TUF Gaming F15",
      brand: asus,
      category: gaming,
      slug: "asus-tuf-gaming-f15",
      motto: "Built Tough",
      badge: "Value Pick",
      description: "Military-grade durability meets gaming performance.",
      basePrice: 14000000n,
      stock: 25,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i7-12700H",
        ram: "16GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD 144Hz",
        gpu: "NVIDIA RTX 3060 6GB",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "MIL-STD-810H",
        "144Hz Display",
        "Thermal Grizzly",
        "Self-cleaning fans",
      ],
    },
    {
      name: "ASUS VivoBook Pro 16X",
      brand: asus,
      category: creator,
      slug: "asus-vivobook-pro-16x",
      motto: "Create Without Compromise",
      badge: "Creator Pick",
      description: "OLED display with professional color accuracy.",
      basePrice: 20000000n,
      stock: 10,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13900H",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 4K OLED",
        gpu: "NVIDIA RTX 4060 8GB",
        battery: "96Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 3500000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "4K OLED",
        "PANTONE Validated",
        "AI Noise Canceling",
        "Thunderbolt 4",
      ],
    },
    {
      name: "ASUS ZenBook 14 OLED",
      brand: asus,
      category: ultrabook,
      slug: "asus-zenbook-14-oled",
      motto: "Portability Perfected",
      badge: "Slim Pick",
      description: "Ultra-thin ZenBook with OLED display and all-day battery.",
      basePrice: 16000000n,
      stock: 18,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-1360P",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "14 2.8K OLED 90Hz",
        gpu: "Intel Iris Xe",
        battery: "75Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1500000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "2.8K OLED 90Hz",
        "ErgoSense KB",
        "AI Noise Canceling",
        "0.75kg",
      ],
    },
    {
      name: "ASUS ExpertBook B9",
      brand: asus,
      category: business,
      slug: "asus-expertbook-b9",
      motto: "Business Without Boundaries",
      badge: "Ultra Light",
      description: "Worlds lightest business laptop at 880g.",
      basePrice: 24000000n,
      stock: 7,
      imgKey: "business",
      specs: {
        processor: "Intel Core i7-1355U",
        ram: "16GB LPDDR5",
        storage: "1TB NVMe SSD",
        display: "14 FHD IPS",
        gpu: "Intel Iris Xe",
        battery: "63Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "880g Weight",
        "MIL-STD-810H",
        "Thunderbolt 4 x2",
        "NumberPad",
      ],
    },
    {
      name: "ASUS ProArt Studiobook 16",
      brand: asus,
      category: creator,
      slug: "asus-proart-studiobook-16",
      motto: "Art Meets Science",
      badge: "Artist Pick",
      description: "Professional creator laptop with OLED and dial knob.",
      basePrice: 33000000n,
      stock: 5,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "16 4K OLED 120Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "96Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "ProArt OLED 4K",
        "ASUS Dial",
        "PANTONE Validated",
        "Thunderbolt 4",
      ],
    },
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      brand: lenovo,
      category: business,
      slug: "lenovo-thinkpad-x1-carbon-gen11",
      motto: "Built for Business",
      badge: "Premium",
      description:
        "Ultra-lightweight business laptop with military-grade durability.",
      basePrice: 22000000n,
      stock: 10,
      imgKey: "business",
      specs: {
        processor: "Intel Core i7-1365U",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "14 WUXGA IPS",
        gpu: "Intel Iris Xe",
        battery: "57Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["MIL-SPEC", "TrackPoint", "Dolby Voice", "4G LTE Ready"],
    },
    {
      name: "Lenovo Legion 5 Pro",
      brand: lenovo,
      category: gaming,
      slug: "lenovo-legion-5-pro",
      motto: "Engineered for Victory",
      badge: "Top Rated",
      description: "16-inch gaming beast with AMD Ryzen 7 and RTX 4070.",
      basePrice: 21000000n,
      stock: 14,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 7 7745HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 QHD 165Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "80Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 2000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "Legion Coldfront 5.0",
        "Nahimic Audio",
        "165Hz QHD",
        "USB-C 140W",
      ],
    },
    {
      name: "Lenovo IdeaPad 5 Pro",
      brand: lenovo,
      category: ultrabook,
      slug: "lenovo-ideapad-5-pro",
      motto: "Smart Everyday Computing",
      badge: "Popular",
      description: "Stylish ultrabook with 2.5K display.",
      basePrice: 13000000n,
      stock: 20,
      imgKey: "ultrabook",
      specs: {
        processor: "AMD Ryzen 7 6800H",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "16 2.5K IPS 120Hz",
        gpu: "AMD Radeon 680M",
        battery: "75Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["2.5K 120Hz", "Harman Speakers", "Rapid Charge", "Backlit KB"],
    },
    {
      name: "Lenovo ThinkBook 14 Gen 5",
      brand: lenovo,
      category: business,
      slug: "lenovo-thinkbook-14-gen5",
      motto: "Work Smarter",
      badge: "Business Pick",
      description: "Modern business laptop with Intel Core Ultra.",
      basePrice: 15000000n,
      stock: 16,
      imgKey: "business",
      specs: {
        processor: "Intel Core Ultra 5 125H",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "14 FHD IPS",
        gpu: "Intel Arc Graphics",
        battery: "60Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 2500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Intel AI Boost", "FHD Webcam", "Rapid Charge", "Smart Power"],
    },
    {
      name: "Lenovo Yoga 9i Gen 8",
      brand: lenovo,
      category: ultrabook,
      slug: "lenovo-yoga-9i-gen8",
      motto: "Flex Your Creativity",
      badge: "Flagship",
      description: "Premium 2-in-1 convertible with OLED display.",
      basePrice: 24000000n,
      stock: 7,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i7-1360P",
        ram: "16GB LPDDR5x",
        storage: "1TB NVMe SSD",
        display: "14 2.8K OLED Touch",
        gpu: "Intel Iris Xe",
        battery: "75Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "360 Convertible",
        "OLED Touch",
        "Lenovo AI Core",
        "Bowers & Wilkins",
      ],
    },
    {
      name: "Lenovo Legion Slim 5",
      brand: lenovo,
      category: gaming,
      slug: "lenovo-legion-slim-5",
      motto: "Slim Powerful Unstoppable",
      badge: "New",
      description: "Thin and light gaming laptop.",
      basePrice: 18000000n,
      stock: 11,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 7 7745HX",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "16 FHD 165Hz",
        gpu: "NVIDIA RTX 4060 8GB",
        battery: "80Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Slim 19.9mm", "Legion AI Engine", "Smart Fan", "USB-C 140W"],
    },
    {
      name: "Lenovo IdeaPad Gaming 3",
      brand: lenovo,
      category: gaming,
      slug: "lenovo-ideapad-gaming-3",
      motto: "Game Ready",
      badge: "Entry Level",
      description: "Budget gaming laptop for students.",
      basePrice: 10500000n,
      stock: 18,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 5 6600H",
        ram: "8GB DDR5",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD 120Hz",
        gpu: "NVIDIA RTX 3050 4GB",
        battery: "45Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 700000n,
          default: false,
          order: 2,
        },
      ],
      features: ["120Hz Display", "Rapid Charge", "Wi-Fi 6", "Backlit KB"],
    },
    {
      name: "Lenovo ThinkPad E14 Gen 5",
      brand: lenovo,
      category: budget,
      slug: "lenovo-thinkpad-e14-gen5",
      motto: "Reliable Everyday",
      badge: "Entry Business",
      description: "Entry-level business ThinkPad.",
      basePrice: 9000000n,
      stock: 25,
      imgKey: "business",
      specs: {
        processor: "AMD Ryzen 5 7530U",
        ram: "8GB DDR4",
        storage: "256GB NVMe SSD",
        display: "14 FHD IPS",
        gpu: "AMD Radeon",
        battery: "57Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 1000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "ThinkPad KB",
        "Rapid Charge",
        "Wi-Fi 6",
        "Fingerprint Reader",
      ],
    },
    {
      name: "Dell XPS 15 9530",
      brand: dell,
      category: ultrabook,
      slug: "dell-xps-15-9530",
      motto: "Power Meets Elegance",
      badge: "Flagship",
      description: "Premium ultrabook with OLED display.",
      basePrice: 28000000n,
      stock: 8,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-13700H",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "15.6 3.5K OLED Touch",
        gpu: "NVIDIA RTX 4060 8GB",
        battery: "86Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 4000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "3.5K OLED Touch",
        "Thunderbolt 4",
        "Killer WiFi 6E",
        "CNC Aluminum",
      ],
    },
    {
      name: "Dell Alienware m18",
      brand: dell,
      category: gaming,
      slug: "dell-alienware-m18",
      motto: "The Ultimate Gaming Beast",
      badge: "Extreme",
      description: "18-inch desktop replacement gaming laptop.",
      basePrice: 45000000n,
      stock: 5,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "18 QHD+ 480Hz",
        gpu: "NVIDIA RTX 4090 16GB",
        battery: "97Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "64GB / 4TB",
          type: "storage",
          modifier: 8000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Cherry MX KB", "480Hz Display", "RTX 4090", "Quad Fan"],
    },
    {
      name: "Dell Inspiron 15 3520",
      brand: dell,
      category: budget,
      slug: "dell-inspiron-15-3520",
      motto: "Everyday Excellence",
      badge: "Best Value",
      description: "Reliable everyday laptop for students.",
      basePrice: 8000000n,
      stock: 30,
      imgKey: "budget",
      specs: {
        processor: "Intel Core i5-1235U",
        ram: "8GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD IPS",
        gpu: "Intel Iris Xe",
        battery: "54Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 1000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["FHD Webcam", "Narrow Border", "ExpressCharge", "WiFi 6"],
    },
    {
      name: "Dell Latitude 5540",
      brand: dell,
      category: business,
      slug: "dell-latitude-5540",
      motto: "Enterprise Ready",
      badge: "Business",
      description: "Enterprise-grade business laptop with vPro.",
      basePrice: 19000000n,
      stock: 9,
      imgKey: "business",
      specs: {
        processor: "Intel Core i7-1365U vPro",
        ram: "16GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD IPS",
        gpu: "Intel Iris Xe",
        battery: "65Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Intel vPro", "TPM 2.0", "IR Webcam", "SafeScreen"],
    },
    {
      name: "Dell XPS 13 Plus",
      brand: dell,
      category: ultrabook,
      slug: "dell-xps-13-plus",
      motto: "Minimalist Powerhouse",
      badge: "Premium",
      description: "Futuristic design with invisible touchpad.",
      basePrice: 22000000n,
      stock: 6,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-1360P",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "13.4 2.8K OLED Touch",
        gpu: "Intel Iris Xe",
        battery: "55Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3500000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "Invisible Touchpad",
        "Haptic Function Row",
        "OLED Touch",
        "Thunderbolt 4 x2",
      ],
    },
    {
      name: "Dell G15 Gaming",
      brand: dell,
      category: gaming,
      slug: "dell-g15-gaming",
      motto: "Level Up",
      badge: "Value Gaming",
      description: "Solid mid-range gaming laptop with RTX 3060.",
      basePrice: 14000000n,
      stock: 14,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 7 6800H",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD 165Hz",
        gpu: "NVIDIA RTX 3060 6GB",
        battery: "56Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["165Hz FHD", "Command Center", "HDMI 2.1", "USB-C 130W"],
    },
    {
      name: "Dell Precision 5680",
      brand: dell,
      category: creator,
      slug: "dell-precision-5680",
      motto: "Precision Performance",
      badge: "Workstation",
      description: "Mobile workstation with RTX Ada.",
      basePrice: 38000000n,
      stock: 4,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13900H",
        ram: "32GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 3.5K OLED Touch",
        gpu: "NVIDIA RTX 3500 Ada 12GB",
        battery: "86Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "64GB / 2TB",
          type: "storage",
          modifier: 8000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["ISV Certified", "RTX Ada", "3.5K OLED", "Thunderbolt 4"],
    },
    {
      name: "HP Spectre x360 14",
      brand: hp,
      category: ultrabook,
      slug: "hp-spectre-x360-14",
      motto: "Spectacularly Versatile",
      badge: "Award Winner",
      description: "Premium 2-in-1 with OLED and Intel Evo.",
      basePrice: 21000000n,
      stock: 9,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-1355U",
        ram: "16GB LPDDR5",
        storage: "1TB NVMe SSD",
        display: "13.5 3K2K OLED Touch",
        gpu: "Intel Iris Xe",
        battery: "66Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: ["Intel Evo", "3K2K OLED", "Tilt Pen", "Bang & Olufsen"],
    },
    {
      name: "HP OMEN 16",
      brand: hp,
      category: gaming,
      slug: "hp-omen-16",
      motto: "Game On Level Up",
      badge: "Popular",
      description: "Powerful gaming laptop with RTX 4070.",
      basePrice: 20000000n,
      stock: 13,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 7 7745HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16.1 QHD 165Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "83Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 2000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "OMEN Tempest Cooling",
        "OMEN Gaming Hub",
        "MUX Switch",
        "165Hz QHD",
      ],
    },
    {
      name: "HP EliteBook 840 G10",
      brand: hp,
      category: business,
      slug: "hp-elitebook-840-g10",
      motto: "Elite Performance",
      badge: "Enterprise",
      description: "Business flagship with AI security.",
      basePrice: 20000000n,
      stock: 8,
      imgKey: "business",
      specs: {
        processor: "Intel Core i7-1365U",
        ram: "16GB DDR5",
        storage: "512GB NVMe SSD",
        display: "14 WUXGA IPS",
        gpu: "Intel Iris Xe",
        battery: "51Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "HP Wolf Security",
        "Sure View",
        "AI Noise Reduction",
        "Fast Charge",
      ],
    },
    {
      name: "HP Pavilion 15",
      brand: hp,
      category: budget,
      slug: "hp-pavilion-15",
      motto: "Smart Value",
      badge: "Budget Pick",
      description: "Affordable everyday laptop for students.",
      basePrice: 9000000n,
      stock: 28,
      imgKey: "budget",
      specs: {
        processor: "AMD Ryzen 5 7530U",
        ram: "8GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD IPS",
        gpu: "AMD Radeon",
        battery: "43Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 800000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "Micro-edge Display",
        "Fast Charge",
        "Dual Speakers",
        "QuickDrop",
      ],
    },
    {
      name: "HP ZBook Fury 16 G10",
      brand: hp,
      category: creator,
      slug: "hp-zbook-fury-16-g10",
      motto: "Workstation Power",
      badge: "Professional",
      description: "Mobile workstation with RTX 4000 Ada.",
      basePrice: 35000000n,
      stock: 4,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13950HX",
        ram: "32GB DDR5 ECC",
        storage: "1TB NVMe SSD",
        display: "16 4K DreamColor",
        gpu: "NVIDIA RTX 4000 Ada 8GB",
        battery: "96Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "64GB / 2TB",
          type: "storage",
          modifier: 7000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "DreamColor Display",
        "ECC Memory",
        "ZTurbo SSD",
        "ISV Certified",
      ],
    },
    {
      name: "HP Victus 15",
      brand: hp,
      category: gaming,
      slug: "hp-victus-15",
      motto: "Victory Starts Here",
      badge: "Entry Gaming",
      description: "Affordable gaming laptop for beginners.",
      basePrice: 9500000n,
      stock: 22,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 5 5600H",
        ram: "8GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD IPS 144Hz",
        gpu: "NVIDIA GTX 1650 4GB",
        battery: "52.5Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 700000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "144Hz Display",
        "OMEN Gaming Hub",
        "Dual Speakers",
        "Fast Charge",
      ],
    },
    {
      name: "HP Dragonfly G4",
      brand: hp,
      category: business,
      slug: "hp-dragonfly-g4",
      motto: "Fly Above the Rest",
      badge: "Premium Business",
      description: "Ultra-premium business with 5G.",
      basePrice: 29000000n,
      stock: 5,
      imgKey: "business",
      specs: {
        processor: "Intel Core i7-1365U vPro",
        ram: "32GB LPDDR5",
        storage: "1TB NVMe SSD",
        display: "13.5 3K2K OLED Touch",
        gpu: "Intel Iris Xe",
        battery: "68Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "5G Ready",
        "OLED Touch",
        "HP Wolf Security",
        "Bang & Olufsen",
      ],
    },
    {
      name: "MSI Titan GT77 HX",
      brand: msi,
      category: gaming,
      slug: "msi-titan-gt77-hx",
      motto: "Titan of Gaming",
      badge: "Extreme",
      description: "Desktop replacement with RTX 4090.",
      basePrice: 48000000n,
      stock: 4,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "64GB DDR5",
        storage: "4TB NVMe SSD",
        display: "17.3 UHD 144Hz",
        gpu: "NVIDIA RTX 4090 16GB",
        battery: "99.9Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "64GB / 4TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "Cherry MX KB",
        "RTX 4090",
        "Per-Key RGB",
        "Cooler Boost Titan",
      ],
    },
    {
      name: "MSI Stealth 16 Studio",
      brand: msi,
      category: creator,
      slug: "msi-stealth-16-studio",
      motto: "Create Without Limits",
      badge: "Creator",
      description: "Creator laptop with Mini LED and RTX 4070.",
      basePrice: 30000000n,
      stock: 6,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13900H",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "16 4K Mini LED 144Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "99.9Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "Mini LED 4K",
        "True Pixel",
        "Cooler Boost 5",
        "Thunderbolt 4",
      ],
    },
    {
      name: "MSI GF63 Thin",
      brand: msi,
      category: gaming,
      slug: "msi-gf63-thin",
      motto: "Game Anywhere",
      badge: "Budget Gaming",
      description: "Thin affordable gaming laptop.",
      basePrice: 10000000n,
      stock: 22,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i5-11400H",
        ram: "8GB DDR4",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD 144Hz",
        gpu: "NVIDIA GTX 1650 4GB",
        battery: "51Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 800000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "144Hz Display",
        "Cooler Boost 5",
        "SteelSeries KB",
        "Nahimic 3",
      ],
    },
    {
      name: "MSI Prestige 14 EVO",
      brand: msi,
      category: ultrabook,
      slug: "msi-prestige-14-evo",
      motto: "Business at Its Best",
      badge: "Premium Slim",
      description: "Ultra-thin business laptop with Intel Evo.",
      basePrice: 17000000n,
      stock: 10,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-1360P",
        ram: "16GB LPDDR5",
        storage: "1TB NVMe SSD",
        display: "14 2.8K OLED 90Hz",
        gpu: "Intel Iris Xe",
        battery: "72Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: ["2.8K OLED", "Intel Evo", "Thunderbolt 4", "2MP IR Webcam"],
    },
    {
      name: "MSI Raider GE78 HX",
      brand: msi,
      category: gaming,
      slug: "msi-raider-ge78-hx",
      motto: "Raid the Competition",
      badge: "Top Gaming",
      description: "High-end gaming with RTX 4080.",
      basePrice: 38000000n,
      stock: 5,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-13980HX",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "17 QHD+ 240Hz",
        gpu: "NVIDIA RTX 4080 12GB",
        battery: "99.9Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "64GB / 4TB",
          type: "storage",
          modifier: 6000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "240Hz QHD+",
        "Cooler Boost Trinity+",
        "Per-Key RGB",
        "RTX 4080",
      ],
    },
    {
      name: "MSI Modern 14",
      brand: msi,
      category: budget,
      slug: "msi-modern-14",
      motto: "Modern Meets Affordable",
      badge: "Slim Budget",
      description: "Slim modern laptop for everyday tasks.",
      basePrice: 8500000n,
      stock: 20,
      imgKey: "budget",
      specs: {
        processor: "AMD Ryzen 5 7530U",
        ram: "8GB DDR4",
        storage: "512GB NVMe SSD",
        display: "14 FHD IPS",
        gpu: "AMD Radeon",
        battery: "50Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 700000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Slim 1.4kg", "IPS Display", "USB Type-C", "Backlit KB"],
    },
    {
      name: "Acer Predator Helios 16",
      brand: acer,
      category: gaming,
      slug: "acer-predator-helios-16",
      motto: "Predator by Nature",
      badge: "Gaming Beast",
      description: "Advanced cooling with RTX 4080.",
      basePrice: 32000000n,
      stock: 7,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-13900HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "16 WQXGA 250Hz",
        gpu: "NVIDIA RTX 4080 12GB",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 4000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "250Hz Display",
        "AeroBlade Fan",
        "MUX Switch",
        "LiquidMetal Thermal",
      ],
    },
    {
      name: "Acer Swift X 14",
      brand: acer,
      category: creator,
      slug: "acer-swift-x-14",
      motto: "Creative Performance",
      badge: "Creator Value",
      description: "Creator laptop with OLED and RTX 4050.",
      basePrice: 15000000n,
      stock: 16,
      imgKey: "creator",
      specs: {
        processor: "AMD Ryzen 7 7840U",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "14.5 2.8K OLED 120Hz",
        gpu: "NVIDIA RTX 4050 6GB",
        battery: "72Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1200000n,
          default: false,
          order: 2,
        },
      ],
      features: ["OLED 2.8K", "DCI-P3 100%", "Thunderbolt 4", "Wi-Fi 6E"],
    },
    {
      name: "Acer Aspire 5",
      brand: acer,
      category: budget,
      slug: "acer-aspire-5",
      motto: "Smart Performance",
      badge: "Student Pick",
      description: "Reliable affordable student laptop.",
      basePrice: 7500000n,
      stock: 35,
      imgKey: "budget",
      specs: {
        processor: "AMD Ryzen 5 7530U",
        ram: "8GB DDR4",
        storage: "256GB NVMe SSD",
        display: "15.6 FHD IPS",
        gpu: "AMD Radeon",
        battery: "56.5Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 600000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "Anti-Glare Display",
        "Fingerprint Reader",
        "Wi-Fi 6",
        "USB Type-C",
      ],
    },
    {
      name: "Acer Nitro 5",
      brand: acer,
      category: gaming,
      slug: "acer-nitro-5",
      motto: "Unleash the Gamer",
      badge: "Budget Gaming",
      description: "Entry gaming with RTX 3050.",
      basePrice: 11000000n,
      stock: 20,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 5 7535H",
        ram: "8GB DDR5",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD 144Hz",
        gpu: "NVIDIA RTX 3050 6GB",
        battery: "57.5Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 800000n,
          default: false,
          order: 2,
        },
      ],
      features: ["NitroSense Cooling", "144Hz IPS", "HDMI 2.1", "USB4"],
    },
    {
      name: "Acer ConceptD 7 Pro",
      brand: acer,
      category: creator,
      slug: "acer-conceptd-7-pro",
      motto: "Concept to Creation",
      badge: "Pro Creator",
      description: "Professional creator with 4K PANTONE display.",
      basePrice: 35000000n,
      stock: 4,
      imgKey: "creator",
      specs: {
        processor: "Intel Core i9-13900H",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "16 4K IPS 120Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "99Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "PANTONE Validated",
        "4K 120Hz",
        "SpatialLabs 3D",
        "Thunderbolt 4",
      ],
    },
    {
      name: "Acer Swift Go 14",
      brand: acer,
      category: ultrabook,
      slug: "acer-swift-go-14",
      motto: "Go Farther",
      badge: "Slim Value",
      description: "Affordable ultrabook with Intel Core Ultra.",
      basePrice: 13000000n,
      stock: 15,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core Ultra 5 125H",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "14 2.8K OLED 90Hz",
        gpu: "Intel Arc Graphics",
        battery: "65Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1200000n,
          default: false,
          order: 2,
        },
      ],
      features: ["OLED 2.8K", "Intel Evo", "Thunderbolt 4", "1.25kg"],
    },
    {
      name: "Acer Chromebook Spin 714",
      brand: acer,
      category: budget,
      slug: "acer-chromebook-spin-714",
      motto: "Simple and Smart",
      badge: "Chrome",
      description: "Chromebook for education.",
      basePrice: 6000000n,
      stock: 25,
      imgKey: "budget",
      specs: {
        processor: "Intel Core i5-1335U",
        ram: "8GB LPDDR4x",
        storage: "256GB eMMC",
        display: "14 WUXGA IPS Touch",
        gpu: "Intel Iris Xe",
        battery: "65Wh",
        os: "ChromeOS",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: ["ChromeOS", "360 Convertible", "USI Pen", "MIL-SPEC"],
    },
    {
      name: "Apple MacBook Pro 16 M3 Pro",
      brand: apple,
      category: creator,
      slug: "apple-macbook-pro-16-m3-pro",
      motto: "Insanely Great",
      badge: "Apple Pick",
      description: "Most powerful MacBook with M3 Pro.",
      basePrice: 35000000n,
      stock: 10,
      imgKey: "creator",
      specs: {
        processor: "Apple M3 Pro 12-core",
        ram: "18GB Unified",
        storage: "512GB SSD",
        display: "16.2 Liquid Retina XDR",
        gpu: "18-core GPU",
        battery: "100Wh",
        os: "macOS Sonoma",
      },
      configs: [
        {
          name: "18GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "18GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
        {
          name: "36GB / 1TB",
          type: "storage",
          modifier: 7000000n,
          default: false,
          order: 3,
        },
      ],
      features: [
        "M3 Pro Chip",
        "Liquid Retina XDR",
        "22hr Battery",
        "MagSafe 3",
      ],
    },
    {
      name: "Apple MacBook Air 15 M3",
      brand: apple,
      category: ultrabook,
      slug: "apple-macbook-air-15-m3",
      motto: "Strikingly Thin",
      badge: "Best Seller",
      description: "M3 chip with 15-inch Retina display.",
      basePrice: 22000000n,
      stock: 15,
      imgKey: "ultrabook",
      specs: {
        processor: "Apple M3 8-core",
        ram: "8GB Unified",
        storage: "256GB SSD",
        display: "15.3 Liquid Retina",
        gpu: "10-core GPU",
        battery: "66.5Wh",
        os: "macOS Sonoma",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 2500000n,
          default: false,
          order: 2,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 4500000n,
          default: false,
          order: 3,
        },
      ],
      features: ["M3 Fanless", "18hr Battery", "Liquid Retina", "MagSafe 3"],
    },
    {
      name: "Apple MacBook Pro 14 M3 Max",
      brand: apple,
      category: creator,
      slug: "apple-macbook-pro-14-m3-max",
      motto: "Max Performance",
      badge: "Pro Max",
      description: "Extreme performance with M3 Max.",
      basePrice: 45000000n,
      stock: 6,
      imgKey: "creator",
      specs: {
        processor: "Apple M3 Max 16-core",
        ram: "36GB Unified",
        storage: "1TB SSD",
        display: "14.2 Liquid Retina XDR",
        gpu: "40-core GPU",
        battery: "70Wh",
        os: "macOS Sonoma",
      },
      configs: [
        {
          name: "36GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "64GB / 1TB",
          type: "storage",
          modifier: 6000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["M3 Max Chip", "ProRes", "HDMI 2.1", "SD Card Slot"],
    },
    {
      name: "Apple MacBook Air 13 M2",
      brand: apple,
      category: ultrabook,
      slug: "apple-macbook-air-13-m2",
      motto: "Redesigned Around M2",
      badge: "Popular",
      description: "Redesigned MacBook Air with M2.",
      basePrice: 18000000n,
      stock: 20,
      imgKey: "ultrabook",
      specs: {
        processor: "Apple M2 8-core",
        ram: "8GB Unified",
        storage: "256GB SSD",
        display: "13.6 Liquid Retina",
        gpu: "8-core GPU",
        battery: "52.6Wh",
        os: "macOS Sonoma",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "8GB / 512GB",
          type: "storage",
          modifier: 2000000n,
          default: false,
          order: 2,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 4000000n,
          default: false,
          order: 3,
        },
      ],
      features: ["M2 Chip", "18hr Battery", "Liquid Retina", "1080p FaceTime"],
    },
    {
      name: "Razer Blade 16 2024",
      brand: razer,
      category: gaming,
      slug: "razer-blade-16-2024",
      motto: "For Those Who Demand the Best",
      badge: "Premium Gaming",
      description: "Ultra-premium gaming with Dual Mode Mini LED.",
      basePrice: 52000000n,
      stock: 4,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i9-14900HX",
        ram: "32GB DDR5",
        storage: "2TB NVMe SSD",
        display: "16 Dual Mode 240Hz",
        gpu: "NVIDIA RTX 4090 16GB",
        battery: "95.2Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "Dual Mode Mini LED",
        "RTX 4090",
        "Vapor Chamber",
        "Razer Chroma",
      ],
    },
    {
      name: "Razer Blade 15",
      brand: razer,
      category: gaming,
      slug: "razer-blade-15",
      motto: "Most Powerful 15",
      badge: "Icon",
      description: "Iconic thin-bezel gaming laptop.",
      basePrice: 32000000n,
      stock: 7,
      imgKey: "gaming",
      specs: {
        processor: "Intel Core i7-13800H",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "15.6 QHD 240Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "80Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "CNC Aluminum",
        "Chroma RGB",
        "Thunderbolt 4",
        "Windows Hello",
      ],
    },
    {
      name: "Razer Blade 14",
      brand: razer,
      category: gaming,
      slug: "razer-blade-14",
      motto: "Small but Mighty",
      badge: "Compact Gaming",
      description: "Compact powerhouse with AMD Ryzen 9.",
      basePrice: 28000000n,
      stock: 6,
      imgKey: "gaming",
      specs: {
        processor: "AMD Ryzen 9 7945HX",
        ram: "16GB DDR5",
        storage: "1TB NVMe SSD",
        display: "14 QHD+ 165Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "61.6Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 2500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["QHD+ 165Hz", "Vapor Chamber", "Chroma RGB", "Compact 1.96kg"],
    },
    {
      name: "Razer Book 13",
      brand: razer,
      category: ultrabook,
      slug: "razer-book-13",
      motto: "Productivity Perfected",
      badge: "Premium Slim",
      description: "Ultra-premium productivity with OLED touch.",
      basePrice: 25000000n,
      stock: 5,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core i7-1165G7",
        ram: "16GB LPDDR4x",
        storage: "512GB NVMe SSD",
        display: "13.4 UHD+ OLED Touch",
        gpu: "Intel Iris Xe",
        battery: "55.1Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "OLED Touch",
        "THX Spatial Audio",
        "Thunderbolt 4",
        "SD Card Reader",
      ],
    },
    {
      name: "Samsung Galaxy Book4 Pro 16",
      brand: samsung,
      category: ultrabook,
      slug: "samsung-galaxy-book4-pro-16",
      motto: "Intelligence Meets Elegance",
      badge: "Galaxy",
      description: "Premium ultrabook with Dynamic AMOLED 2X.",
      basePrice: 23000000n,
      stock: 9,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core Ultra 7 155H",
        ram: "16GB LPDDR5x",
        storage: "512GB NVMe SSD",
        display: "16 Dynamic AMOLED 2X 120Hz",
        gpu: "Intel Arc Graphics",
        battery: "76Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 2000000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Dynamic AMOLED 2X", "Galaxy AI", "Multi Control", "1.55kg"],
    },
    {
      name: "Samsung Galaxy Book4 360",
      brand: samsung,
      category: ultrabook,
      slug: "samsung-galaxy-book4-360",
      motto: "360 of Possibilities",
      badge: "2-in-1",
      description: "Versatile 2-in-1 with S Pen.",
      basePrice: 19000000n,
      stock: 8,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core Ultra 5 125H",
        ram: "16GB LPDDR5x",
        storage: "512GB NVMe SSD",
        display: "15.6 FHD AMOLED Touch",
        gpu: "Intel Arc Graphics",
        battery: "68Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: [
        "S Pen Included",
        "360 Convertible",
        "AMOLED Touch",
        "Galaxy Link",
      ],
    },
    {
      name: "Samsung Galaxy Book4 Ultra",
      brand: samsung,
      category: creator,
      slug: "samsung-galaxy-book4-ultra",
      motto: "Ultra by Every Standard",
      badge: "Flagship",
      description: "Creator powerhouse with RTX 4070.",
      basePrice: 32000000n,
      stock: 5,
      imgKey: "creator",
      specs: {
        processor: "Intel Core Ultra 9 185H",
        ram: "32GB LPDDR5x",
        storage: "1TB NVMe SSD",
        display: "16 Dynamic AMOLED 2X 120Hz",
        gpu: "NVIDIA RTX 4070 8GB",
        battery: "76Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 2TB",
          type: "storage",
          modifier: 2500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["Dynamic AMOLED 2X", "Galaxy AI", "RTX 4070", "Thunderbolt 4"],
    },
    {
      name: "Samsung Galaxy Book3 360",
      brand: samsung,
      category: budget,
      slug: "samsung-galaxy-book3-360",
      motto: "Bend to Your Needs",
      badge: "Versatile Budget",
      description: "Affordable 2-in-1 with AMOLED.",
      basePrice: 12000000n,
      stock: 12,
      imgKey: "budget",
      specs: {
        processor: "Intel Core i5-1335U",
        ram: "8GB LPDDR4x",
        storage: "256GB NVMe SSD",
        display: "13.3 FHD AMOLED Touch",
        gpu: "Intel Iris Xe",
        battery: "63.5Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "8GB / 256GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 1500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["AMOLED Touch", "S Pen", "360 Hinge", "Wi-Fi 6E"],
    },
    {
      name: "LG Gram 17 2024",
      brand: lg,
      category: ultrabook,
      slug: "lg-gram-17-2024",
      motto: "Light as a Feather",
      badge: "Ultra Light",
      description: "Worlds lightest 17-inch laptop at 1.35kg.",
      basePrice: 21000000n,
      stock: 8,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core Ultra 7 155H",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "17 WQXGA IPS",
        gpu: "Intel Arc Graphics",
        battery: "90Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3000000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "1.35kg Weight",
        "MIL-STD-810H",
        "80Wh Battery",
        "Thunderbolt 4",
      ],
    },
    {
      name: "LG Gram 14 2024",
      brand: lg,
      category: ultrabook,
      slug: "lg-gram-14-2024",
      motto: "Portable Perfection",
      badge: "Compact",
      description: "Ultra-lightweight 14-inch laptop.",
      basePrice: 17000000n,
      stock: 10,
      imgKey: "ultrabook",
      specs: {
        processor: "Intel Core Ultra 5 125H",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "14 WUXGA IPS",
        gpu: "Intel Arc Graphics",
        battery: "72Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "16GB / 1TB",
          type: "storage",
          modifier: 1500000n,
          default: false,
          order: 2,
        },
      ],
      features: [
        "0.99kg Weight",
        "MIL-STD-810H",
        "DCI-P3 99%",
        "Thunderbolt 4",
      ],
    },
    {
      name: "LG Gram 16 2-in-1",
      brand: lg,
      category: creator,
      slug: "lg-gram-16-2in1",
      motto: "Create Anywhere",
      badge: "Versatile",
      description: "2-in-1 convertible with OLED display.",
      basePrice: 23000000n,
      stock: 6,
      imgKey: "creator",
      specs: {
        processor: "Intel Core Ultra 7 155H",
        ram: "16GB LPDDR5",
        storage: "512GB NVMe SSD",
        display: "16 OLED Touch 120Hz",
        gpu: "Intel Arc Graphics",
        battery: "77Wh",
        os: "Windows 11 Home",
      },
      configs: [
        {
          name: "16GB / 512GB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 3500000n,
          default: false,
          order: 2,
        },
      ],
      features: ["OLED Touch", "LG Stylus", "360 Hinge", "1.48kg"],
    },
    {
      name: "LG Gram Pro 16",
      brand: lg,
      category: business,
      slug: "lg-gram-pro-16",
      motto: "Professional Grade",
      badge: "AI Powered",
      description: "AI-powered business laptop with OLED.",
      basePrice: 26000000n,
      stock: 6,
      imgKey: "business",
      specs: {
        processor: "Intel Core Ultra 7 155H",
        ram: "32GB LPDDR5",
        storage: "1TB NVMe SSD",
        display: "16 OLED 120Hz",
        gpu: "Intel Arc Graphics",
        battery: "90Wh",
        os: "Windows 11 Pro",
      },
      configs: [
        {
          name: "32GB / 1TB",
          type: "storage",
          modifier: 0n,
          default: true,
          order: 1,
        },
      ],
      features: ["OLED 120Hz", "AI Capabilities", "1.19kg", "Thunderbolt 4 x2"],
    },
  ];

  const createdProducts = [];
  for (let i = 0; i < productsData.length; i++) {
    const p = productsData[i];
    const product = await prisma.product.create({
      data: {
        name: p.name,
        brandId: p.brand.id,
        categoryId: p.category.id,
        slug: p.slug,
        motto: p.motto,
        description: p.description,
        basePrice: p.basePrice,
        badge: p.badge,
        specs: p.specs,
        imageUrl: getImage(p.imgKey, i),
        stock: p.stock,
        isActive: true,
      },
    });
    for (const cfg of p.configs) {
      await prisma.productConfig.create({
        data: {
          productId: product.id,
          configName: cfg.name,
          configType: cfg.type,
          priceModifier: cfg.modifier,
          isDefault: cfg.default,
          displayOrder: cfg.order,
        },
      });
    }
    await prisma.productImage.createMany({
      data: [0, 1, 2].map((j) => ({
        productId: product.id,
        imageUrl: getImage(p.imgKey, i + j),
        isPrimary: j === 0,
        displayOrder: j + 1,
      })),
    });
    for (let fi = 0; fi < p.features.length; fi++) {
      await prisma.productFeature.create({
        data: {
          productId: product.id,
          title: p.features[fi],
          description: p.features[fi] + " engineered for maximum performance.",
          displayOrder: fi + 1,
        },
      });
    }
    createdProducts.push(product);
  }
  console.log("Products seeded: " + createdProducts.length);

  const wishlistData = [];
  for (const customer of customers) {
    const count = Math.floor(Math.random() * 4) + 2;
    const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
    const unique = new Set<number>();
    for (let i = 0; i < count && i < shuffled.length; i++) {
      if (!unique.has(shuffled[i].id)) {
        unique.add(shuffled[i].id);
        wishlistData.push({ userId: customer.id, productId: shuffled[i].id });
      }
    }
  }
  await prisma.wishlist.createMany({ data: wishlistData });
  console.log("Wishlists seeded: " + wishlistData.length);

  for (const customer of customers.slice(0, 15)) {
    const product =
      createdProducts[Math.floor(Math.random() * createdProducts.length)];
    const config = await prisma.productConfig.findFirst({
      where: { productId: product.id, isDefault: true },
    });
    if (config) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          userId: customer.id,
          productId: product.id,
          configId: config.id,
        },
      });
      if (!existing)
        await prisma.cartItem.create({
          data: {
            userId: customer.id,
            productId: product.id,
            configId: config.id,
            quantity: Math.floor(Math.random() * 2) + 1,
          },
        });
    }
  }
  console.log("Cart items seeded");

  const statuses = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  let orderCount = 0;
  for (const customer of customers) {
    const numOrders = Math.floor(Math.random() * 3) + 1;
    for (let o = 0; o < numOrders; o++) {
      const product =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const config = await prisma.productConfig.findFirst({
        where: { productId: product.id, isDefault: true },
      });
      if (!config) continue;
      const qty = Math.floor(Math.random() * 2) + 1;
      const unitPrice = product.basePrice + config.priceModifier;
      const totalPrice = unitPrice * BigInt(qty);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod =
        allPaymentMethods[Math.floor(Math.random() * allPaymentMethods.length)];
      const order = await prisma.order.create({
        data: {
          userId: customer.id,
          totalPrice,
          status,
          orderItems: {
            create: {
              productId: product.id,
              configId: config.id,
              quantity: qty,
              unitPrice,
            },
          },
        },
      });
      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymentMethodId: paymentMethod.id,
          amount: totalPrice,
          status:
            status === "cancelled"
              ? "failed"
              : status === "pending"
                ? "pending"
                : "success",
          transactionId:
            "TXN-" +
            Date.now() +
            "-" +
            Math.random().toString(36).slice(2, 7).toUpperCase(),
        },
      });
      orderCount++;
    }
  }

  console.log("Orders seeded: " + orderCount);

  const ratings = [3.5, 4.0, 4.0, 4.5, 4.5, 4.5, 5.0, 5.0, 3.0, 4.0];
  const reviewedPairs = new Set<string>();
  let reviewCount = 0;
  for (const customer of customers) {
    const numReviews = Math.floor(Math.random() * 4) + 1;
    const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
    for (let r = 0; r < numReviews && r < shuffled.length; r++) {
      const product = shuffled[r];
      const key = customer.id + "-" + product.id;
      if (reviewedPairs.has(key)) continue;
      reviewedPairs.add(key);
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: product.id,
          rating: ratings[Math.floor(Math.random() * ratings.length)],
          comment:
            reviewComments[Math.floor(Math.random() * reviewComments.length)],
        },
      });
      reviewCount++;
    }
  }
  console.log("Reviews seeded: " + reviewCount);

  console.log("\n SEEDING COMPLETE!");
  console.log(
    "Users: " +
      (customers.length + 1) +
      " | Products: " +
      createdProducts.length +
      " | Wishlists: " +
      wishlistData.length +
      " | Orders: " +
      orderCount +
      " | Reviews: " +
      reviewCount,
  );
  console.log("\nTest Accounts:");
  console.log("  Admin    -> admin / admin123");
  console.log("  Customer -> johndoe / user123");
  console.log("  Customer -> janedoe / user123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
