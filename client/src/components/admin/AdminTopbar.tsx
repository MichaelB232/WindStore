"use client";

import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function AdminTopbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-8 backdrop-blur">
      <div>
        <h1 className="font-display text-lg font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="text-xs text-text-secondary">{description}</p>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5">
          <ShieldCheck className="size-4 text-accent" />
          <span className="text-sm font-medium text-text-primary">{user.username}</span>
        </div>
      )}
    </header>
  );
}
