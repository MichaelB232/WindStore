// components/auth/LoginForm.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  return (
    <>
      {/* Tab switcher */}
      <div className="mb-8 flex rounded-full bg-muted p-1">
        <Link
          href="/login"
          className="flex-1 rounded-full bg-accent py-2 text-center text-sm font-medium text-white"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="flex-1 py-2 text-center text-sm font-medium text-muted-foreground"
        >
          Sign Up
        </Link>
      </div>

      {/* Heading */}
      <h2 className="mb-2 text-3xl font-bold tracking-tight">Welcome back</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Sign in to manage your saved builds and orders.
      </p>

      {/* Form */}
      <form className="space-y-4">
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

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-accent"
            />
            Remember me
          </label>
          <Link
            href="/"
            className="text-sm text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button className="w-full bg-accent hover:bg-accent-hover">
          Sign In
        </Button>
      </form>

      {/* OAuth divider */}
      {/* <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-border" />
      </div> */}

      {/* OAuth buttons */}
      {/* <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="gap-2"> */}
          {/* Google icon */}
          {/* <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button> */}

        {/* <Button variant="outline" type="button" className="gap-2"> */}
          {/* Microsoft icon */}
          {/* <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
            <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
            <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
            <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
          </svg>
          Microsoft
        </Button> */}
      {/* </div> */}
    </>
  );
}