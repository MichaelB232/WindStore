"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function AuthContentTransition({
  children,
}: Props) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}