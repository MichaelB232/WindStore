import {
  Gamepad2,
  Sun,
  Palette,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
};

export type Product = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  motto: string;
  description: string;
  features: Feature[];
  specs: string[];
  price: string;
  originalPrice?: string;
  badge?: "NEW" | "FEATURED" | "HOT DEAL";
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
};

export const catalogProducts: Product[] = [
  {
    id: 1,
    brand: "ASUS",
    slug: "ROG-Zephrus-G14",
    name: "ROG Zephyrus G14",
    motto: "Power Without Compromise",
    description:
      "The ROG Zephyrus G14 combines flagship gaming performance with exceptional portability, making it ideal for gamers, creators, and professionals who demand desktop-class power in a compact form factor.",
    features: [
      {
        title: "INTELLIGENT COOLING",
        description:
          "Advanced thermal system with liquid metal cooling for sustained peak performance.",
      },
      {
        title: "ALL-DAY BATTERY",
        description:
          "Efficient power management delivers extended productivity and entertainment.",
      },
      {
        title: "NEBULA DISPLAY",
        description:
          "High refresh-rate QHD panel with vivid colors and exceptional clarity.",
      },
    ],
    specs: ["AMD Ryzen 9", "RTX 4060", "32GB RAM"],
    price: "$1,699",
    originalPrice: "$1,999",
    badge: "NEW",
    rating: 4,
    reviewCount: 42,
    image:
      "https://images.unsplash.com/photo-1698512475067-74ed7c956c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Gaming",
  },
  {
    id: 2,
    brand: "HP",
    slug: "Spectre-x360-14",
    name: "Spectre x360 14",
    motto: "Elegance Meets Versatility",
    description:
      "Designed for professionals and creatives, the Spectre x360 delivers premium craftsmanship, a stunning touchscreen display, and the flexibility of a convertible design.",
    features: [
      {
        title: "360° CONVERTIBLE",
        description:
          "Switch seamlessly between laptop, tablet, tent, and presentation modes.",
      },
      {
        title: "OLED TOUCHSCREEN",
        description:
          "Vibrant colors, deep blacks, and responsive touch interaction.",
      },
      {
        title: "PREMIUM BUILD",
        description:
          "Crafted from CNC aluminum with a refined, luxurious finish.",
      },
    ],
    specs: ["Core Ultra 7", "Intel Arc", "16GB RAM"],
    price: "$1,399",
    originalPrice: "$1,699",
    badge: "FEATURED",
    rating: 4.5,
    reviewCount: 128,
    image:
      "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Ultrabook",
  },
  {
    id: 3,
    brand: "Lenovo",
    slug: "Yoga-Pro-9i-Gen-9",
    name: "Yoga Pro 9i Gen 9",
    motto: "Create Without Limits",
    description:
      "The Yoga Pro 9i is engineered for content creators with powerful hardware, AI-assisted workflows, and a color-accurate display built for professional work.",
    features: [
      {
        title: "CREATOR PERFORMANCE",
        description:
          "High-end CPU and GPU power accelerate rendering and creative workloads.",
      },
      {
        title: "PURESIGHT PRO DISPLAY",
        description:
          "Factory-calibrated panel with exceptional color accuracy.",
      },
      {
        title: "AI ACCELERATION",
        description:
          "Built-in AI capabilities streamline productivity and creative tasks.",
      },
    ],
    specs: ["Intel i9", "RTX 4070", "32GB RAM"],
    price: "$1,849",
    originalPrice: "$2,199",
    badge: "HOT DEAL",
    rating: 4,
    reviewCount: 86,
    image:
      "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Creative Pro",
  },
  {
    id: 4,
    brand: "MSI",
    slug: "Stealth-16-Studio",
    name: "Stealth 16 Studio",
    motto: "Dominate Every Frame",
    description:
      "The MSI Stealth 16 Studio is built for those who refuse to choose between raw gaming power and professional-grade creative performance, housing the highest-tier GPU in a sleek, stealthy chassis.",
    features: [
      {
        title: "RTX 4090 FLAGSHIP",
        description:
          "Top-of-the-line discrete GPU handles the most demanding games and renders at full speed.",
      },
      {
        title: "64GB WORKSTATION MEMORY",
        description:
          "Massive RAM headroom for multitasking across heavy creative and development workloads.",
      },
      {
        title: "STEALTH CHASSIS",
        description:
          "CNC-machined aluminum body keeps the machine thin without sacrificing thermal headroom.",
      },
    ],
    specs: ["Core Ultra 9", "RTX 4090", "64GB RAM"],
    price: "$2,799",
    rating: 5,
    reviewCount: 214,
    image:
      "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Gaming",
  },
  {
    id: 5,
    brand: "Dell",
    slug: "XPS-15-OLED",
    name: "XPS 15 OLED",
    motto: "The Creator's Canvas",
    description:
      "The Dell XPS 15 OLED is the benchmark for premium creative laptops — a stunning OLED display, professional-grade GPU, and iconic InfinityEdge design that puts the work front and center.",
    features: [
      {
        title: "OLED INFINITYEDGE",
        description:
          "Near-borderless OLED panel delivers cinema-quality color and contrast for precision work.",
      },
      {
        title: "RTX 4070 Ti PERFORMANCE",
        description:
          "High-end GPU accelerates video export, 3D rendering, and AI-assisted workflows.",
      },
      {
        title: "STUDIO ACOUSTICS",
        description:
          "Quad-speaker system tuned for immersive audio during editing and playback.",
      },
    ],
    specs: ["Intel i9", "RTX 4070 Ti", "64GB RAM"],
    price: "$2,499",
    badge: "FEATURED",
    rating: 4.5,
    reviewCount: 193,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Creative Pro",
  },
  {
    id: 6,
    brand: "Acer",
    slug: "Predator-Helios-300",
    name: "Predator Helios 300",
    motto: "Hunt. Win. Repeat.",
    description:
      "The Predator Helios 300 is Acer's proven gaming workhorse — delivering RTX-powered performance, aggressive cooling, and a high-refresh display at a price that punches well above its class.",
    features: [
      {
        title: "KILLER THERMALS",
        description:
          "AeroBlade 3D fans and dual-exhaust venting sustain peak clock speeds under extended load.",
      },
      {
        title: "165Hz IPS DISPLAY",
        description:
          "High-refresh panel keeps fast-paced gameplay smooth and tear-free.",
      },
      {
        title: "PREDATORGUARD RGB",
        description:
          "Per-key RGB lighting with PredatorSense software for full customization.",
      },
    ],
    specs: ["Intel i7", "RTX 4070", "16GB RAM"],
    price: "$1,349",
    originalPrice: "$1,599",
    badge: "HOT DEAL",
    rating: 4,
    reviewCount: 307,
    image:
      "https://images.unsplash.com/photo-1675868374307-025c23247290?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Gaming",
  },
  {
    id: 7,
    brand: "Razer",
    slug: "Blade-16",
    name: "Blade 16",
    motto: "No Compromises. Ever.",
    description:
      "The Razer Blade 16 sets the bar for what a premium gaming laptop can be — an RTX 4090 inside an anodized aluminum unibody, paired with a dual-mode Mini LED display that rivals studio monitors.",
    features: [
      {
        title: "DUAL-MODE MINI LED",
        description:
          "Switch between 4K 120Hz and FHD 240Hz on a single display for the best of both worlds.",
      },
      {
        title: "RTX 4090 FULL POWER",
        description:
          "Unlocked TGP delivers maximum GPU performance without thermal throttling.",
      },
      {
        title: "VAPOR CHAMBER COOLING",
        description:
          "Industrial-grade cooling solution handles sustained maximum loads with ease.",
      },
    ],
    specs: ["Intel i9", "RTX 4090", "32GB RAM"],
    price: "$4,299",
    badge: "NEW",
    rating: 5,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1626218174358-7769486c4b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Gaming",
  },
  {
    id: 8,
    brand: "Lenovo",
    slug: "ThinkPad-X1-Carbon-Gen-11",
    name: "ThinkPad X1 Carbon Gen 11",
    motto: "Business Without Boundaries",
    description:
      "The ThinkPad X1 Carbon Gen 11 is the gold standard for enterprise mobility — featherlight carbon fiber construction, MIL-SPEC durability, and a keyboard that professionals trust for long-haul productivity.",
    features: [
      {
        title: "CARBON FIBER BUILD",
        description:
          "Sub-1.1kg chassis passes 12 MIL-SPEC tests for drops, dust, humidity, and vibration.",
      },
      {
        title: "THINKSHIELD SECURITY",
        description:
          "Hardware-level security features protect data across every layer of the device.",
      },
      {
        title: "LEGENDARY KEYBOARD",
        description:
          "ThinkPad's iconic keyboard design optimized for accuracy and long-session comfort.",
      },
    ],
    specs: ["Intel Core Ultra 7", "Intel Arc", "16GB RAM"],
    price: "$1,499",
    rating: 4,
    reviewCount: 412,
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Business",
  },
  {
    id: 9,
    brand: "Microsoft",
    slug: "Surface-Laptop-Studio-2",
    name: "Surface Laptop Studio 2",
    motto: "Built for What's Next",
    description:
      "The Surface Laptop Studio 2 reimagines the creative workstation with a unique pull-forward display, a powerful GPU, and Surface Slim Pen support that makes it the most versatile Studio device yet.",
    features: [
      {
        title: "DYNAMIC WOVEN HINGE",
        description:
          "Pull the display forward into Studio mode for drawing, inking, and presenting.",
      },
      {
        title: "SURFACE SLIM PEN 2",
        description:
          "Haptic feedback pen gives a natural drawing experience with zero perceptible latency.",
      },
      {
        title: "STUDIO DISPLAY",
        description:
          "120Hz PixelSense Flow touchscreen with HDR and Dolby Vision support.",
      },
    ],
    specs: ["Intel i7", "RTX 4060", "32GB RAM"],
    price: "$2,099",
    badge: "FEATURED",
    rating: 4.5,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Creative Pro",
  },
  {
    id: 10,
    brand: "ASUS",
    slug: "Zenbook-Pro-16X",
    name: "Zenbook Pro 16X",
    motto: "Precision Crafted for Creators",
    description:
      "The Zenbook Pro 16X brings workstation-grade power into a refined, portable chassis — purpose-built for creative professionals who need accurate color, serious GPU muscle, and all-day endurance.",
    features: [
      {
        title: "OLED PROART DISPLAY",
        description:
          "PANTONE-validated panel with 120Hz refresh and hardware-level color accuracy.",
      },
      {
        title: "DIAL CONTROL",
        description:
          "Physical ASUS Dial integrates natively with Adobe apps for tactile creative control.",
      },
      {
        title: "DUAL FAN COOLING",
        description:
          "IceCool Pro thermal system sustains peak CPU and GPU loads across extended sessions.",
      },
    ],
    specs: ["Intel i9", "RTX 4070", "32GB RAM"],
    price: "$2,299",
    originalPrice: "$2,599",
    rating: 4,
    reviewCount: 74,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Creative Pro",
  },
  {
    id: 11,
    brand: "Dell",
    slug: "Inspiron-14-2-in-1",
    name: "Inspiron 14 2-in-1",
    motto: "Smart Value, Real Versatility",
    description:
      "The Dell Inspiron 14 2-in-1 is the perfect companion for students and everyday users — a convertible design, capable AMD processor, and a price that makes premium features accessible.",
    features: [
      {
        title: "2-IN-1 FLEXIBILITY",
        description:
          "Rotate the touchscreen 360° to switch between laptop, tablet, tent, and stand modes.",
      },
      {
        title: "AMD RYZEN EFFICIENCY",
        description:
          "Ryzen 7 processor balances strong everyday performance with excellent battery life.",
      },
      {
        title: "COMPACT & LIGHT",
        description:
          "Thin profile and lightweight build make it easy to carry through a full day.",
      },
    ],
    specs: ["AMD Ryzen 7", "Radeon 780M", "16GB RAM"],
    price: "$899",
    badge: "NEW",
    rating: 3.5,
    reviewCount: 63,
    image:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Student",
  },
  {
    id: 12,
    brand: "HP",
    slug: "EliteBook-840-G10",
    name: "EliteBook 840 G10",
    motto: "Enterprise-Grade. Every Day.",
    description:
      "The HP EliteBook 840 G10 is HP's flagship business laptop — built to meet the demands of IT-managed enterprise environments with AI-enhanced collaboration features and military-grade durability.",
    features: [
      {
        title: "HP WOLF SECURITY",
        description:
          "Hardware-enforced security stack protects against firmware, BIOS, and OS-level threats.",
      },
      {
        title: "AI NOISE CANCELLATION",
        description:
          "Poly Studio audio with AI filters removes background noise for crystal-clear calls.",
      },
      {
        title: "MIL-SPEC DURABILITY",
        description:
          "Tested to MIL-STD-810H standards for drops, temperature extremes, and vibration.",
      },
    ],
    specs: ["Intel Core Ultra 5", "Intel Iris Xe", "16GB RAM"],
    price: "$1,199",
    rating: 4,
    reviewCount: 228,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    category: "Business",
  },
];

export const brands = [
  "ASUS",
  "HP",
  "Lenovo",
  "MSI",
  "Dell",
  "Acer",
  "Razer",
  "Microsoft",
];

export const categories = [
  { label: "Gaming", icon: <Gamepad2 /> },
  { label: "Ultrabook", icon: <Sun /> },
  { label: "Creative Pro", icon: <Palette /> },
  { label: "Business", icon: <BriefcaseBusiness /> },
  { label: "Student", icon: <GraduationCap /> },
];

export const processors = [
  "Intel Core Ultra 7",
  "Intel i9",
  "AMD Ryzen 9",
  "Core Ultra 9",
];
