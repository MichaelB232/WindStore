"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

export default function AuthTabs() {
  const pathname = usePathname();

  const isLogin = pathname === "/login";

  return (
    <div className="relative mb-8 flex rounded-full bg-muted p-1">
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-accent ${
          isLogin ? "left-1" : "left-1/2"
        }`}
      />

      <Link
        href="/login"
        className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors ${
          isLogin ? "text-white" : "text-muted-foreground"
        }`}
      >
        Sign In
      </Link>

      <Link
        href="/register"
        className={`relative z-10 flex-1 py-2 text-center text-sm font-medium transition-colors ${
          !isLogin ? "text-white" : "text-muted-foreground"
        }`}
      >
        Sign Up
      </Link>
    </div>
  );
}