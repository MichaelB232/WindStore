"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, ShoppingBag, Settings } from "lucide-react";
import { ROUTES } from "@/src/routes/routes";

const NAV_ITEMS = [
  {
    href: ROUTES.PROFILE,
    label: "Account Overview",
    icon: CircleUserRound,
  },
  {
    href: ROUTES.PROFILE_ORDER_HISTORY,
    label: "Order History",
    icon: ShoppingBag,
  },
  {
    href: ROUTES.SETTING,
    label: "Account Settings",
    icon: Settings,
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <ol className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-2 lg:pb-0 scrollbar-none">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                className={`flex items-center gap-2.5 sm:gap-4 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "bg-accent-muted text-accent font-semibold"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text-primary bg-white lg:bg-transparent border lg:border-none border-border"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <p>{label}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
