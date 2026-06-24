"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { login } from "@/src/services/auth.service";
import { validateLoginForm } from "@/src/services/validators/auth.validator";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(username, password);

    setErrors(validationErrors);

    if (validationErrors.username || validationErrors.password) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({
        username: "",
        password: "",
        general: "",
      });

      const result = await login({
        username,
        password,
      });

      console.log(result);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Login gagal",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Heading */}
      <h2 className="mb-2 text-3xl font-bold tracking-tight">Welcome back</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Sign in to manage your saved builds and orders.
      </p>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              placeholder="name@example.com"
              className="pl-9"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-danger">{errors.username}</p>
          )}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-danger">{errors.password}</p>
          )}
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
          <Link href="/" className="text-sm text-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        {errors.general && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}
        <Button
          className="w-full bg-accent hover:bg-accent-hover"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
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
