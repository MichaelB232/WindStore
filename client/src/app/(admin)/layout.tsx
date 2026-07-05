"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/routes/routes";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(
        `${ROUTES.LOGIN}?from=${encodeURIComponent(pathname)}&unauthorized=1`,
      );
      return;
    }
    if (user.role !== "admin") {
      router.replace(ROUTES.HOME);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <Loader2 className="size-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <AdminSidebar />
      <div className="pl-64">{children}</div>
    </div>
  );
}
