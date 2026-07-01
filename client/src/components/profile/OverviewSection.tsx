"use client";

import { Mail, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { getInitials, getAvatarHue } from "@/src/lib/producttype/ReviewType";
import { ROUTES } from "@/src/routes/routes";

export default function OverviewSection() {
  const { user } = useAuth();

  if (!user) return null;

  const hue = getAvatarHue(user.username);

  return (
    <section className="flex flex-col gap-6">
      {/* Identity card */}
      <div className="flex items-center justify-between gap-6 rounded-3xl bg-white p-8 shadow-card">
        <div className="flex items-center gap-6 min-w-0">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
            style={{
              background: `hsl(${hue},60%,88%)`,
              color: `hsl(${hue},50%,35%)`,
            }}
          >
            {getInitials(user.username)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-3xl font-bold">
              {user.username}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick link to order history */}
      <Link
        href={ROUTES.PROFILE_ORDER_HISTORY}
        className="group flex items-center justify-between gap-6 rounded-3xl bg-white p-8 shadow-card transition ease-in duration-200 hover:shadow-card-hover"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-muted text-accent">
            <ShoppingBag size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold">Order History</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              View your paid and completed orders
            </p>
          </div>
        </div>
        <ArrowRight
          size={20}
          className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </Link>
    </section>
  );
}
