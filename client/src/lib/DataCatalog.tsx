import { Gamepad2, Sun, Palette, BriefcaseBusiness, GraduationCap } from "lucide-react";



export type Product = {
  id: number;
  brand: string;
  name: string;
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
    name: "ROG Zephyrus G14",
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
    name: "Spectre x360 14",
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
    name: "Yoga Pro 9i Gen 9",
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
    name: "Stealth 16 Studio",
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
    name: "XPS 15 OLED",
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
    name: "Predator Helios 300",
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
    name: "Blade 16",
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
    name: "ThinkPad X1 Carbon Gen 11",
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
    name: "Surface Laptop Studio 2",
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
    name: "Zenbook Pro 16X",
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
    name: "Inspiron 14 2-in-1",
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
    name: "EliteBook 840 G10",
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
  "ASUS", "HP", "Lenovo", "MSI", "Dell", "Acer", "Razer", "Microsoft",
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
