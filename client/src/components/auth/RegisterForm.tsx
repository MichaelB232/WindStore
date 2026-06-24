// components/auth/RegisterForm.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock } from "lucide-react";

export default function RegisterForm() {
  return (
    <>
      {/* Tab switcher */}
      <div className="mb-8 flex rounded-full bg-muted p-1">
        <Link
          href="/login"
          className="flex-1 py-2 text-center text-sm font-medium text-muted-foreground"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="flex-1 rounded-full bg-accent py-2 text-center text-sm font-medium text-white"
        >
          Sign Up
        </Link>
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-3xl font-bold tracking-tight">
        Create your account
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Save builds, track orders, and pick up your configuration anytime.
      </p>

      {/* Form */}
      <form className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Jane Doe"
              className="pl-9"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="name@example.com"
              className="pl-9"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Verify Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-accent"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {/* Submit */}
        <Button className="w-full bg-accent hover:bg-indigo-700">
          Create Account
        </Button>
      </form>
    </>
  );
}