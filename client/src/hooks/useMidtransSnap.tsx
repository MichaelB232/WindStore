"use client";

import { useCallback, useEffect, useState } from "react";

type SnapResult = Record<string, unknown>;

type SnapCallbacks = {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (token: string, callbacks?: SnapCallbacks) => void;
    };
  }
}

const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const SNAP_SRC = isProduction
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

function isSnapLoaded() {
  return typeof window !== "undefined" && !!window.snap;
}

export function useMidtransSnap() {

  const [isReady, setIsReady] = useState(isSnapLoaded);

  useEffect(() => {
    if (typeof window === "undefined" || window.snap) return;

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    if (!clientKey) {
      console.error(
        "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not set — Snap.js cannot be loaded.",
      );
      return;
    }
    const handleLoad = () => setIsReady(true);
    const handleError = () =>
      console.error("Failed to load Midtrans Snap.js script.");

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SNAP_SRC}"]`,
    );

    if (existing) {
      existing.addEventListener("load", handleLoad);
      return () => existing.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.src = SNAP_SRC;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  const pay = useCallback((token: string, callbacks?: SnapCallbacks) => {
    if (!window.snap) {
      callbacks?.onError?.({ message: "Payment system is not ready yet" });
      return;
    }
    window.snap.pay(token, callbacks);
  }, []);

  return { isReady, pay };
}
