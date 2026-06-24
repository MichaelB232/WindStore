import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/src/routes/routes"

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left */}
      <div className="flex items-center justify-center px-8 py-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-accent">WindStore</h1>
            </div>
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Back to shop
            </Link>
          </div>

          {/* Page content*/}
          <div>{children}</div>
        </div>
      </div>

      {/* Right */}
      <div className="relative hidden lg:flex items-center justify-center bg-linear-to-br from-indigo-50 to-violet-100 p-10">
        <div className="max-w-md text-center">
          <Image
            src="/AuthPage/Right_Section_Image.png"
            alt="Image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}