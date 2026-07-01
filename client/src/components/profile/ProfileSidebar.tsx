"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, ShoppingBag } from "lucide-react";
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
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <ol className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-muted text-accent"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                }`}
              >
                <Icon size={20} />
                <p>{label}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
