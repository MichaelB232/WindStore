"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  Users,
  Star,
  Building2,
  ArrowLeftCircle,
  LogOut,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/src/routes/adminRoutes";
import { ROUTES } from "@/src/routes/routes";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: ADMIN_ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ADMIN_ROUTES.PRODUCTS, label: "Products", icon: Package },
  { href: ADMIN_ROUTES.BRANDS, label: "Brands", icon: Building2 },
  { href: ADMIN_ROUTES.CATEGORIES, label: "Categories", icon: Tags },
  { href: ADMIN_ROUTES.CONFIGS, label: "Configs", icon: Layers },
  { href: ADMIN_ROUTES.REVIEWS, label: "Reviews", icon: Star },
  { href: ADMIN_ROUTES.USERS, label: "Users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.replace(ROUTES.LOGIN);
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-dark text-text-dark-primary">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border-dark px-6">
        <Link href={ADMIN_ROUTES.DASHBOARD} className="font-display text-xl font-bold text-white">
          WindStore
          <span className="ml-1.5 rounded-full bg-accent/20 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-accent-light">
            ADMIN
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === ADMIN_ROUTES.DASHBOARD
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-accent text-white shadow-sm"
                  : "text-text-dark-secondary hover:bg-dark-surface hover:text-text-dark-primary"
              }`}
            >
              <Icon className="size-4.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-border-dark px-3 py-4">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-dark-secondary transition-all hover:bg-dark-surface hover:text-text-dark-primary"
        >
          <ArrowLeftCircle className="size-4.5 shrink-0" />
          Back to store
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-dark-secondary transition-all hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="size-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
