"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { User, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { validateRegisterForm } from "@/src/services/auth/validators/auth.validator";
import { register } from "@/src/services/auth/auth.service";
import { ROUTES } from "@/src/routes/routes";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(
      username,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    );

    setErrors(validationErrors);

    if (
      validationErrors.username ||
      validationErrors.email ||
      validationErrors.password ||
      validationErrors.confirmPassword ||
      validationErrors.terms
    ) {
      return;
    }

    try {
      setIsLoading(true);

      await register({
        username,
        email,
        password,
      });
      
      router.replace(ROUTES.LOGIN);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "Register gagal",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Heading */}
      <h2 className="mb-2 text-3xl font-bold tracking-tight">
        Create your account
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Save builds, track orders, and pick up your configuration anytime.
      </p>

      {/* Form */}
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
              placeholder="Jane Doe"
              className="pl-9"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-danger">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@example.com"
              className="pl-9"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-danger">{errors.email}</p>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-danger">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Verify Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-danger">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
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
        {errors.terms && <p className="text-sm text-danger">{errors.terms}</p>}

        {/* Submit */}
        {errors.general && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errors.general}
          </div>
        )}
        <Button
          className="w-full bg-accent hover:bg-indigo-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating your account..." : "Create Account"}
        </Button>
      </form>
    </>
  );
}
