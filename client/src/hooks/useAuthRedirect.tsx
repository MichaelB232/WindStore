"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/src/services/auth.service";
import {ROUTES} from "@/src/routes/routes";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentUser();

      if (user) {
        router.replace(ROUTES.HOME); // atau dashboard
      }
    };

    check();
  }, [router]);
}