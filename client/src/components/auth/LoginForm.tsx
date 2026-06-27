"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import { User, Lock } from "lucide-react";
import { useState } from "react";
import { login } from "@/src/services/auth/auth.service";
import { validateLoginForm } from "@/src/services/auth/validators/auth.validator";
import { ROUTES } from "@/src/routes/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { SuccessAlert } from "../ui/alert/successalert";
import { DangerAlert } from "../ui/alert/dangeralert";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?from=/cart  →  redirect here after login
  // ?unauthorized=1  →  show danger alert
  const from = searchParams.get("from");
  const isUnauthorized = searchParams.get("unauthorized") === "1";

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(username, password);
    setErrors(validationErrors);
    if (validationErrors.username || validationErrors.password) return;

    try {
      setIsLoading(true);
      setErrors({ username: "", password: "", general: "" });

      await login({ username, password });

      setShowSuccess(true);
      
      setTimeout(async() => {
        await refreshUser();
        router.push(from ?? ROUTES.HOME);
      }, 1500);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Login failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Unauthorized access alert */}
      {isUnauthorized && !showSuccess && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <DangerAlert
            title="Login Required"
            description={
              from
                ? `You need to be logged in to access that page. Please sign in to continue.`
                : "You need to be logged in to access that page."
            }
          />
        </div>
      )}

      {/* Success alert */}
      {showSuccess && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <SuccessAlert
            title="Login Successful"
            description={`Welcome back, ${username}! Redirecting you${from ? " back" : ""}…`}
          />
        </div>
      )}

      <h2 className="mb-2 text-3xl font-bold tracking-tight">Welcome back</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Sign in to manage your saved builds and orders.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="your username"
              className="pl-9"
              disabled={showSuccess}
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
              disabled={showSuccess}
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

        {errors.general && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}

        <Button
          className="w-full bg-accent hover:bg-accent-hover"
          type="submit"
          disabled={isLoading || showSuccess}
        >
          {isLoading ? "Signing in…" : showSuccess ? "Redirecting…" : "Sign In"}
        </Button>
      </form>
    </>
  );
}
