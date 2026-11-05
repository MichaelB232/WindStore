"use client";

import { useState } from "react";
import { CreditCard, Copy, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function MidtransTestCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} berhasil disalin!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/60 p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <CreditCard size={18} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-dark">
              Midtrans Sandbox Card
            </h3>
            <p className="text-xs text-muted-foreground">
              Testing credentials for reviewer / recruiter
            </p>
          </div>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          Demo
        </span>
      </div>

      <div className="mt-4 space-y-2.5 text-xs">
        {/* Card Number */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/80 px-3 py-2">
          <span className="text-muted-foreground">Card Number</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold tracking-wider text-dark">
              4811 1111 1111 1114
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard("4811111111111114", "Nomor Kartu")}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              title="Salin nomor kartu"
            >
              {copiedField === "Nomor Kartu" ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/80 px-3 py-2">
            <span className="text-muted-foreground">Valid Thru</span>
            <span className="font-mono font-semibold text-dark">12/28</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/80 px-3 py-2">
            <span className="text-muted-foreground">CVV</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-dark">123</span>
              <button
                type="button"
                onClick={() => copyToClipboard("123", "CVV")}
                className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                title="Salin CVV"
              >
                {copiedField === "CVV" ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3DS OTP */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white/80 px-3 py-2">
          <span className="text-muted-foreground">OTP (3DS Password)</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-dark">112233</span>
            <button
              type="button"
              onClick={() => copyToClipboard("112233", "OTP")}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              title="Salin OTP"
            >
              {copiedField === "OTP" ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <ShieldAlert size={13} className="mt-0.5 shrink-0 text-accent" />
        <span>
          Pilih metode <strong>Credit/Debit Card</strong> saat pop-up Midtrans Snap terbuka dan gunakan data di atas.
        </span>
      </div>
    </div>
  );
}

