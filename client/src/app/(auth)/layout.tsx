import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/src/routes/routes";
import AuthTabs from "@/src/components/auth/AuthTabs";
import AuthContentTransition from "@/src/components/auth/AuthContentTransition";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}
      <div className="flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-xl font-bold text-accent">
              WindStore
            </h1>

            <Link
              href={ROUTES.HOME}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to shop
            </Link>
          </div>

          <AuthTabs />

          <div className="min-h-155">
            <AuthContentTransition>
              {children}
            </AuthContentTransition>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative hidden lg:flex items-center justify-center bg-linear-to-br from-indigo-50 to-violet-100">
        <Image
          src="/AuthPage/Right_Section_Image.png"
          alt="Image"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}