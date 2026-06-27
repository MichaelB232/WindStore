"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import Navbar from "@/src/components/layout/navbar/Navbar";
import Footer from "@/src/components/layout/Footer";
import { ROUTES } from "@/src/routes/routes";

export default function ProtectedLayout({
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
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) return null;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
