"use client";

import { User, Mail } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function CustomerInfoCard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold mb-6">
        Customer Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <User size={16} className="text-accent shrink-0" />
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium ml-auto truncate">{user.username}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail size={16} className="text-accent shrink-0" />
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium ml-auto truncate">{user.email}</span>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        This information will be used for your payment receipt.
      </p>
    </div>
  );
}
